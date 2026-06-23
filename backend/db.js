import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/chat-app").then(console.log("Database connected successfully"));
  } catch (error) {
    console.error("Database connection error:", error);
  }
};