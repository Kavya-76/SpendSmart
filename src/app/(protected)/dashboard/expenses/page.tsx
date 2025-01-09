"use client";
import React, { useEffect, useState } from "react";
import { IExpense } from "@/models/Expense";
import ExpenseList from "./_components/ExpenseList";
import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";
import ExpenseChart from "./_components/ExpenseChart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupedExpense {
  createdAt: string;
  totalAmount: number;
}

// Utility function to parse dates
const parseDate = (date: Date | undefined) =>
  date ? new Date(date).getTime() : null;

// DateSelector Component for Reusability
const DateSelector: React.FC<{
  label: string;
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
}> = ({ label, date, onChange }) => (
  <div className="mt-2">
    <h2 className="text-black font-medium my-1">{label}</h2>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  </div>
);

const ExpensesPage: React.FC = () => {
  const [expensesList, setExpensesList] = useState<IExpense[]>([]);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useCurrentUser();

  useEffect(() => {
    if (user) {
      getExpenseList();
    }
  }, [user]);

  const getExpenseList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<IExpense[]>("/api/get-all-expenses");
      setExpensesList(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to fetch expenses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = React.useMemo(() => {
    return expensesList
      .filter((expense) => {
        const expenseDate = new Date(expense.createdAt).getTime();
        const from = parseDate(fromDate);
        const to = parseDate(toDate);

        return (!from || expenseDate >= from) && (!to || expenseDate <= to);
      })
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [expensesList, fromDate, toDate]);

  const groupExpensesByDate = React.useMemo((): GroupedExpense[] => {
    const grouped: { [key: string]: number } = {};

    filteredData.forEach((expense) => {
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
  }, [filteredData]);

  if (loading) return <div className="p-10">Loading...</div>;

  if (error)
    return (
      <div className="p-10 text-red-500">
        <h2>Error: {error}</h2>
      </div>
    );

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Expenses</h2>

      <div className="flex items-center gap-4 mb-4">
        <DateSelector label="From Date" date={fromDate} onChange={setFromDate} />
        <DateSelector label="To Date" date={toDate} onChange={setToDate} />
      </div>

      <ExpenseChart groupedExpenses={groupExpensesByDate} />
      <ExpenseList filteredExpenses={filteredData} />
    </div>
  );
};

export default ExpensesPage;
