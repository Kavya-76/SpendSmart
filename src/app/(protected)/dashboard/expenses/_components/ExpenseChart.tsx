import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer, // Import ResponsiveContainer
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GroupedExpense {
  createdAt: string; // ISO date string
  totalAmount: number; // Expense totalAmount
}

interface ExpenseChartProps {
  groupedExpenses: GroupedExpense[]; // Array of grouped expenses
  fromDate?: string; // Optional start date
  toDate?: string; // Optional end date
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ groupedExpenses }) => {
  // Transform the grouped expenses into chart-ready format
  const chartData = React.useMemo(() => {
    return groupedExpenses.map((expense) => ({
      date: new Date(expense.createdAt).toISOString().split("T")[0], // Format as YYYY-MM-DD
      price: expense.totalAmount,
    }));
  }, [groupedExpenses]);

  return (
    <div className="p-10">
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Expense Line Chart</CardTitle>
            <CardDescription>
              Showing expenses over time. Use the date range controls to filter.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          {/* Line Chart */}
          <div className="aspect-auto w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value: string) => {
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
                  tickFormatter={(value: number) => `₹${value}`}
                />
                <Tooltip
                  formatter={(value: number | string) => `₹${value}`}
                  labelFormatter={(label: string) => {
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
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseChart;
