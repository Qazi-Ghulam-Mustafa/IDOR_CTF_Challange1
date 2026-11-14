import express from "express";
import dotenv from "dotenv";
import db from "./config/database.js";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

dotenv.config();

if (!process.env.SESSION_SECRET) {
  console.error("SESSION_SECRET is missing in .env file!");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({
  extended: true,
  limit: "10kb",
}));

app.use(express.static("public"));

app.use(
  session({
    name: "idor.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  }),
);

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to IDOR CTF Challenge!");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "IDOR CTF Server is running!",
    status: "OK",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
