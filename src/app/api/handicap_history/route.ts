import cron from 'node-cron';
import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/app/lib/database";
import CronLog from "@/app/lib/database/models/cronLog.model";
import { runTournamentLoggerJob } from "@/app/lib/database/runTournamentLoggerJob"; 


// Cron job that runs every day at midnight PST (Pacific Standard Time)
cron.schedule('0 8 * * *', async () => {
  await runTournamentLoggerJob();
}, {
  scheduled: true,
  timezone: "America/Los_Angeles"
});

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    //comment out the below two lines after testing
    
    //console.log('🔧 Running tournament logger job manually via GET...');
    //await runTournamentLoggerJob(); 
    

    // Fetch logs from the CronLog collection
    const logs = await CronLog.find({}).sort({ createdAt: -1 }); // Sort by createdAt, newest first

    // Return the logs as JSON response
    return NextResponse.json({ logs });
  } catch (err) {
    console.error('Error fetching cron logs:', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}