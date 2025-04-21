import cron from 'node-cron';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/app/lib/database";
import Event from "@/app/lib/database/models/event.model";
import CronLog from "@/app/lib/database/models/cronLog.model";
import CronLock from "@/app/lib/database/models/cronlock.model";
import { calculateStrokes, setCalculatedStrokes } from "@/app/lib/database/calculateStrokes"; 
import { fetchEventWithDetails } from "@/app/lib/database/fetchEventWithDetails"; 

interface Member {
  _id: mongoose.Types.ObjectId;
  id: number;
  handicap: [number]
  name: string;
  sex: string;
  is_new: boolean;
}

// Cron job that runs every day at midnight PST (Pacific Standard Time)
cron.schedule('0 8 * * *', async () => {
  await runTournamentLoggerJob();
}, {
  scheduled: true,
  timezone: "America/Los_Angeles"
});

export async function runTournamentLoggerJob() {
  console.log("Cron job triggered manually or on schedule");

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

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const existingLogs = await CronLog.find({}, 'message');
    const loggedDates = new Set<string>();
    existingLogs.forEach(log => {
      const match = log.message.match(/\d{4}-\d{2}-\d{2}/g);
      if (match) match.forEach((date: string) => loggedDates.add(date));
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
        try {
          const fullEvent = await fetchEventWithDetails(tournament.date);
    
          if (!fullEvent || !fullEvent.event_id) {
            throw new Error('Invalid event data');
          }
    
          const result = calculateStrokes([fullEvent]);
          const MWinner = result.MWinner || [];
          const WWinner = result.WWinner || [];
          const MNet1 = result.MNet1 || [];
          const MNet2 = result.MNet2 || [];
          const MNet3 = result.MNet3 || [];
          const MNet4 = result.MNet4 || [];
          const MNet5 = result.MNet5 || [];
          const WNet1 = result.WNet1 || [];
          const WNet2 = result.WNet2 || [];
          const adjustedNewMember = result.adjustedNewMember || [];

          // Format the strings for both MStrokeWinner and WStrokeWinner
          const formattedMWinner = `${(MWinner[0] as Member)?.name} (${MWinner[1] || ""}) - 1 = (${MWinner[2] || ""})`;
          const formattedWWinner = `${(WWinner[0] as Member)?.name} (${WWinner[1] || ""}) - 1 = (${WWinner[2] || ""})`;
          const formattedMNet1 = `${(MNet1[0] as Member)?.name} (${MNet1[1] || ""}) - ${MNet1[2] || ""} - ${MNet1[3] || ""} = (${MNet1[4] || ""})`;
          const formattedMNet2 = `${(MNet2[0] as Member)?.name} (${MNet2[1] || ""}) - ${MNet2[2] || ""} - ${MNet2[3] || ""} = (${MNet2[4] || ""})`;
          const formattedMNet3 = `${(MNet3[0] as Member)?.name} (${MNet3[1] || ""}) - ${MNet3[2] || ""} - ${MNet3[3] || ""} = (${MNet3[4] || ""})`;
          const formattedMNet4 = `${(MNet4[0] as Member)?.name} (${MNet4[1] || ""}) - ${MNet4[2] || ""} - ${MNet4[3] || ""} = (${MNet4[4] || ""})`;
          const formattedMNet5 = `${(MNet5[0] as Member)?.name} (${MNet5[1] || ""}) - ${MNet5[2] || ""} - ${MNet5[3] || ""} = (${MNet5[4] || ""})`;
          const formattedWNet1 = `${(WNet1[0] as Member)?.name} (${WNet1[1] || ""}) - ${WNet1[2] || ""} - ${WNet1[3] || ""} = (${WNet1[4] || ""})`;
          const formattedWNet2 = `${(WNet2[0] as Member)?.name} (${WNet2[1] || ""}) - ${WNet2[2] || ""} - ${WNet2[3] || ""} = (${WNet2[4] || ""})`;
          const newMemberStrings = adjustedNewMember.map((item) => {
            const [member, handicap, value, adjusted] = item.result;
            return `${member.name} (${handicap}) - ${value} = (${adjusted})`;
          });
                    
    
          //const logMsg = `🏁 比賽日期: ${fullEvent.date} | Winners: ${winnerSummary}`;
          const logMsg = `
          🏁 比賽日期: ${fullEvent.date}
          
          總桿調桿:
          冠軍 (男士): ${formattedMWinner}
          冠軍 (女士): ${formattedWWinner}
          
          净桿調桿:
          冠軍 (男士): ${formattedMNet1}
          亞軍 (男士): ${formattedMNet2}
          季軍 (男士): ${formattedMNet3}
          殿軍 (男士): ${formattedMNet4}
          老五 (男士): ${formattedMNet5}
          冠軍 (女士): ${formattedWNet1}
          亞軍 (女士): ${formattedWNet2}
          
          新會員調桿:
          ${newMemberStrings.map(str => `${str}`).join('\n')}
          `.trim();
          
          await CronLog.create({ message: logMsg, createdAt: jobStartTime });
    
        } catch (err) {
          console.error(`❌ Error processing tournament on ${tournament.date}:`, err);
          await CronLog.create({
            message: `⚠️ Failed to process tournament on ${tournament.date}: ${(err instanceof Error) ? err.message : 'Unknown error'}`,
            createdAt: jobStartTime
          });
        }
      }
    }

    await CronLock.updateOne(
      { jobName: 'log-tourn-job' },
      { $set: { isRunning: false } },
      { upsert: true }
    );

  } catch (err) {
    console.error('❌ Cron job error:', err);
  }
}


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