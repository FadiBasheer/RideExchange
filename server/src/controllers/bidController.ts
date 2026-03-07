import { Request, Response } from "express";
import Bid from "../models/Bid";
import Listing from "../models/CarListing";

export const createBid = async (req: any, res: Response) => {
  try {
    const { listingId, amount } = req.body;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.saleType !== "auction") {
      return res.status(400).json({ message: "Not an auction listing" });
    }

    if (new Date() > listing.auctionEndTime) {
      return res.status(400).json({ message: "Auction ended" });
    }

    const highestBid = await Bid.findOne({ listing: listingId })
      .sort("-amount");

    if (highestBid && amount <= highestBid.amount) {
      return res.status(400).json({
        message: "Bid must be higher than current highest bid",
      });
    }

    const bid = await Bid.create({
      listing: listingId,
      user: req.user._id,
      amount,
    });

    res.status(201).json(bid);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};