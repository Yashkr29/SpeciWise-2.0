import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import "./SpeciWise.css";

// ─── Questions ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id: "q1",  text: "What activity excites you most?",                   options: ["Solving logic puzzles", "Automating boring tasks", "Analyzing patterns in data", "Making intelligent systems", "Creating secure systems"] },
  { id: "q2",  text: "Which CS topic fascinates you?",                    options: ["Algorithms and computation", "Internet and cloud services", "Data trends and analysis", "Neural networks and AI", "Data privacy and encryption"] },
  { id: "q3",  text: "What would you build first?",                       options: ["A code compiler", "A cloud-based file app", "A movie recommendation system", "A self-learning chatbot", "A secure login system"] },
  { id: "q4",  text: "How do you relate to math?",                        options: ["I enjoy complex math", "Basic math is fine", "I love using stats to find trends", "Math helps me understand AI", "I use it only when necessary"] },
  { id: "q5",  text: "What kind of problems do you love solving?",        options: ["Technical, deep logic", "Real-world scaling issues", "Predicting behavior using data", "Creating intelligent machines", "Preventing digital attacks"] },
  { id: "q6",  text: "What do you want your code to do?",                 options: ["Improve speed and efficiency", "Work over the internet", "Show trends or insights", "Learn over time", "Offer strong protection"] },
  { id: "q7",  text: "What tech news grabs your attention?",              options: ["New programming languages", "Big tech infrastructure updates", "Big data trends or analytics", "New AI innovations", "Recent hacking attempts"] },
  { id: "q8",  text: "How do you prefer to work?",                        options: ["Focused and solo", "Distributed team environment", "With data at hand", "Creative and experimental", "Carefully and cautiously"] },
  { id: "q9",  text: "What's your ideal weekend project?",                options: ["Code a new system", "Set up servers and APIs", "Visualize patterns", "Make systems smart", "Encrypt and protect data"] },
  { id: "q10", text: "Which career sounds most like you?",                options: ["Software engineer", "DevOps/cloud architect", "Data analyst", "AI/ML engineer", "Security specialist"] },
  { id: "q11", text: "What excites you most about CS?",                   options: ["Logical thinking", "Large-scale tech impact", "Finding answers in data", "Mimicking human intelligence", "Securing critical systems"] },
  { id: "q12", text: "What frustrates you most in tech?",                 options: ["Inefficient code", "Poor internet speed", "Messy data", "Repetitive tasks", "Data breaches"] },
  { id: "q13", text: "Where do you see yourself specializing?",           options: ["Yes, in computer science", "Maybe, in cloud or networking", "Possibly, in data science", "Definitely, in AI/ML", "Yes, in cybersecurity"] },
  { id: "q14", text: "What's your take on the future of tech?",           options: ["Fast innovation pace", "Everything is moving to the cloud", "Data is becoming powerful", "AI is changing lives", "We need better protection"] },
  { id: "q15", text: "In a team, what role suits you best?",              options: ["Lead programmer", "Deployment or systems setup", "Analyst or presenter", "Design logic or AI behavior", "Security checker or troubleshooter"] },
  { id: "q16", text: "What matters most in great software?",              options: ["The logic", "Speed and reliability", "User behavior insights", "Personalization", "Data protection"] },
  { id: "q17", text: "What are you most curious about?",                  options: ["How things work", "How systems connect", "How data tells stories", "How machines think", "How to protect systems"] },
  { id: "q18", text: "What would you try in your free time?",             options: ["Compete in coding contests", "Set up servers", "Play with datasets", "Train a chatbot", "Try ethical hacking"] },
];

// ─── Specializations ──────────────────────────────────────────────────────────
const SPECS = {
  CC: {
    name: "Core CS & Algorithms",
    icon: "⚙️",
    color: "#3b82f6",
    tagline: "Logic is your superpower",
    desc: "You thrive on algorithms, data structures, and clean code. Competitive programming and system design are your natural habitat.",
    careers: ["Software Engineer", "Algorithm Designer", "System Architect"],
  },
  AA: {
    name: "AI & Data Analytics",
    icon: "📊",
    color: "#8b5cf6",
    tagline: "You see stories in numbers",
    desc: "You turn raw data into powerful insights. Statistical modeling, visualization, and machine learning analytics define your path.",
    careers: ["Data Scientist", "ML Analyst", "BI Engineer"],
  },
  AE: {
    name: "AI / ML Engineering",
    icon: "🤖",
    color: "#ec4899",
    tagline: "You build minds",
    desc: "Neural networks, model training, and intelligent automation are your domain. You engineer systems that learn and adapt.",
    careers: ["ML Engineer", "AI Researcher", "NLP Engineer"],
  },
  CL: {
    name: "Cloud Computing",
    icon: "☁️",
    color: "#06b6d4",
    tagline: "You think at scale",
    desc: "Infrastructure, distributed systems, and deployment pipelines excite you. Your work powers millions of users worldwide.",
    careers: ["Cloud Architect", "DevOps Engineer", "SRE"],
  },
  CY: {
    name: "Cybersecurity",
    icon: "🔐",
    color: "#f59e0b",
    tagline: "You guard the digital world",
    desc: "Ethical hacking, cryptography, and threat detection are your calling. You protect what matters most in the digital age.",
    careers: ["Security Engineer", "Pen Tester", "Cryptographer"],
  },
  BD: {
    name: "Big Data Engineering",
    icon: "🗄️",
    color: "#10b981",
    tagline: "Data at massive scale",
    desc: "You love building data pipelines, working with distributed databases, and uncovering hidden trends at massive scale.",
    careers: ["Data Engineer", "Big Data Architect", "ETL Developer"],
  },
  BC: {
    name: "Blockchain & Cryptography",
    icon: "🔗",
    color: "#f97316",
    tagline: "Decentralized by nature",
    desc: "Trustless systems, encryption, and digital sovereignty define you. You're building the secure, decentralized future.",
    careers: ["Blockchain Dev", "Smart Contract Engineer", "Crypto Researcher"],
  },
};

const API_URL = "http://localhost:8080/api/suggest";

// ─── Component ────────────────────────────────────────────────────────────────
export default function SpeciWise() {
  const [screen, setScreen]   = useState("welcome");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState(null);

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);
    setTimeout(() => {
      const updated = { ...answers, [QUESTIONS[current].id]: option };
      setAnswers(updated);
      setSelected(null);
      if (current + 1 < QUESTIONS.length) {
        setCurrent((c) => c + 1);
      } else {
        submitQuiz(updated);
      }
    }, 420);
  };

  const submitQuiz = async (finalAnswers) => {
    setScreen("loading");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      setResults(data);
    } catch {
      // demo fallback when backend isn't running
      setResults({ CC: 18.5, AA: 22.3, AE: 28.1, CL: 8.4, CY: 7.2, BD: 10.1, BC: 5.4 });
    }
    setScreen("result");
  };

  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setResults(null);
    setSelected(null);
    setScreen("welcome");
  };

  const progress = (current / QUESTIONS.length) * 100;
  const sorted   = results ? Object.entries(results).sort(([, a], [, b]) => b - a) : [];
  const topKey   = sorted[0]?.[0];
  const topSpec  = topKey ? SPECS[topKey] : null;
  const pieData  = sorted.map(([key, val]) => ({
    name: SPECS[key]?.name ?? key,
    value: val,
    color: SPECS[key]?.color,
    key,
  }));

  // ── Welcome ────────────────────────────────────────────────────────────────
  if (screen === "welcome") {
    return (
      <div className="sw-page sw-welcome">
        <div className="sw-grid-bg" />
        <div className="sw-orb" />

        <div className="sw-welcome-inner">
          <div className="sw-float-icon">🧠</div>
          <div className="sw-mono sw-label">Computer Science Specialization Finder</div>

          <h1 className="sw-hero-title">
            Discover Your{" "}
            <span className="sw-gradient-text">CS Path</span>
          </h1>

          <p className="sw-hero-sub">
            Answer 18 quick questions about your interests, work style, and goals —
            and we'll reveal which CS specialization fits you best.
          </p>

          <div className="sw-tags">
            {["18 Questions", "7 Specializations", "~3 Minutes"].map((t) => (
              <span key={t} className="sw-tag">{t}</span>
            ))}
          </div>

          <button className="sw-start-btn" onClick={() => setScreen("quiz")}>
            Start Quiz →
          </button>
        </div>

        <div className="sw-spec-badges">
          {Object.values(SPECS).map((s) => (
            <span key={s.name} className="sw-spec-badge">
              {s.icon} {s.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────
  if (screen === "quiz") {
    const q = QUESTIONS[current];
    return (
      <div className="sw-page sw-quiz">
        <div className="sw-grid-bg" />

        {/* progress bar */}
        <div className="sw-progress-track">
          <div className="sw-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* header */}
        <div className="sw-quiz-header">
          <span className="sw-mono" style={{ color: "#00d4ff" }}>SPECIWISE</span>
          <span className="sw-mono sw-counter">
            <strong>{current + 1}</strong> / {QUESTIONS.length}
          </span>
        </div>

        {/* question card */}
        <div className="sw-quiz-body">
          <div key={current} className="sw-question-wrap">
            <div className="sw-mono sw-q-label">QUESTION {current + 1}</div>
            <h2 className="sw-q-text">{q.text}</h2>

            <div className="sw-options">
              {q.options.map((opt, i) => (
                <button
                  key={opt}
                  className={`sw-opt${selected === opt ? " sw-opt--selected" : ""}`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => handleAnswer(opt)}
                >
                  <span className="sw-opt-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* dot indicator */}
        <div className="sw-dots">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`sw-dot ${i < current ? "sw-dot--done" : ""} ${i === current ? "sw-dot--active" : ""}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (screen === "loading") {
    return (
      <div className="sw-page sw-loading">
        <div className="sw-spinner" />
        <div className="sw-mono" style={{ color: "#00d4ff", fontSize: "0.85rem", letterSpacing: "0.2em" }}>
          ANALYZING YOUR PROFILE...
        </div>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (screen === "result" && results && topSpec) {
    const maxVal = sorted[0][1];
    return (
      <div className="sw-page sw-result">
        <div className="sw-grid-bg" />

        <div className="sw-result-inner">
          {/* heading */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="sw-mono sw-label">YOUR RESULTS</div>
            <h1 className="sw-result-title">You're a perfect fit for</h1>
          </div>

          {/* top match */}
          <div
            className="sw-top-card"
            style={{
              background: `linear-gradient(135deg, ${topSpec.color}18, ${topSpec.color}05)`,
              borderColor: `${topSpec.color}50`,
            }}
          >
            <div className="sw-top-orb" style={{ background: `radial-gradient(circle, ${topSpec.color}25, transparent 70%)` }} />
            <div className="sw-top-body">
              <div className="sw-top-icon">{topSpec.icon}</div>
              <div className="sw-top-info">
                <div className="sw-mono" style={{ color: topSpec.color, fontSize: "0.7rem", letterSpacing: "0.2em", marginBottom: "0.4rem" }}>
                  TOP MATCH · {sorted[0][1].toFixed(1)}%
                </div>
                <h2 className="sw-top-name">{topSpec.name}</h2>
                <p className="sw-top-tagline" style={{ color: topSpec.color }}>"{topSpec.tagline}"</p>
                <p className="sw-top-desc">{topSpec.desc}</p>
                <div className="sw-careers">
                  {topSpec.careers.map((c) => (
                    <span key={c} className="sw-career-tag" style={{ background: `${topSpec.color}18`, borderColor: `${topSpec.color}35`, color: topSpec.color }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* chart + rankings */}
          <div className="sw-grid-2">
            {/* pie chart */}
            <div className="sw-panel">
              <h3 className="sw-panel-title">Specialization Fit</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={58} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val.toFixed(1)}%`, name]}
                    contentStyle={{
                      background: "#0d1426",
                      border: "1px solid rgba(0,212,255,0.2)",
                      borderRadius: "8px",
                      color: "#f0f9ff",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.8rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* rankings */}
            <div className="sw-panel">
              <h3 className="sw-panel-title">All Rankings</h3>
              <div className="sw-rankings">
                {sorted.map(([key, val], i) => {
                  const sp = SPECS[key];
                  if (!sp) return null;
                  return (
                    <div key={key} className="sw-rank-row">
                      <div className="sw-rank-label">
                        <span style={{ color: i === 0 ? "#f0f9ff" : "#8eb4c8", fontWeight: i === 0 ? 600 : 400 }}>
                          {sp.icon} {sp.name}
                        </span>
                        <span className="sw-mono" style={{ color: sp.color, fontSize: "0.8rem" }}>
                          {val.toFixed(1)}%
                        </span>
                      </div>
                      <div className="sw-bar-track">
                        <div
                          className="sw-bar-fill"
                          style={{ width: `${(val / maxVal) * 100}%`, background: sp.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* restart */}
          <div style={{ textAlign: "center", paddingBottom: "2rem" }}>
            <button className="sw-restart-btn" onClick={restart}>
              ↺ Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
