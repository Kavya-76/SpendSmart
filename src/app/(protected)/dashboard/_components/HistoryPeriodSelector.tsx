"use client";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

type TimeFrame = "month" | "year";
type Period = { year: number; month: number };
interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: TimeFrame;
  setTimeframe: (timeframe: TimeFrame) => void;
}

const years = [2022,2023,2024,2025]
function HistoryPeriodSelector({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: Props) {
  
    const isLoading = false;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={isLoading} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper
          isLoading={isLoading}
          fullWidth={false}
        >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper
            isLoading={isLoading}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

export default HistoryPeriodSelector;

function YearSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            { month: "long" }
          );

          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}