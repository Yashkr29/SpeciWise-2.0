const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Database Setup (SQLite for dev; swap for MySQL/Postgres in prod) ────────
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./speciwise.sqlite",
  logging: false,
});

const QuizResponse = sequelize.define("QuizResponse", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  answers: { type: DataTypes.TEXT, allowNull: false },
  suggestion: { type: DataTypes.TEXT, allowNull: false },
});

// ─── Weightage Map ────────────────────────────────────────────────────────────
const WEIGHTAGE = {
  "Solving logic puzzles":          { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Automating boring tasks":        { CC: 1, AA: 2, AE: 3, CL: 1, CY: 1, BD: 1, BC: 2 },
  "Analyzing patterns in data":     { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Making intelligent systems":     { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 2 },
  "Creating secure systems":        { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "Algorithms and computation":     { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 2 },
  "Internet and cloud services":    { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 2 },
  "Data trends and analysis":       { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Neural networks and AI":         { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Data privacy and encryption":    { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "A code compiler":                { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "A cloud-based file app":         { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 2, BC: 2 },
  "A movie recommendation system":  { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "A self-learning chatbot":        { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "A secure login system":          { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "I enjoy complex math":           { CC: 3, AA: 2, AE: 2, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Basic math is fine":             { CC: 2, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "I love using stats to find trends": { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Math helps me understand AI":    { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "I use it only when necessary":   { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Technical, deep logic":          { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Real-world scaling issues":      { CC: 1, AA: 1, AE: 2, CL: 3, CY: 1, BD: 2, BC: 2 },
  "Predicting behavior using data": { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Creating intelligent machines":  { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Preventing digital attacks":     { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "Improve speed and efficiency":   { CC: 3, AA: 1, AE: 2, CL: 2, CY: 1, BD: 1, BC: 1 },
  "Work over the internet":         { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 2 },
  "Show trends or insights":        { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Learn over time":                { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Offer strong protection":        { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "New programming languages":      { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Big tech infrastructure updates":{ CC: 1, AA: 1, AE: 2, CL: 3, CY: 1, BD: 2, BC: 2 },
  "Big data trends or analytics":   { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "New AI innovations":             { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Recent hacking attempts":        { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "Focused and solo":               { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Distributed team environment":   { CC: 1, AA: 1, AE: 2, CL: 3, CY: 1, BD: 2, BC: 2 },
  "With data at hand":              { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Creative and experimental":      { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Carefully and cautiously":       { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "Code a new system":              { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Set up servers and APIs":        { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 2, BC: 2 },
  "Visualize patterns":             { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Make systems smart":             { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Encrypt and protect data":       { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "Software engineer":              { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "DevOps/cloud architect":         { CC: 1, AA: 1, AE: 2, CL: 3, CY: 1, BD: 2, BC: 2 },
  "Data analyst":                   { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "AI/ML engineer":                 { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Security specialist":            { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "Logical thinking":               { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Large-scale tech impact":        { CC: 1, AA: 1, AE: 2, CL: 3, CY: 1, BD: 2, BC: 2 },
  "Finding answers in data":        { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Mimicking human intelligence":   { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Securing critical systems":      { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "Inefficient code":               { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Poor internet speed":            { CC: 1, AA: 1, AE: 2, CL: 3, CY: 1, BD: 2, BC: 2 },
  "Messy data":                     { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Repetitive tasks":               { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Data breaches":                  { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "Yes, in computer science":       { CC: 3, AA: 2, AE: 2, CL: 2, CY: 2, BD: 2, BC: 2 },
  "Maybe, in cloud or networking":  { CC: 1, AA: 1, AE: 1, CL: 3, CY: 1, BD: 1, BC: 2 },
  "Possibly, in data science":      { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Definitely, in AI/ML":           { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Yes, in cybersecurity":          { CC: 1, AA: 1, AE: 1, CL: 1, CY: 3, BD: 1, BC: 3 },
  "Fast innovation pace":           { CC: 2, AA: 2, AE: 2, CL: 2, CY: 2, BD: 2, BC: 2 },
  "Everything is moving to the cloud": { CC: 1, AA: 1, AE: 1, CL: 3, CY: 1, BD: 1, BC: 2 },
  "Data is becoming powerful":      { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "AI is changing lives":           { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "We need better protection":      { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 3 },
  "Lead programmer":                { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Deployment or systems setup":    { CC: 1, AA: 1, AE: 1, CL: 3, CY: 1, BD: 2, BC: 2 },
  "Analyst or presenter":           { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Design logic or AI behavior":    { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Security checker or troubleshooter": { CC: 1, AA: 1, AE: 1, CL: 1, CY: 3, BD: 1, BC: 3 },
  "The logic":                      { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Speed and reliability":          { CC: 2, AA: 1, AE: 2, CL: 3, CY: 1, BD: 1, BC: 2 },
  "User behavior insights":         { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Personalization":                { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Data protection":                { CC: 1, AA: 1, AE: 1, CL: 1, CY: 3, BD: 1, BC: 3 },
  "How things work":                { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "How systems connect":            { CC: 1, AA: 1, AE: 2, CL: 3, CY: 1, BD: 1, BC: 2 },
  "How data tells stories":         { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "How machines think":             { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "How to protect systems":         { CC: 1, AA: 1, AE: 1, CL: 1, CY: 3, BD: 1, BC: 3 },
  "Compete in coding contests":     { CC: 3, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 1 },
  "Set up servers":                 { CC: 1, AA: 1, AE: 1, CL: 1, CY: 1, BD: 1, BC: 2 },
  "Play with datasets":             { CC: 1, AA: 3, AE: 1, CL: 1, CY: 1, BD: 3, BC: 1 },
  "Train a chatbot":                { CC: 1, AA: 3, AE: 3, CL: 1, CY: 1, BD: 2, BC: 1 },
  "Try ethical hacking":            { CC: 1, AA: 1, AE: 1, CL: 1, CY: 3, BD: 1, BC: 3 },
};

// ─── Scoring Logic (shared between routes) ───────────────────────────────────
function calculateScores(answers) {
  const scores = { CC: 0, AA: 0, AE: 0, CL: 0, CY: 0, BD: 0, BC: 0 };

  for (const [question, answer] of Object.entries(answers)) {
    if (!answer || answer.trim() === "") {
      console.warn(`Skipping empty answer for question: ${question}`);
      continue;
    }
    const weights = WEIGHTAGE[answer.trim()];
    if (!weights) {
      console.warn(`No weightage found for answer: "${answer}"`);
      continue;
    }
    for (const [key, value] of Object.entries(weights)) {
      if (key in scores) scores[key] += value;
    }
  }

  const totalScore = Object.values(scores).reduce((sum, v) => sum + v, 0);

  if (totalScore === 0) {
    console.warn("Total score is zero, returning default equal percentages");
    return {
      CC: 14.29, AA: 14.29, AE: 14.29,
      CL: 14.29, CY: 14.29, BD: 14.29, BC: 14.25,
    };
  }

  const pieChart = {};
  for (const [key, value] of Object.entries(scores)) {
    pieChart[key] = Math.round((value * 100.0 / totalScore) * 100) / 100;
  }

  return pieChart;
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /api/suggest
app.post("/api/suggest", async (req, res) => {
  try {
    const input = req.body;

    if (!input || !input.answers || Object.keys(input.answers).length === 0) {
      return res.status(400).json({ error: "Answers cannot be null or empty" });
    }

    console.log("Received quiz answers:", input);

    const pieChart = calculateScores(input.answers);
    console.log("Pie chart percentages:", pieChart);

    // Save to DB (non-blocking: errors don't fail the response)
    try {
      await QuizResponse.create({
        answers: JSON.stringify(input.answers),
        suggestion: JSON.stringify(pieChart),
      });
      console.log("Saved quiz response to database");
    } catch (dbErr) {
      console.error("Failed to save to database:", dbErr.message);
    }

    return res.status(200).json(pieChart);
  } catch (err) {
    console.error("Error processing quiz:", err.message);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// GET /api/results
app.get("/api/results", async (req, res) => {
  try {
    const latest = await QuizResponse.findOne({
      order: [["id", "DESC"]],
    });

    console.log("Fetched latest result:", latest);

    if (!latest) return res.status(200).json({});
    return res.status(200).json(JSON.parse(latest.suggestion));
  } catch (err) {
    console.error("Error fetching latest result:", err.message);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Speciwise backend running at http://localhost:${PORT}`);
  });
});