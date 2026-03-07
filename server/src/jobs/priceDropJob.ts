import cron from "node-cron";
import CarListing from "../models/CarListing";

cron.schedule("0 0 * * *", async () => {
  const listings = await CarListing.find({ listingType: "price_drop" });

  const now = new Date();

  for (const listing of listings) {

    const lastDrop = listing.priceDrop.lastDropDate;

    const diffDays =
      (now.getTime() - lastDrop.getTime()) /
      (1000 * 60 * 60 * 24);

    if (diffDays >= listing.priceDrop.dropIntervalDays) {

      listing.priceDrop.currentPrice -= listing.priceDrop.dropAmount;
      listing.priceDrop.lastDropDate = now;

      await listing.save();
    }
  }

});