import React, { useState, useEffect } from "react";
import "./App.css";
import LoginButton from "./components/LoginButton.jsx";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

const handleLogin = () => {
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:read`;
  window.location.href = url;
};

// Inside your component's JSX
<button onClick={handleLogin}>Login with GitHub</button>;
function App() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // This function fetches messages from our API
  const fetchMessages = async () => {
    setIsLoading(true);
    const response = await fetch("/api/messages");
    const data = await response.json();
    setMessages(data);
    setIsLoading(false);
  };

  // useEffect runs once when the component first loads.
  // It's the perfect place to fetch initial data.
  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (data.isAuthenticated) {
        setUser(data.user);
      }
      setIsLoading(false);
    };
    checkUser();
    fetchMessages();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // This function handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    // Clear the form and refresh the messages
    setForm({ name: "", message: "" });
    fetchMessages();
  };

  return (
    <div className="app-container">
      <h1>Cloudflare D1 Guestbook</h1>
      <LoginButton />
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleInputChange}
          required
        ></textarea>
        <button type="submit">Sign Guestbook</button>
      </form>

      <div className="messages-list">
        {isLoading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message-card">
              <p>"{msg.message}"</p>
              <small>
                — {msg.name} on {new Date(msg.timestamp).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
