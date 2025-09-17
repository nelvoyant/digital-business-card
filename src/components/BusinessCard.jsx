// NEW: We need to import 'useState' from React.
import { useState } from "react";

function BusinessCard() {
  // NEW: This is the 'useState' hook.
  // 'showFact' is our state variable (like @IsFactVisible). Its initial value is 'false'.
  // 'setShowFact' is the *only* function we should use to update it.
  const [showFact, setShowFact] = useState(false);

  // NEW: This function will be called when the button is clicked.
  const handleToggleFact = () => {
    // We call our setter function with the *new* value.
    // The '!' operator flips the boolean value (true -> false, false -> true).
    console.log("Button clicked! The current value of showFact is:", showFact);
    setShowFact(!showFact);
  };

  return (
    <div className="card">
      <img
        className="avatar"
        src="https://via.placeholder.com/150"
        alt="Your Name"
      />
      <div className="card-content">
        <h2>Your Name Here</h2>
        <p>Senior SQL Developer</p>
        <div className="social-links">
          <a href="https://linkedin.com" target="_blank">
            LinkedIn
          </a>
          <a href="https://github.com" target="_blank">
            GitHub
          </a>
          <a href="https://twitter.com" target="_blank">
            Twitter
          </a>
        </div>
      </div>

      {/* --- NEW SECTION --- */}
      <div className="fun-fact-section">
        <button onClick={handleToggleFact}>
          {showFact ? "Hide Fact" : "Show Fun Fact"}
        </button>

        {/* This is conditional rendering. The <p> tag will ONLY be rendered IF showFact is true. */}
        {showFact && (
          <p className="fun-fact">
            Fun Fact: I can normalize a database schema in my sleep.
          </p>
        )}
      </div>
      {/* --- END NEW SECTION --- */}
    </div>
  );
}

export default BusinessCard;
