import cron from 'node-cron';
import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/app/lib/database";
import Event from "@/app/lib/database/models/event.model";
import CronLog from "@/app/lib/database/models/cronLog.model";
import CronLock from "@/app/lib/database/models/cronlock.model";

// Cron job that runs every day at midnight PST (Pacific Standard Time)
cron.schedule('0 8 * * *', async () => {
  console.log("Cron job triggered at midnight PST");

  try {
    await connectToDatabase();

    const lock = await CronLock.findOne({ jobName: 'log-tourn-job' });

    if (lock && lock.isRunning) {
      console.log("Cron job already running.");
      return;
    }

    if (!lock) {
      await CronLock.create({ jobName: 'log-tourn-job', isRunning: true });
    } else {
      lock.isRunning = true;
      await lock.save();
    }

    // Use timezone-aware date for PST
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const existingLogs = await CronLog.find({}, 'message');
    const loggedDates = new Set<string>();

    existingLogs.forEach(log => {
      const match = log.message.match(/\d{4}-\d{2}-\d{2}/g);
      if (match) {
        match.forEach((date: string) => loggedDates.add(date));
      }
    });

    const allEndedTournaments = await Event.find(
      {
        is_tourn: true,
        date: { $lte: yesterdayStr }
      },
      'date is_tourn'
    ).sort({ date: 1 });

    const newTournaments = allEndedTournaments.filter(event => !loggedDates.has(event.date));

    const jobStartTime = new Date();

    if (newTournaments.length > 0) {
      for (const tournament of newTournaments) {
        const logMsg = `🏁 比賽日期: ${tournament.date}`;
        await CronLog.create({ message: logMsg, createdAt: jobStartTime });
      }
    }    

    await CronLock.updateOne({ jobName: 'log-tourn-job' }, { isRunning: false });

  } catch (err) {
    console.error('❌ Cron job error:', err);
  }
}, {
  scheduled: true,
  timezone: "America/Los_Angeles" // Set timezone to PST
});

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch logs from the CronLog collection
    const logs = await CronLog.find({}).sort({ createdAt: -1 }); // Sort by createdAt, newest first

    // Return the logs as JSON response
    return NextResponse.json({ logs });
  } catch (err) {
    console.error('Error fetching cron logs:', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}