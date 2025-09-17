// This file is the main "view" of our application.
import "./App.css"; // Add this line
import BusinessCard from "./components/BusinessCard";

function App() {
  return (
    <div className="app-container">
      <BusinessCard />
    </div>
  );
}

export default App;
