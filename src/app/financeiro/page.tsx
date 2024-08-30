"use client";
import AppContext from "@/context/app.context";
import Cards from './Cards'
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { API } from "../api/api"
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker"
import { startOfMonth, endOfMonth } from "date-fns";
import GraficoBarra from "./Chart";

export default function Dashboard() {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [appliedDateRange, setAppliedDateRange] = useState<DateRange | undefined>(selectedDateRange);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { from, to } = appliedDateRange || {};
      if (from && to) {
        const result = await API(from, to);
        setData(result);
      }
    };
    fetchData();
  }, [appliedDateRange]);

  return (
    <AppContext>
      <div className="flex gap-3 min-h-screen flex-col items-center p-8">
        <DatePickerWithRange 
          selectedDateRange={selectedDateRange} 
          onDateChange={setAppliedDateRange} 
        />
        <Cards contas={data} />
        <GraficoBarra contas={data} />
      </div>
    </AppContext>
  );
}