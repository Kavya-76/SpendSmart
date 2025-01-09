import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { IExpense } from "@/models/Expense";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ExpenseItemProps {
  expenses: IExpense[];
}

const ExpenseChart: React.FC<ExpenseItemProps> = ({ expenses }) => {
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");

  // Filter expenses based on the selected date range
  const filteredData = React.useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.createdAt).getTime();
      const from = fromDate ? new Date(fromDate).getTime() : null;
      const to = toDate ? new Date(toDate).getTime() : null;

      return (
        (!from || expenseDate >= from) &&
        (!to || expenseDate <= to)
      );
    });
  }, [expenses, fromDate, toDate]);

  // Transform the filtered expenses into chart-ready format
  const chartData = React.useMemo(() => {
    return filteredData.map((expense) => ({
      date: new Date(expense.createdAt).toISOString().split("T")[0], // Format as YYYY-MM-DD
      price: expense.amount,
    }));
  }, [filteredData]);

  return (
    <Card className="mt-5 mb-5">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Expense Line Chart</CardTitle>
          <CardDescription>
            Showing expenses over time. Use the date range controls to filter.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {/* Date Range Controls */}
        <div className="flex items-center gap-4 mb-4">
          <div>
            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
              From Date:
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
              To Date:
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Line Chart */}
        <div className="aspect-auto h-[250px] w-full">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            width={600}
            height={300}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              dataKey="price"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: any) => `$${value}`}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
