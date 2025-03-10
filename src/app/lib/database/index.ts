import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn; // Return the cached connection if already established

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is missing');
    }

    try {
        console.log("🔹 Connecting to MongoDB...");
        cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
            dbName: 'theonegolf',
            bufferCommands: false,
            serverSelectionTimeoutMS: 30000, // Ensures the connection attempt does not hang indefinitely
        });

        cached.conn = await cached.promise;
        console.log("✅ MongoDB connection established");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw new Error("MongoDB connection failed");
    }

    return cached.conn;
}

