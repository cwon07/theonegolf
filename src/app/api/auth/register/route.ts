import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database/index";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the admin schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export async function POST(req: Request) {
  try {
    
    const body = await req.json(); // Ensure JSON is properly parsed
    console.log("Request body:", body);
    const { username, password, email } = body;

    // Validate request data
    if (!username || !password || !email) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();

    return NextResponse.json({ message: "Admin registered successfully" }, { status: 201 });
    
  } catch (error) {
    console.error("Error registering admin:", error);
   return NextResponse.json({ error: "Internal server error" }, { status: 500 });
   
  }
}
