"use client";
import AppContext from "@/context/app.context";
import { APIMetaAds } from "../api/api"
import { useState, useEffect } from "react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker"
import { startOfMonth, subMonths } from "date-fns";
import Cards from "./Cards";
import { MarketingTable } from "./CPLTable";

export default function Marketing() {
  const [selectedDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [appliedDateRange, setAppliedDateRange] = useState<DateRange | undefined>(selectedDateRange);
  const [data, setData] = useState<any[]>([]);
  const [dataLastMonth, setDataLastMonth] = useState<any[]>([]);
  const [,setKey] = useState(0);

  const resetDateRange = () => {
    setAppliedDateRange(selectedDateRange);
    setKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      var { from, to } = appliedDateRange || {};
      if (!to) to = from;
      if (from && to) {
        const result = await APIMetaAds(from, to);
        setData(result);

        const lastMonthFrom = subMonths(from, 1);
        const lastMonthTo = subMonths(to, 1);
        const resultLastMonth = await APIMetaAds(lastMonthFrom, lastMonthTo);
        setDataLastMonth(resultLastMonth);
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
        <Cards data={data} dataLastMonth={dataLastMonth} />
        <MarketingTable data={data}/>
      </div>
    </AppContext>
  );
}
