const express = require("express");
const Assignment = require("../models/Assignment");
const { isAdmin, isStudentSelf } = require("../middleware/authRole");

const router = express.Router();

/* ================= ASSIGN BOOK TO STUDENT (ADMIN ONLY) ================= */
router.post("/assign", isAdmin, async (req, res) => {
  try {
    const { bookId, studentEmail, startDate, endDate } = req.body;

    if (!bookId || !studentEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const assignment = new Assignment({
      bookId,
      studentEmail: studentEmail.toLowerCase().trim(),
      startDate,
      endDate,
    });

    await assignment.save();

    res.status(201).json({
      message: "Book assigned successfully",
      assignment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Assignment failed",
      error: err.message,
    });
  }
});

/* ================= GET ALL ASSIGNMENTS (ADMIN ONLY) ================= */
router.get("/", isAdmin, async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("bookId");
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignments",
      error: error.message,
    });
  }
});

/* ================= GET ASSIGNED BOOKS FOR STUDENT (SELF ONLY) ================= */
router.get("/student/:email", isStudentSelf, async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();

    const assignments = await Assignment.find({ studentEmail: email })
      .populate("bookId");

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch student assignments",
      error: error.message,
    });
  }
});

module.exports = router;
