import express from "express";
import User from "../models/User";
import { protect } from "../middleware/authMiddleware"; // ✅ ADD

const router = express.Router();

// ✅ Get logged-in user profile
router.get("/profile", protect, async (req: any, res) => {
  res.json(req.user);
});


// ✅ (Optional) Admin-only route later
router.get("/", protect, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;
