import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/app/lib/database/index"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define Admin schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Both email and password are required" });
    }

    try {
      await connectToDatabase();

      // Find the admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      // Compare provided password with the stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: admin._id, username: admin.username, email: admin.email },
        process.env.JWT_SECRET as string, // Set JWT secret in .env
        { expiresIn: "1h" } // Set token expiration time
      );

      // Send the token as a response
      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
