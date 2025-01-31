"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import EditBudget from "../_components/EditBudget";
import ExpenseListTable from "../_components/ExpenseListTable";
import { IExpense } from "@/models/Expense";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { IBudgetExtended } from "@/models/Budget";
import { use } from "react"; // Add this import for React.use()

const ExpenseScreen = ({
  params,
}: {
  params: Promise<{ budgetId: string }>; // Ensure params is a Promise
}) => {
  const user = useCurrentUser();
  const [budgetInfo, setBudgetInfo] = useState<IBudgetExtended | null>(null);
  const [expensesList, setExpensesList] = useState<IExpense[]>([]);
  const router = useRouter();

  // Use React.use() to unwrap the Promise and get the params
  const { budgetId } = use(params); 

  /**
   * Get Latest Expenses
   */
  const getExpensesList = useCallback(async () => {
    try {
      const response = await axios.get(`/api/get-budget-expenses/${budgetId}`);
      const expenses = response.data;
      setExpensesList(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, [budgetId]);

  /**
   * Get Budget Information
   */
  const getBudgetInfo = useCallback(async () => {
    try {
      const response = await axios.get(`/api/get-budget/${budgetId}`);
      const budget = response.data;
      setBudgetInfo(budget[0]);
      await getExpensesList();
    } catch (error) {
      console.error("Error fetching budget info:", error);
    }
  }, [budgetId, getExpensesList]);

  /**
   * Delete Budget
   */
  const deleteBudget = async () => {
    try {
      await axios.delete(`/api/delete-budget/${budgetId}`);
      setExpensesList([]);
      toast.success("Budget deleted!");
      router.replace("/dashboard/budgets");
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user, getBudgetInfo]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
          My Expenses
        </span>
        <div className="flex gap-2 items-center">
          {budgetInfo && (
            <EditBudget budgetInfo={budgetInfo} refreshData={getBudgetInfo} />
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2 rounded-full" variant="destructive">
                <Trash className="w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget along with expenses and remove your data
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteBudget}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
        )}
        <AddExpense budgetId={budgetId} refreshData={getBudgetInfo} />
      </div>
      <div className="mt-4">
        <ExpenseListTable expensesList={expensesList} refreshData={getBudgetInfo} />
      </div>
    </div>
  );
};

export default ExpenseScreen;
