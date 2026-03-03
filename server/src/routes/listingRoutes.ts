import express from "express";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  uploadImages
} from "../controllers/listingController";

const router = express.Router();

// CREATE
router.post("/", protect, createListing);

// GET ALL
router.get("/", getListings);

// GET ONE
router.get("/:id", getListingById);

// UPDATE
router.put("/:id", protect, updateListing);

// DELETE
router.delete("/:id", protect, deleteListing);

// UPLOAD IMAGES
router.post("/upload", protect, upload.array("images", 5), uploadImages);

export default router;