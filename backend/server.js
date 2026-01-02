const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const assignmentRoutes = require("./routes/assignments");

const app = express();

/* ================= MIDDLEWARE ================= */

// ✅ Allow both local + deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://lybrary3-0-1.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from this origin"));
      }
    },
    credentials: true,
  })
);

// ✅ Parse JSON body (VERY IMPORTANT)
app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/assignments", assignmentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Library Management Backend Running");
});

/* ================= MONGODB ================= */

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Atlas connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
