// utils/db.js
import mongoose from "mongoose";
const conn = async (URI) => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(0);
  }
};

export default conn;
