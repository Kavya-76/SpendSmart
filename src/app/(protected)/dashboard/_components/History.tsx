"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CountUp from "react-countup";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { GetFormatterForCurrency } from "@/lib/formatNumber";
import { cn } from "@/lib/utils";

export interface historyDataType {
  income: number;
  expense: number;
  day?: number;
  month: number;
  year: number;
}

type TimeFrame = "month" | "year";
type Period = { year: number; month: number };

function History() {
  const [timeframe, setTimeframe] = useState<TimeFrame>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(), // Month index (0-based)
    year: new Date().getFullYear(),
  });
  const [historyData, setHistoryData] = useState<historyDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with user currency preference if available
  const userCurrency = "USD";

  const formatter = useMemo(() => GetFormatterForCurrency(userCurrency), [userCurrency]);

  // Fetch history data
  useEffect(() => {
    let isMounted = true; // Handle component unmount
    const getHistoryData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await axios.get("/api/get-history", {
          params: { timeFrame: timeframe, ...period },
        });
        if (isMounted) setHistoryData(data);
      } catch (err) {
        if (isMounted) setError("Failed to fetch history data. Please try again.");
        console.error("Error fetching history data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    getHistoryData();

    return () => {
      isMounted = false;
    };
  }, [timeframe, period]);

  const dataAvailable = historyData.length > 0;

  return (
    <div className="container">
      <h2 className="mt-12 text-3xl font-bold">History</h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />

            <div className="flex h-10 gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={isLoading}>
            {error && (
              <div className="text-center text-red-500">{error}</div>
            )}
            {dataAvailable && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart height={300} data={historyData} barCategoryGap={5}>
                  <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#10b981" stopOpacity="1" />
                      <stop offset="1" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ef4444" stopOpacity="1" />
                      <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    strokeOpacity="0.2"
                    vertical={false}
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      return timeframe === "year"
                        ? date.toLocaleDateString("default", { month: "long" })
                        : date.toLocaleDateString("default", { day: "2-digit" });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey="income"
                    label="Income"
                    fill="url(#incomeBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey="expense"
                    label="Expense"
                    fill="url(#expenseBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Tooltip content={<CustomTooltip formatter={formatter} />} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {!dataAvailable && !isLoading && !error && (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                <p>No data for the selected period</p>
                <p className="text-sm text-muted-foreground">
                  Try selecting a different period or adding new transactions
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}

export default History;

interface CustomTooltipProps {
  formatter: Intl.NumberFormat;
  active?: boolean;
  payload?: Array<{
    payload: {
      expense: number;
      income: number;
    };
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ formatter, active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const { expense, income } = payload[0].payload;

  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <TooltipRow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor="bg-emerald-500"
        textColor="text-emerald-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-gray-100"
        textColor="text-foreground"
      />
    </div>
  );
};

const TooltipRow = ({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: {
  label: string;
  textColor: string;
  bgColor: string;
  value: number;
  formatter: Intl.NumberFormat;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formatter.format}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};
