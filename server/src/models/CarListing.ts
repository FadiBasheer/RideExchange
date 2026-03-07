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

  location: String,

  status: {
    type: String,
    enum: ["active", "sold", "expired"],
    default: "active"
  },

  car: {
    make: {
      type: String,
      index: true
    },

    model: {
      type: String,
      index: true
    },

    year: {
      type: Number,
      index: true
    },

    mileage: Number,

    fuelType: String,

    transmission: String,

    condition: {
      type: String,
      enum: ["new", "like_new", "good", "fair"]
    }
  },

  listingType: {
    type: String,
    enum: ["auction", "price_drop"],
    required: true
  },

  // AUCTION SYSTEM
  auction: {
    startingPrice: Number,

    currentBid: {
      type: Number,
      default: 0
    },

    endDate: Date
  },

  // DUTCH AUCTION SYSTEM
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