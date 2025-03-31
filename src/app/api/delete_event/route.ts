import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from "@/app/lib/database";
import mongoose from 'mongoose';
import Event from "@/app/lib/database/models/event.model"; 
import Group from "@/app/lib/database/models/group.model"; 
import Round from "@/app/lib/database/models/round.model"; 

// Define schemas for separate collections
const RoundSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  front_9: String,
  back_9: String
});

const GroupSchema = new mongoose.Schema({
  date: String,
  time: String,
  rounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Round' }]
});

const EventSchema = new mongoose.Schema({
  date: String,
  is_tourn: Boolean,
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
});

// Define models
const RoundModel = Round || mongoose.model('Round', RoundSchema);
const GroupModel = Group || mongoose.model('Group', GroupSchema);
const EventModel = Event || mongoose.model('Event', EventSchema);

// Define the type for our deletion result
interface DeleteResult {
  deletedEvents: number;
  deletedGroups: number;
  deletedRounds: number;
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the date from query parameters
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Start a transaction and capture the result
    const session = await mongoose.startSession();
    let deleteResult: DeleteResult | undefined;

    try {
      await session.withTransaction(async () => {
        // 1. Find all events matching the date
        const events = await EventModel.find({ date: date }).select('groups');

        if (!events.length) {
          throw new Error('No events found for the specified date');
        }

        // 2. Get all group IDs from these events
        const groupIds = events.flatMap(event => event.groups);

        // 3. Find all groups and get their round IDs
        const groups = await GroupModel.find({ _id: { $in: groupIds } }).select('rounds');
        const roundIds = groups.flatMap(group => group.rounds);

        // 4. Delete rounds
        const roundsDeleteResult = await RoundModel.deleteMany({ _id: { $in: roundIds } });
        
        // 5. Delete groups
        const groupsDeleteResult = await GroupModel.deleteMany({ _id: { $in: groupIds } });
        
        // 6. Delete events
        const eventsDeleteResult = await EventModel.deleteMany({ date: date });

        // Return the result from the transaction with explicit type
        return {
          deletedEvents: eventsDeleteResult.deletedCount,
          deletedGroups: groupsDeleteResult.deletedCount,
          deletedRounds: roundsDeleteResult.deletedCount
        } as DeleteResult;
      }).then(result => {
        deleteResult = result; // Capture the typed result after transaction completes
      });

      // Ensure we have a result before proceeding
      if (!deleteResult) {
        throw new Error('Transaction failed to return result');
      }

      return NextResponse.json(
        { 
          message: 'Events, groups, and rounds deleted successfully',
          deletedEvents: deleteResult.deletedEvents,
          deletedGroups: deleteResult.deletedGroups,
          deletedRounds: deleteResult.deletedRounds
        },
        { status: 200 }
      );

    } finally {
      // Clean up the session
      session.endSession();
    }

  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: error instanceof Error && error.message === 'No events found for the specified date' ? 404 : 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};