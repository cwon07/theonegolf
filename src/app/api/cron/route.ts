import cron from 'node-cron';
import { runTournamentLoggerJob } from "@/app/lib/database/runTournamentLoggerJob";

// Cron job that runs every day at midnight PST
cron.schedule('0 8 * * *', async () => {
  await runTournamentLoggerJob();
  console.log("⏰ Tournament logger job ran via cron.");
}, {
  scheduled: true,
  timezone: "America/Los_Angeles"
});
