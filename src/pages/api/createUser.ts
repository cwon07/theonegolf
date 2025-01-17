import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/app/lib/database";
import mongoose from "mongoose";

// Define the user schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

// Avoid re-compiling model during hot-reloading in development
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, firstName, lastName, email } = req.body;

    // Validate the request body
    if (!username || !firstName || !lastName || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Connect to the database
      await connectToDatabase();

      // Create and save the user
      const user = new User({ username, firstName, lastName, email });
      const result = await user.save();

      res.status(201).json({ message: "User created", data: result });
    } catch (error: unknown) {
      console.error("Error saving to database:", error);

      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }

      if (error instanceof mongoose.Error) {
        return res.status(500).json({ error: "Database error", details: error.message });
      }

      res.status(500).json({ error: "Failed to save user" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
