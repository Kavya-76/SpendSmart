"use client";
import React, { useEffect, useState } from "react";
import { IExpense } from "@/models/Expense";
import ExpenseListTable from "./_components/ExpenseListTable";
import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";

// Define types for expense and response data if you have a defined model for expenses
interface Expense {
  _id: string;
  title: string;
  amount: number;
  description: string;
  icon: string;
}

const ExpensesPage = () => {
  const [expensesList, setExpensesList] = useState<IExpense[]>([]); // Explicitly typing the expenses list as an array of Expense objects
  const user = useCurrentUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]);

  /**
   * Fetches all expenses belonging to the user
   */
  const getAllExpenses = async (): Promise<void> => {
    try {
      // Replace with the actual axios call to fetch expenses
      const response = await axios.get("/api/get-expenses"); // Assume endpoint here
      setExpensesList(response.data); // Assuming response data is in the shape of an array of expenses
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Expenses</h2>
      <ExpenseListTable
        refreshData={getAllExpenses}
        expensesList={expensesList}
      />
    </div>
  );
};

export default ExpensesPage;
