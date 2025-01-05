import * as z from "zod";
import mongoose from "mongoose";
import { BudgetSchema } from "@/schemas";
import dbConnect from "@/lib/db";
import BudgetModel, { IBudget } from "@/models/Budget";
import { currentUser, currentUserId } from "@/lib/auth";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  await dbConnect(); // Connect to the database

  try {
    const body = await req.json(); // Parse the incoming request body
    const validatedFields = BudgetSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return Response.json(
        {
          success: false,
          message: "Enter valid fields",
        },
        { status: 500 }
      );
    }

    const { title, amount, description, icon } = validatedFields.data;

    // getting userID
    const userId = await currentUserId();

    
    // Create a new budget
    const newBudget: IBudget = new BudgetModel({
      createdBy: new mongoose.Types.ObjectId(String(userId)),
      title,
      amount,
      description,
      icon,
    });

    await newBudget.save(); // Save the new user to the database

    return NextResponse.json(
      {success: "Budget Created Successfully"},
      {status: 200}
    )
  } catch (error) {
    console.error("Error in CreateBudget API:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
