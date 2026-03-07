import express from "express";
import { createBid, getBidsForListing } from "../controllers/bidController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createBid);

router.get("/listing/:id", getBidsForListing);

export default router;