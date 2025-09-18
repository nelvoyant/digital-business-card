// src/api/auth/callback.js
export async function onRequestGet(context) {
  const { request, env } = context;
  const { code } = new URL(request.url).searchParams;
  const db = env.DB; // Assumes your D1 binding is named DB

  // Access environment variables from the `env` object
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

  if (!code) {
    return new Response("No authorization code provided.", { status: 400 });
  }

  try {
    // Step 1: Exchange the code for a GitHub access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID, // Public ID from your wrangler.toml
          client_secret: import.meta.env.GITHUB_CLIENT_SECRET, // Secure secret from wrangler secrets
          code: code,
        }),
      }
    );

    const { access_token } = await tokenResponse.json();
    if (!access_token) {
      return new Response("Failed to get access token.", { status: 400 });
    }

    // Step 2: Fetch the authenticated user's profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "User-Agent": "Guestbook-App",
      },
    });
    const githubUser = await userResponse.json();

    // Step 3: Find or create the user in your D1 database
    let userResult = await db
      .prepare("SELECT * FROM users WHERE github_id = ?")
      .bind(githubUser.id)
      .first();

    if (!userResult) {
      // User does not exist, so create a new one
      userResult = await db
        .prepare(
          "INSERT INTO users (github_id, username, avatar_url) VALUES (?, ?, ?) RETURNING id"
        )
        .bind(githubUser.id, githubUser.login, githubUser.avatar_url)
        .run();
      userResult = userResult.results[0]; // Get the newly created user's data
    }

    // Step 4: Create a secure session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(); // 7 days

    await db
      .prepare(
        "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)"
      )
      .bind(sessionToken, userResult.id, expiresAt)
      .run();

    // Step 5: Set the secure, httpOnly cookie and redirect
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `session_token=${sessionToken}; Path=/; Expires=${new Date(
        expiresAt
      ).toUTCString()}; HttpOnly; Secure; SameSite=Lax`
    );
    headers.append("Location", "/"); // Redirect to the homepage

    return new Response(null, {
      status: 302,
      headers,
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
