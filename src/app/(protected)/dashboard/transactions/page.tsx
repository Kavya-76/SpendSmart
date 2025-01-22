"use client";

import React, { useState } from "react";
import TransactionTable from "./_components/TransactionTable";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";

const TransactionsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <div className="p-10">
      <div className="flex flex-wrap justify-between">
        <h2 className="font-bold text-3xl">Transactions History</h2>
        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={values=>{
            const {from, to} = values.range
            if(!from || !to) return;
            setDateRange({from, to})
          }}
        />
      </div>
      <TransactionTable from={dateRange.from!} to={dateRange.to!} />
    </div>
  );
};

export default TransactionsPage;
