import mongoose from "mongoose";

const carListingSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: String,

  images: [String],

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  car: {
    make: String,
    model: String,
    year: Number,
    mileage: Number,
    fuelType: String,
    transmission: String,
    condition: String
  },

  location: String,

  listingType: {
    type: String,
    enum: ["auction", "price_drop"],
    required: true
  },

  // Auction fields
  auction: {
    startingPrice: Number,
    currentBid: Number,
    endDate: Date
  },

  // Price drop fields
  priceDrop: {
    startPrice: Number,
    currentPrice: Number,
    dropAmount: Number,
    dropIntervalDays: Number,
    lastDropDate: Date
  }

},
{ timestamps: true }
);

export default mongoose.model("CarListing", carListingSchema);