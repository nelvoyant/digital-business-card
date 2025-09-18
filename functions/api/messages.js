// This function will handle all GET requests to /api/messages
export async function onRequestGet({ env }) {
  // 'env' is an object containing bindings, including our D1 database.
  // We've named our binding 'DB' (we'll configure this later).

  // This is our SQL query. It's a prepared statement.
  const ps = env.DB.prepare("SELECT * FROM messages ORDER BY timestamp DESC");
  const { results } = await ps.all();

  // We return the results as a JSON response.
  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
}

// This function will handle all POST requests to /api/messages
export async function onRequestPost({ request, env }) {
  // Get the new message data from the request body.
  const newMessage = await request.json();

  if (!newMessage.name || !newMessage.message) {
    return new Response("Name and message are required", { status: 400 });
  }

  // Use parameter binding to prevent SQL injection!
  // This is the same principle as using sp_executesql or other parameterized query methods.
  const ps = await env.DB.prepare(
    "INSERT INTO messages (name, message) VALUES (?, ?)"
  ).bind(newMessage.name, newMessage.message);

  await ps.run();

  // Return a success response.
  return new Response("Message added successfully", { status: 201 });
}
