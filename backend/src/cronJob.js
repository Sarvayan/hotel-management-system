import cron from "node-cron";
import { removeExpiredBookings } from "./controllers/bookingController.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled task: removeExpiredBookings()");
  await removeExpiredBookings();
});
