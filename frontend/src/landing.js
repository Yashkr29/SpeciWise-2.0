import "../styles/Landing.css";

function Landing({ setPage }) {
  return (
    <div className="landing">

      {/* BACKGROUND BLOBS */}
      <div className="bg-shape shape1"></div>
      <div className="bg-shape shape2"></div>

      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">SpeciWise</h2>
      </nav>

      {/* HERO */}
      <div className="hero">
        <h1 className="hero-title">
          Discover Your{" "}
          <span className="gradient-text">Perfect Career</span>
        </h1>

        <p className="hero-subtitle">
          A smart system that guides you from confusion to clarity.
        </p>
      </div>

      {/* INFO SECTION */}
      <div className="info-section">

        <h2>What is this test?</h2>
        <p>
          This is a smart career assessment designed for students after 12th and in College.
          It analyzes your interests, thinking style, and preferences to suggest
          the most suitable engineering field.
        </p>

        <h2>How does it work?</h2>

        <div className="steps">
          <div className="step-card">
            <h3>1️⃣ Domain Test</h3>
            <p>Identify your overall interest area.</p>
          </div>

          <div className="step-card">
            <h3>2️⃣ Branch Test</h3>
            <p>Narrow down to a specific engineering branch.</p>
          </div>

          <div className="step-card">
            <h3>3️⃣ Specialization</h3>
            <p>Choose the best specialization for you.</p>
          </div>
        </div>

        <h2>🎯 What will you get?</h2>
        <p>
          A clear recommendation of your overall interest and ideal engineering field along with
          insights about your strengths and future career path.
        </p>

        <button
          className="cta-btn bottom-btn"
          onClick={() => setPage("domain")}
        >
          Start the Test →
        </button>

      </div>
    </div>
  );
}

export default Landing;