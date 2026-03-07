import cron from "node-cron";
import Listing from "../models/Listing";

export const startPriceDropJob = () => {

  cron.schedule("0 0 * * *", async () => {

    console.log("Running price drop job");

    const listings = await Listing.find({
      saleType: "price-drop"
    });

    for (const listing of listings) {

      const days =
        (Date.now() - new Date(listing.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);

      if (days >= listing.priceDropIntervalDays) {

        listing.currentPrice =
          listing.currentPrice - listing.priceDropAmount;

        await listing.save();
      }
    }

  });
};