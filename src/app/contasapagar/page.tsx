"use client";
import AppContext from "@/context/app.context";
import { useState, useEffect } from "react";
import { APIContasAPagar } from "../api/api";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button"; 
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth, subDays } from "date-fns";
import Cards from "./Cards";
import FullStackedChart from "./FullStackedChart";
import StackedChart from "./StackedChart";

export default function ContasAPagar() {
  const [selectedDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [appliedDateRange, setAppliedDateRange] = useState<DateRange | undefined>(selectedDateRange);
  const [data, setData] = useState<any[]>([]);
  const [key, setKey] = useState(0);

  const resetDateRange = () => {
    setAppliedDateRange(selectedDateRange);
    setKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { from, to } = appliedDateRange || {};
      if (from && to) {
        const result = await APIContasAPagar(from, to);
        const data = result.filter(item => {
          const itemDate = new Date(item.Data.split('/').reverse().join('-'));
          return itemDate >= new Date(subDays(from, 1)) && itemDate <= new Date(to);
        });

        setData(data);
      }
    };

    fetchData();
  }, [appliedDateRange]);

  return (
    <AppContext>
      <div className="flex gap-1 min-h-screen flex-col items-center p-4">
        <div className="flex items-center gap-2">
          <DatePickerWithRange 
            selectedDateRange={appliedDateRange} 
            onDateChange={setAppliedDateRange} 
          />
          <Button onClick={resetDateRange} className="px-4 h-[34px] rounded">
            Redefinir
          </Button>
        </div>
        <Cards contas={data} />
        <StackedChart data={data} />        
        <FullStackedChart data={data} />
      </div>
    </AppContext>
  );
}