import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
{
  title: String,
  description: String,
  images: [String],

  make: String,
  model: String,
  year: Number,
  mileage: Number,

  location: String,

  listingType: {
    type: String,
    enum: ["auction", "price_drop"],
    required: true
  },

  // Auction fields
  startingPrice: Number,
  currentBid: Number,
  auctionEndDate: Date,

  // Price drop fields
  startPrice: Number,
  priceDropAmount: Number,
  dropIntervalDays: Number,
  currentPrice: Number,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},
{ timestamps: true }
);

export default mongoose.model("Listing", listingSchema);