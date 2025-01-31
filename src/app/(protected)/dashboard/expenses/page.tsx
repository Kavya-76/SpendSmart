"use client";
import React, { useEffect, useState } from "react";
import { IExpense } from "@/models/Expense";
import ExpenseList from "./_components/ExpenseList";
import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";
import ExpenseChart from "./_components/ExpenseChart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GroupedExpense {
  createdAt: string;
  totalAmount: number;
}

const ExpensesPage: React.FC = () => {
  const [expensesList, setExpensesList] = useState<IExpense[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useCurrentUser();

  useEffect(() => {
    if (user) {
      getExpenseList();
    }
  }, [user, dateRange]);

  const getExpenseList = async () => {
    setLoading(true);
    setError(null);
    await axios
      .get<IExpense[]>("/api/get-expenses", {
        params: {
          fromDate: dateRange.from?.toISOString(),
          toDate: dateRange.to?.toISOString(),
        },
      })
      .then((response) => {
        setExpensesList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        setError("Failed to fetch expenses. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const groupExpensesByDate = React.useMemo((): GroupedExpense[] => {
    const grouped: { [key: string]: number } = {};

    expensesList.forEach((expense) => {
      const createdAt = new Date(expense.createdAt).toISOString().split("T")[0];
      grouped[createdAt] = (grouped[createdAt] || 0) + expense.amount;
    });

    return Object.entries(grouped)
      .map(([createdAt, totalAmount]) => ({
        createdAt,
        totalAmount,
      }))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [expensesList]);

  if (loading) return <div className="p-10">Loading...</div>;

  if (error)
    return (
      <div className="p-10 text-red-500">
        <h2>Error: {error}</h2>
      </div>
    );

  return (
    <div className="p-10">
      <div className="flex flex-wrap justify-between">
        <h2 className="font-bold text-3xl">My Expenses</h2>
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
      <ExpenseChart groupedExpenses={groupExpensesByDate} />
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Add Expense!</AlertTitle>
        <AlertDescription>
          You can add expenses by selecting a budget in Budget&apos;s section.
        </AlertDescription>
      </Alert>
      <ExpenseList filteredExpenses={expensesList} />
    </div>
  );
};

export default ExpensesPage;
