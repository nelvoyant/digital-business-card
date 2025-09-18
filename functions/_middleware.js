// /functions/_middleware.js
export async function onRequest(context) {
  const { request, env } = context;
  const db = env.DB;

  // Check for the session_token cookie
  const cookies = request.headers.get("Cookie");
  const sessionToken = cookies
    ?.split(";")
    .map((p) => p.trim().split("="))
    .find(([key]) => key === "session_token")?.[1];

  // Exclude the login/logout routes from authentication
  if (request.url.includes("/auth/")) {
    return context.next();
  }

  // Continue with the authentication logic
  if (!sessionToken) {
    // Return a response for non-authenticated requests
    return new Response("Unauthorized", { status: 401 });
  }

  const session = await db
    .prepare(
      "SELECT * FROM sessions WHERE token = ? AND expires_at > CURRENT_TIMESTAMP"
    )
    .bind(sessionToken)
    .first();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Attach the user to the context
  const user = await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(session.user_id)
    .first();
  context.data.user = user;

  return context.next();
}
