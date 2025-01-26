import { EditItemSchema } from "@/schemas";
import dbConnect from "@/lib/db";
import ExpenseModel from "@/models/Expense"; // Import your Expense model
import IncomeModel from "@/models/Income";
import { currentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export const PUT = async (req: Request) => {
  await dbConnect(); // Connect to the database
  try {
    const { id, type, ...body } = await req.json(); // Parse the incoming request body
    body.createdAt = new Date(body.createdAt);
    const itemId = String(id); // Extract expense ID
    const userId = await currentUserId();

    const validatedFields = EditItemSchema.safeParse(body);
    if(!validatedFields.success) {
        return NextResponse.json({
            success: false,
            message: "Enter valid fields"
        }, {status: 400})
    }

    if(type==="income")
    {

        const existingIncome = await IncomeModel.findById(itemId);
        if (!existingIncome) {
            return NextResponse.json(
                { message: "Income not found" },
                { status: 404 }
            );
        }
        
        // Check if the expense belongs to the user
        if (existingIncome.createdBy.toString() !== userId) {
            return NextResponse.json(
                { message: "Unauthorized access" },
                { status: 403 }
            );
        }
        
        const { icon, title, amount, description, createdAt } = validatedFields.data;
        // Update the expense
        const updatedIncome = await IncomeModel.findByIdAndUpdate(
            itemId,
            {
                icon,
                title,
                amount,
                description,
                createdAt,
                updatedAt: Date.now(),
            },
            { new: true } // Return the updated document
        );
        
        return NextResponse.json(
            { success: "Income Updated Successfully", data: updatedIncome },
            { status: 200 }
        );
    }

    else if(type==="expense")
    {
        const existingExpense = await ExpenseModel.findById(itemId);
        if (!existingExpense) {
            return NextResponse.json(
                { message: "Expense not found" },
                { status: 404 }
            );
        }
        
        // Check if the expense belongs to the user
        if (existingExpense.createdBy.toString() !== userId) {
            return NextResponse.json(
                { message: "Unauthorized access" },
                { status: 403 }
            );
        }
        
        const { icon, title, amount, description, createdAt } = validatedFields.data;
        // Update the expense
        const updatedExpense = await ExpenseModel.findByIdAndUpdate(
            itemId,
            {
                icon,
                title,
                amount,
                description,
                createdAt,
                updatedAt: Date.now(),
            },
            { new: true } // Return the updated document
        );
        
        return NextResponse.json(
            { success: "Expense Updated Successfully", data: updatedExpense },
            { status: 200 }
        );
    }
  } catch (error) {
    console.error("Error in EditExpense API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
