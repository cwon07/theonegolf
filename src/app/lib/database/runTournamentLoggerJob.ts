import mongoose from 'mongoose';
import { connectToDatabase } from "@/app/lib/database";
import Event from "@/app/lib/database/models/event.model";
import CronLog from "@/app/lib/database/models/cronLog.model";
import CronLock from "@/app/lib/database/models/cronlock.model";
import { calculateStrokes } from "@/app/lib/database/calculateStrokes"; 
import { fetchEventWithDetails } from "@/app/lib/database/fetchEventWithDetails"; 
import { DateTime } from 'luxon';

interface Member {
  _id: mongoose.Types.ObjectId;
  id: number;
  handicap: [number]
  name: string;
  sex: string;
  is_new: boolean;
}

interface Round {
  _id:  mongoose.Types.ObjectId;
  member:  Member
  front_9?: string;
  back_9?: string;
}

interface Group {
  _id: mongoose.Types.ObjectId;
  date: string;
  time: string;
  rounds: Round[];
}

interface Event {
  _id: string;
  date: string;
  is_tourn: boolean;
  groups: Group[]
  m_total_stroke: Member;
  w_total_stroke: Member;
  m_net_stroke_1: Member;
  m_net_stroke_2: Member;
  m_net_stroke_3: Member;
  m_net_stroke_4: Member;
  m_net_stroke_5: Member;
  w_net_stroke_1: Member;
  w_net_stroke_2: Member;
  m_long_drive: Member;
  w_long_drive: Member;
  close_to_center: Member;
  m_close_pin_2: Member;
  m_close_pin_7: Member;
  m_close_pin_12: Member;
  m_close_pin_16: Member;
  w_close_pin_7: Member;
  w_close_pin_12: Member;
  m_bb: Member;
  w_bb: Member;
  birdies: Member[];
  eagles: Member[];
  albatrosses: Member[];
}

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
    const pacificNow = DateTime.now().setZone('America/Los_Angeles');
    const pacificYesterday = pacificNow.minus({ days: 1 });

    const existingLogs = await CronLog.find({}, 'message');
    const loggedDates = new Set<string>();
    existingLogs.forEach(log => {
      const match = log.message.match(/\d{4}-\d{2}-\d{2}/g);
      if (match) match.forEach((date: string) => loggedDates.add(date));
    });

    const allEndedTournaments = await Event.find(
      {
        is_tourn: true,
        date: { $lte: pacificYesterday }
      },
      'date is_tourn'
    ).sort({ date: 1 });

    const newTournaments = allEndedTournaments.filter(event => !loggedDates.has(event.date));

    const jobStartTime = new Date();

    if (newTournaments.length > 0) {
      for (const tournament of newTournaments) {
        try {
          const response = await fetchEventWithDetails(tournament.date);

          if (response.ok) {
            const fullEvent = await response.json() as Event; // Now asserting the correct type after extraction
            if (!fullEvent || !fullEvent._id) {
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
          const formattedMWinner = `${(MWinner[0] as Member)?.name} (${MWinner[1] === 0 ? 0 : MWinner[1] || "N/A"}) - 1 = (${MWinner[2] === 0 ? 0 : MWinner[2] || "N/A"})`;
          const formattedWWinner = `${(WWinner[0] as Member)?.name} (${WWinner[1] === 0 ? 0 : WWinner[1] || "N/A"}) - 1 = (${WWinner[2] === 0 ? 0 : WWinner[2] || "N/A"})`;
          
          const formattedMNet1 = `${(MNet1[0] as Member)?.name} (${MNet1[1] === 0 ? 0 : MNet1[1] || "N/A"}) - ${MNet1[2] === 0 ? 0 : MNet1[2] || "N/A"} - ${MNet1[3] === 0 ? 0 : MNet1[3] || "N/A"} = (${MNet1[4] === 0 ? 0 : MNet1[4] || "N/A"})`;
          const formattedMNet2 = `${(MNet2[0] as Member)?.name} (${MNet2[1] === 0 ? 0 : MNet2[1] || "N/A"}) - ${MNet2[2] === 0 ? 0 : MNet2[2] || "N/A"} - ${MNet2[3] === 0 ? 0 : MNet2[3] || "N/A"} = (${MNet2[4] === 0 ? 0 : MNet2[4] || "N/A"})`;
          const formattedMNet3 = `${(MNet3[0] as Member)?.name} (${MNet3[1] === 0 ? 0 : MNet3[1] || "N/A"}) - ${MNet3[2] === 0 ? 0 : MNet3[2] || "N/A"} - ${MNet3[3] === 0 ? 0 : MNet3[3] || "N/A"} = (${MNet3[4] === 0 ? 0 : MNet3[4] || "N/A"})`;
          const formattedMNet4 = `${(MNet4[0] as Member)?.name} (${MNet4[1] === 0 ? 0 : MNet4[1] || "N/A"}) - ${MNet4[2] === 0 ? 0 : MNet4[2] || "N/A"} - ${MNet4[3] === 0 ? 0 : MNet4[3] || "N/A"} = (${MNet4[4] === 0 ? 0 : MNet4[4] || "N/A"})`;
          const formattedMNet5 = `${(MNet5[0] as Member)?.name} (${MNet5[1] === 0 ? 0 : MNet5[1] || "N/A"}) - ${MNet5[2] === 0 ? 0 : MNet5[2] || "N/A"} - ${MNet5[3] === 0 ? 0 : MNet5[3] || "N/A"} = (${MNet5[4] === 0 ? 0 : MNet5[4] || "N/A"})`;
          
          const formattedWNet1 = `${(WNet1[0] as Member)?.name} (${WNet1[1] === 0 ? 0 : WNet1[1] || "N/A"}) - ${WNet1[2] === 0 ? 0 : WNet1[2] || "N/A"} - ${WNet1[3] === 0 ? 0 : WNet1[3] || "N/A"} = (${WNet1[4] === 0 ? 0 : WNet1[4] || "N/A"})`;
          const formattedWNet2 = `${(WNet2[0] as Member)?.name} (${WNet2[1] === 0 ? 0 : WNet2[1] || "N/A"}) - ${WNet2[2] === 0 ? 0 : WNet2[2] || "N/A"} - ${WNet2[3] === 0 ? 0 : WNet2[3] || "N/A"} = (${WNet2[4] === 0 ? 0 : WNet2[4] || "N/A"})`;
          
          const newMemberStrings = adjustedNewMember.map((item) => {
            const [member, handicap, value, adjusted] = item.result;
            return `${member.name} (${handicap === 0 ? 0 : handicap || "N/A"}) - ${value === 0 ? 0 : value || "N/A"} = (${adjusted === 0 ? 0 : adjusted || "N/A"})`;
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
          } else {
            // Handle the case where the response was not successful
            console.error("Error fetching event details");
          }
    
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