import { Request, Response } from "express";
import CarListing from "../models/CarListing";


// CREATE LISTING
export const createListing = async (req: any, res: Response) => {
  try {

    const listingData = {
      ...req.body,
      seller: req.user._id
    };

    const listing = await CarListing.create(listingData);

    res.status(201).json(listing);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL LISTINGS
export const getListings = async (req: Request, res: Response) => {
  try {

    const { search, location, page = "1", limit = "10" } = req.query;

    const query: any = { status: "active" };

    // search title / description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const listings = await CarListing.find(query)
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await CarListing.countDocuments(query);

    res.json({
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalListings: total,
      listings
    });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


// GET SINGLE LISTING
export const getListingById = async (req: Request, res: Response) => {
  try {

    const listing = await CarListing.findById(req.params.id)
      .populate("seller", "name email");

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

    const listing = await CarListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await CarListing.findByIdAndUpdate(
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

    const listing = await CarListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await listing.deleteOne();

    res.json({ message: "Listing removed" });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


// IMAGE UPLOAD
export const uploadImages = (req: any, res: Response) => {

  const files = req.files as Express.Multer.File[];

  const imagePaths = files.map(file => `/uploads/${file.filename}`);

  res.json({
    message: "Images uploaded",
    images: imagePaths
  });
};


// ADVANCED CAR SEARCH
export const searchListings = async (req: Request, res: Response) => {

  try {

    const { make, model, year, minPrice, maxPrice } = req.query;

    const filter: any = {
      status: "active"
    };

    if (make) filter["car.make"] = make;
    if (model) filter["car.model"] = model;
    if (year) filter["car.year"] = Number(year);

    // price filter must check BOTH listing types
    if (minPrice || maxPrice) {

      filter.$or = [
        {
          "auction.currentBid": {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) })
          }
        },
        {
          "priceDrop.currentPrice": {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) })
          }
        }
      ];
    }

    const listings = await CarListing.find(filter)
      .populate("seller", "name");

    res.json(listings);

  } catch {

    res.status(500).json({ message: "Server error" });

  }
};