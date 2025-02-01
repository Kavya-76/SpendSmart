"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import CardInfo from "./_components/CardInfo";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import axios from "axios";
import { startOfMonth } from "date-fns";
import History from "./_components/History";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const Dashboard: React.FC = () => {
  const user = useCurrentUser();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [totalBudgets, setTotalBudgets] = useState<number>(0);
  const [totalBudgetAmount, setTotalBudgetAmount] = useState<number>(0);
  const [totalIncomeAmount, setTotalIncomeAmount] = useState<number>(0);
  const [totalExpenseAmount, setTotalExpenseAmount] = useState<number>(0);

  useEffect(() => {
    if (user !== undefined) {
      setIsLoadingUser(false);
    }
  }, [user]);

  // Memoized function to fetch data
  const fetchAllData = useCallback(async () => {
    if (!user) return;

    setIsLoadingData(true);
    try {
      const response = await axios.get("/api/get-dashboard-numbers", {
        params: {
          fromDate: dateRange.from?.toISOString(),
          toDate: dateRange.to?.toISOString(),
        },
      });
      setTotalBudgets(response.data.totalBudgets);
      setTotalBudgetAmount(response.data.totalBudgetAmount);
      setTotalIncomeAmount(response.data.totalIncomeAmount);
      setTotalExpenseAmount(response.data.totalExpenseAmount);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [user, dateRange]);

  // Fetch data when user and date range are set
  useEffect(() => {
    if (!isLoadingUser && user) {
      fetchAllData();
    }
  }, [isLoadingUser, user, dateRange, fetchAllData]);

  // if (isLoadingUser || isLoadingData) {
  //   return <p>Loading...</p>;
  // }

  return (
    <div className="w-full p-8">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h2 className="font-bold text-4xl">Hi, {user?.name} 👋</h2>
          <p className="text-gray-500">
            Here&apos;s what&apos;s happening with your money. Let&apos;s manage
            your expenses.
          </p>
        </div>
        <div>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              if (!from || !to) return;
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>

      <SkeletonWrapper isLoading={isLoadingData || isLoadingUser} >
        <CardInfo
          totalBudgets={totalBudgets}
          totalBudgetAmount={totalBudgetAmount}
          totalExpenseAmount={totalExpenseAmount}
          totalIncomeAmount={totalIncomeAmount}
        />
      </SkeletonWrapper>
      <div>
        <History />
      </div>
    </div>
  );
};

export default Dashboard;
