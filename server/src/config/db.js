import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env");

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
}
