"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import CardInfo from "./_components/CardInfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import { IBudgetExtended } from "@/models/Budget";
import { IExpense } from "@/models/Expense";
import { IIncome } from "@/models/Income";
import axios from "axios";

const Dashboard: React.FC = () => {
  const user = useCurrentUser();

  const [budgetList, setBudgetList] = useState<IBudgetExtended[]>([]);
  const [incomeList, setIncomeList] = useState<IIncome[]>([]);
  const [expensesList, setExpensesList] = useState<IExpense[]>([]);

  // Fetch budget list and related data
  const getBudgetList = useCallback(async () => {
    try {
      const response = await axios.get("/api/get-budgets");
      setBudgetList(response.data);
      await Promise.all([getIncomeList(), getAllExpenses()]);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  }, []); // Empty dependency array ensures this function is stable

  // Fetch income list
  const getIncomeList = async () => {
    try {
      const response = await axios.get("/api/get-incomes");
      setIncomeList(response.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  // Fetch all expenses
  const getAllExpenses = async () => {
    try {
      const response = await axios.get("/api/get-all-expenses");
      setExpensesList(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user, getBudgetList]);

  return (
    <div className="w-full p-8 bg-">
      <h2 className="font-bold text-4xl">Hi, {user?.name} 👋</h2>
      <p className="text-gray-500">
        Here&apos;s what&apos;s happening with your money. Let&apos;s manage your expenses.
      </p>

      <CardInfo budgetList={budgetList} incomeList={incomeList} />

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 mt-6 gap-5">
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-8">
          <BarChartDashboard budgetList={budgetList} />

          <ExpenseListTable
            expensesList={expensesList}
            refreshData={getBudgetList}
          />
        </div>

        <div className="sm:col-span-1 md:col-span-2 lg:col-span-4 gap-5">
          <h2 className="w-full font-bold text-lg">Latest Budgets</h2>
          {budgetList.length > 0
            ? budgetList
                .slice(0, 5)
                .map((budget, index) => (
                  <BudgetItem budget={budget} key={budget.id || index} />
                ))
            : [1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[180px] w-full bg-slate-200 rounded-lg animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
