import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

// Function to get user by email
export const getUserByEmail = async (email: string) => {
  await dbConnect();
  try {
    const user = await UserModel.findOne({ email });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

// Function to get user by ID
export const getUserById = async (id: string) => {
  await dbConnect();
  try {
    const user = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(id) }); // Convert the string ID to ObjectId
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};
