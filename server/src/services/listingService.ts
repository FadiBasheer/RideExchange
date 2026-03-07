import Listing from "../models/CarListing";

export const getAllListings = async () => {
  return await Listing.find();
};