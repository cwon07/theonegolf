import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import Member from "@/app/lib/database/models/members.model";

interface Member {
  _id: string;
  id: number;
  handicap: [number]
  name: string;
  sex: string;
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const deletedMember = await Member.findOneAndDelete({ id: parseInt(id) }).exec();
    
    if (deletedMember) {
      return NextResponse.json({ 
        message: "Member deleted successfully",
        member: deletedMember 
      });
    } else {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({error: "Failed to delete member"}, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await connectToDatabase();

  const member = await Member.findOne({ id: parseInt(id) }).exec();
  if (member) {
    return NextResponse.json(member);
  } else {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    console.log("Received body:", body);

    const { id, name, sex, eng_name, handicap, is_new } = body;

    // Validate required fields
    if (!id || !name || !sex || handicap === undefined || is_new === undefined) {
      return NextResponse.json(
        { error: "ID, name, sex, handicap, and is_new are required" },
        { status: 400 }
      );
    }

    // Validate `sex` field
    const allowedSexValues = ["Male", "Female", "Other"];
    if (!allowedSexValues.includes(sex)) {
      return NextResponse.json(
        { error: "Invalid value for sex. Allowed: Male, Female, Other" },
        { status: 400 }
      );
    }

    // Validate `is_new` field
    const allowedIsNewValues = [true, false];
    if (!allowedIsNewValues.includes(is_new)) {
      return NextResponse.json(
        { error: "Invalid value for is_new. Allowed: true, false" },
        { status: 400 }
      );
    }

    if (!Array.isArray(handicap)) {
      return NextResponse.json(
        { error: "Handicap must be an array of numbers" },
        { status: 400 }
      );
    }

    // Validate each handicap value
    const invalidHandicap = handicap.find(
      (num) => typeof num !== "number" || isNaN(num) || num < -18 || num > 45
    );
    if (invalidHandicap !== undefined) {
      return NextResponse.json(
        { error: "All handicap values must be numbers between -18 and 45" },
        { status: 400 }
      );
    }

    // Convert `is_new` to boolean (if it’s a string like "true")
    const parsedIsNew = is_new === "true" || is_new === true;

    // Update or create member
    const updatedMember = await Member.findOneAndUpdate(
      { id: id }, // Find by custom id field
      {
        id,
        name,
        sex,
        eng_name: eng_name || "", // Default to empty string if undefined
        handicap,
        is_new: parsedIsNew,
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create if it doesn’t exist
        runValidators: true, // Ensure schema validation applies
      }
    );

    console.log("Member updated successfully:", updatedMember);

    return NextResponse.json(
      { message: "Member updated successfully", member: updatedMember },
      { status: 200 } // 200 for update, could use 201 if created
    );
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
