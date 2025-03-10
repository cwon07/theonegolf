import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import Member from "@/app/lib/database/models/members.model";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse request body
    console.log("Received body:", body);

    const { id, name, sex, eng_name, handicap, is_new } = body;

    // Validate required fields
    if (!id || !name || !sex || handicap === undefined || is_new === undefined) {
      return NextResponse.json({ error: "ID, name, sex, handicap, and is_new are required" }, { status: 400 });
    }

    // Validate `sex` field
    const allowedSexValues = ["Male", "Female", "Other"];
    if (!allowedSexValues.includes(sex)) {
      return NextResponse.json({ error: "Invalid value for sex. Allowed: Male, Female, Other" }, { status: 400 });
    }

    const allowedIsNewValues = [true, false];
    if (!allowedIsNewValues.includes(is_new)) {
      return NextResponse.json({ error: "Invalid value for is_new. Allowed: true, false" }, { status: 400 });
    }

    await connectToDatabase();

    // Convert `handicap` to an integer
    const parsedHandicap = parseInt(handicap, 10);
    if (isNaN(parsedHandicap) || parsedHandicap < -18 || parsedHandicap > 45) {
      return NextResponse.json({ error: "Handicap must be a number between -18 and 45" }, { status: 400 });
    }

    // Convert `is_new` to boolean
    const parsedIsNew = is_new === "true" || is_new === true;

    // Create new member
    const newMember = new Member({
      id,
      name,
      sex,
      eng_name,
      handicap: parsedHandicap,
      is_new: parsedIsNew
    });

    await newMember.save();
    console.log("Member saved successfully:", newMember);

    return NextResponse.json({ message: "Member created successfully", member: newMember }, { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
