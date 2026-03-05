import { Request, Response } from "express";
import Listing from "../models/Listing";

// CREATE
export const createListing = async (req: any, res: Response) => {
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
      user: req.user._id,
    });

    res.status(201).json(listing);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL
export const getListings = async (req: Request, res: Response) => {
  try {
    const { search, location, minPrice, maxPrice, page = "1", limit = "10" } = req.query;

    const query: any = {};

    // 🔎 Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // 📍 Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const listings = await Listing.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Listing.countDocuments(query);

    res.json({
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalListings: total,
      listings
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET SINGLE
export const getListingById = async (req: Request, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("user", "name email");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE
export const updateListing = async (req: any, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE
export const deleteListing = async (req: any, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await listing.deleteOne();

    res.json({ message: "Listing removed" });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


// UPLOAD IMAGES
export const uploadImages = (req: any, res: Response) => {
  const files = req.files as Express.Multer.File[];

  const imagePaths = files.map(file => `/uploads/${file.filename}`);

  res.json({
    message: "Images uploaded",
    images: imagePaths
  });
};