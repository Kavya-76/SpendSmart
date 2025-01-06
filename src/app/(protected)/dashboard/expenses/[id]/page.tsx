"use client";
import React, { useEffect, useState } from "react";
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

const ExpenseScreen = ({ params }: any) => {
  const user = useCurrentUser();
  const [budgetInfo, setbudgetInfo] = useState<IBudgetExtended>();
  const [expensesList, setExpensesList] = useState<IExpense[]>([]);
  const router = useRouter();
  params = React.use(params);
  const budgetId = params.id;

  useEffect(() => {
    user && getBudgetInfo();
  }, [user]);


  /**
   * Get Budget Information
   */
  const getBudgetInfo = async () => {
    if (user) {
      try {
        const response = await axios.get(`/api/get-budget/${budgetId}`)
        const budget = response.data
        setbudgetInfo(budget[0]);
        getExpensesList();
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    }
  };

  /**
   * Get Latest Expenses
   */
  const getExpensesList = async () => {
    try {
      const response = await axios.get(`/api/get-expenses/${budgetId}`)
      const expenses = response.data;
      setExpensesList(expenses)
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  }

  /**
   * Used to Delete budget
   */
  const deleteBudget = async () => {
    try {
      const response = await axios.delete(`/api/delete-budget/${budgetId}`)
      setExpensesList([])
      // console.log(response.data)
    } catch (error) {
      console.error("Error deleting budgets: ", error);
      throw error;
    }
    toast("Budget Deleted !");
    router.replace("/dashboard/budgets");
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
          My Expenses
        </span>
        <div className="flex gap-2 items-center">
          {budgetInfo && <EditBudget
            budgetInfo={budgetInfo}
            refreshData={() => getBudgetInfo()}
          />}

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
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div
        className="grid grid-cols-1 
        md:grid-cols-2 mt-6 gap-5"
      >
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200 
            rounded-lg animate-pulse"
          ></div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div className="mt-4">
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
};

export default ExpenseScreen;