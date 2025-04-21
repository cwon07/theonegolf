// src/app/api/cron/route.ts
import { runTournamentLoggerJob } from "@/app/lib/database/runTournamentLoggerJob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await runTournamentLoggerJob();
    console.log("⏰ Tournament logger job ran via Vercel scheduled function.");
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error("❌ Error running tournament logger job:", error);
    return NextResponse.json({ status: 'error', error: error instanceof Error ? error.message : error });
  }
}
