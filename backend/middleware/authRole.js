const User = require("../models/User");

// 🔐 Admin-only access
exports.isAdmin = async (req, res, next) => {
  try {
    const email = req.headers["x-user-email"];
    if (!email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Authorization failed" });
  }
};

// 🔐 Student access (self only)
exports.isStudentSelf = async (req, res, next) => {
  try {
    const email = req.headers["x-user-email"];
    if (!email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (email !== req.params.email.toLowerCase().trim()) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Authorization failed" });
  }
};
