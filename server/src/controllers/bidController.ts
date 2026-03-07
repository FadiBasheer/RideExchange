import { Request, Response } from "express";
import Bid from "../models/Bid";
import CarListing from "../models/CarListing";


export const createBid = async (req: any, res: Response) => {
  try {

    const { listingId, amount } = req.body;

    const listing = await CarListing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.listingType !== "auction") {
      return res.status(400).json({ message: "Not an auction listing" });
    }

    if (!listing.auction) {
      return res.status(400).json({ message: "Auction data missing" });
    }

    const highestBid = await Bid.findOne({ listing: listingId }).sort("-amount");

    if (!listing.auction.endDate) {
      return res.status(400).json({ message: "Auction end date missing" });
    }
    
    if (new Date() > listing.auction.endDate) {
      return res.status(400).json({ message: "Auction has ended" });
    }

    const currentPrice =
      highestBid?.amount ??
      listing.auction.currentBid ??
      listing.auction.startingPrice ??
      0;

    if (amount <= currentPrice) {
      return res.status(400).json({
        message: `Bid must be higher than ${currentPrice}`
      });
    }

    const bid = await Bid.create({
      listing: listingId,
      user: req.user._id,
      amount
    });

    listing.auction.currentBid = amount;
    await listing.save();

    res.status(201).json(bid);

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};



export const getBidsForListing = async (req: Request, res: Response) => {
  try {

    const bids = await Bid.find({ listing: req.params.id })
      .populate("user", "name")
      .sort({ amount: -1 });

    res.json(bids);

  } catch {

    res.status(500).json({ message: "Server error" });

  }
};