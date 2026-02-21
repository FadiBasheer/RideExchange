import express from "express";
import Listing from "../models/Listing";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();


// ✅ CREATE LISTING (Protected)
router.post("/", protect, async (req: any, res) => {
  try {
    const { title, price, description, location, images } = req.body;

    if (!title || !price || !description || !location) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const listing = await Listing.create({
      title,
      price,
      description,
      location,
      images,
      user: req.user._id, // 🔥 logged-in user
    });

    res.status(201).json(listing);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ GET ALL LISTINGS (Public)
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().populate("user", "name email");
    res.json(listings);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;