// src/api/user.js
import { authenticate } from "../../middleware/auth";

export async function onRequestGet(context) {
  const authResult = await authenticate(context);
  if (authResult.status !== 200) {
    return new Response(JSON.stringify({ isAuthenticated: false }), {
      status: 200,
    });
  }
  return new Response(
    JSON.stringify({
      isAuthenticated: true,
      user: context.user,
    }),
    { status: 200 }
  );
}
