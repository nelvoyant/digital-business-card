// src/api/auth/logout.js
export async function onRequestPost(context) {
  // Clear the secure session cookie by setting its expiration to the past
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    "session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax"
  );

  return new Response("Logged out successfully", {
    status: 200,
    headers,
  });
}
