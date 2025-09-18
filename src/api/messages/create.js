// src/api/messages/create.js

export async function onRequest(context) {
  // The middleware has already run and attached the user to context.data
  const { data, env, request } = context;
  const user = data.user;
  const db = env.DB;

  if (!user) {
    // This case should be handled by the middleware, but it's a good fail-safe
    return new Response("Unauthorized", { status: 401 });
  }

  // Your message creation logic using a verifed `user.id`
  try {
    const { content } = await request.json();
    await db
      .prepare("INSERT INTO messages (content, user_id) VALUES (?, ?)")
      .bind(content, user.id)
      .run();
    return new Response("Message posted successfully", { status: 201 });
  } catch (error) {
    return new Response(`Error posting message: ${error.message}`, {
      status: 500,
    });
  }
}
