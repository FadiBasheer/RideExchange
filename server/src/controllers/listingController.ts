import { Request, Response } from "express";
import Listing from "../models/Listing";

export const createListing = async (req: any, res: Response) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getListings = async (req: Request, res: Response) => {
  const listings = await Listing.find().populate("user", "name email");
  res.json(listings);
};

export const getListing = async (req: Request, res: Response) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  res.json(listing);
};

export const updateListing = async (req: any, res: Response) => {
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
};

export const deleteListing = async (req: any, res: Response) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (listing.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await listing.deleteOne();

  res.json({ message: "Listing removed" });
};