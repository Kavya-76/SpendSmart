"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import CardInfo from "./_components/CardInfo";
// import BarChartDashboard from "./_components/BarChartDashboard";
// import BudgetItem from "./budgets/_components/BudgetItem";
// import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import { IBudgetExtended } from "@/models/Budget";
// import { IExpense } from "@/models/Expense";
import { IIncome } from "@/models/Income";
import axios from "axios";
import { startOfMonth } from "date-fns";
import History from "./_components/History";

const Dashboard: React.FC = () => {
  const user = useCurrentUser();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [budgetList, setBudgetList] = useState<IBudgetExtended[]>([]);
  const [incomeList, setIncomeList] = useState<IIncome[]>([]);
  // const [expensesList, setExpensesList] = useState<IExpense[]>([]);

  useEffect(() => {
    if (user !== undefined) {
      setIsLoadingUser(false);
    }
  }, [user]);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const [budgetsResponse, incomesResponse] =
        await Promise.all([
          axios.get("/api/get-budgets"),
          axios.get("/api/get-incomes"),
          axios.get("/api/get-all-expenses", {
            params: {
              fromDate: startOfMonth(new Date()),
              toDate: new Date(),
            },
          }),
        ]);

      setBudgetList(budgetsResponse.data);
      setIncomeList(incomesResponse.data);
      // setExpensesList(expensesResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingUser && user) {
      fetchAllData();
    }
  }, [isLoadingUser, user, fetchAllData]);

  if (isLoadingUser || isLoadingData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full p-8">
      <h2 className="font-bold text-4xl">Hi, {user?.name} 👋</h2>
      <p className="text-gray-500">
        Here&apos;s what&apos;s happening with your money. Let&apos;s manage
        your expenses.
      </p>

      <CardInfo budgetList={budgetList} incomeList={incomeList} />

      {/* <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 mt-6 gap-5">
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-8">
          <BarChartDashboard budgetList={budgetList} />

          <ExpenseListTable
            expensesList={expensesList}
            refreshData={fetchAllData}
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
      </div> */}
      <div>
        <History/>
      </div>
    </div>
  );
};

export default Dashboard;
