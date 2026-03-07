import cron from "node-cron";
import CarListing from "../models/CarListing";

export const startPriceDropJob = () => {

  // runs every day at midnight
  cron.schedule("0 0 * * *", async () => {

    console.log("Running price drop job");

    const listings = await CarListing.find({
      listingType: "price_drop",
      status: "active"
    });

    for (const listing of listings) {

      if (!listing.priceDrop) continue;

      const {
        currentPrice,
        dropAmount,
        dropIntervalDays,
        lastDropDate
      } = listing.priceDrop;

      if (!currentPrice || !dropAmount || !dropIntervalDays) continue;

      const now = new Date();

      const lastDrop = lastDropDate || listing.createdAt;

      const daysPassed =
        (now.getTime() - new Date(lastDrop).getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysPassed >= dropIntervalDays) {

        const newPrice = currentPrice - dropAmount;

        listing.priceDrop.currentPrice = Math.max(newPrice, 0);
        listing.priceDrop.lastDropDate = now;

        await listing.save();

        console.log(
          `Price dropped for listing ${listing._id}: ${currentPrice} → ${listing.priceDrop.currentPrice}`
        );
      }
    }

  });
};