#Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#npm run dev
#7 #1,2,3,4,5,6,7,8,9,10,11,12,13,14,56,57,58,59,60,61,62,25,26,27,28,29

#route.ts
try {
    await connectToDatabase();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); 

    // Fetch events with a single query and lean optimization
    const events = await Event.find({ date: { $gte: yesterday.toISOString().split("T")[0] } }).lean();

    if (events.length === 0) {
      return NextResponse.json({ error: "No upcoming events found" }, { status: 404 });
    }

    // Get all group IDs for bulk querying
    const groupIds = events.flatMap((event) => event.groups).filter(Boolean);
    const groups = await Group.find({ _id: { $in: groupIds } }).lean();

    // Fetch rounds in bulk
    const roundIds = groups.flatMap((group) => group.rounds).filter(Boolean);
    const rounds = await Round.find({ _id: { $in: roundIds } }).lean(); 

    // Get all member IDs for bulk querying
    const memberIds = rounds.flatMap((round) => round.member).filter(Boolean);
    const members = await Member.find({ _id: { $in: memberIds } }).select("id name sex").lean();

    // Construct final event details
    const eventDetails = events.map((event) => ({
      event_id: event._id,
      date: event.date,
      time: event.time,
      groups: groups,
      rounds: rounds,
      members: members,
    }));

    #page.tsx
    