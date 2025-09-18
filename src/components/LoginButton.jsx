import React from "react";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

const handleLogin = () => {
  if (!GITHUB_CLIENT_ID || !GITHUB_REDIRECT_URI) {
    console.error("Missing GitHub environment variables.");
    return;
  }
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:read`;
  window.location.href = url;
};

const LoginButton = () => {
  return <button onClick={handleLogin}>Login with GitHub</button>;
};

export default LoginButton;
