import Listing from "../models/Listing";

export const getAllListings = async () => {
  return await Listing.find();
};