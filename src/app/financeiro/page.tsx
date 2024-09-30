"use client";
import AppContext from "@/context/app.context";
import { API, API2 } from "../api/api"
import { useState, useEffect } from "react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker"
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import Cards from './Cards'
import PrevistaXRealizadaCurso from "./PrevistaXRealizadaCurso";
import PrevistaXRealizadaPeriodo from "./PrevistaXRealizadaPeriodos";
import InadimplenciaPeriodo from "./InadimplenciaPeriodo";

export default function Dashboard() {
  const [selectedDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [appliedDateRange, setAppliedDateRange] = useState<DateRange | undefined>(selectedDateRange);
  const [data, setData] = useState<any[]>([]);
  const [dataLastMonth, setDataLastMonth] = useState<any[]>([]);
  const [key, setKey] = useState(0);

  const resetDateRange = () => {
    setAppliedDateRange(selectedDateRange);
    setKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { from, to } = appliedDateRange || {};
      if (from && to) {
        const result = await API(from, to);
        setData(result);

        const lastMonthFrom = subMonths(from, 1);
        const lastMonthTo = subMonths(to, 1);
        const resultLastMonth = await API2(lastMonthFrom, lastMonthTo);
        setDataLastMonth(resultLastMonth);
      }
    };
    fetchData();
  }, [appliedDateRange]);

  return (
    <AppContext>
      <div className="flex gap-3 min-h-screen flex-col items-center p-8">
        <div className="flex items-center gap-2">
          <DatePickerWithRange 
            selectedDateRange={appliedDateRange} 
            onDateChange={setAppliedDateRange} 
          />
          <Button onClick={resetDateRange} className="px-4 h-[34px] rounded">
            Redefinir
          </Button>
        </div>
        <Cards contas={data} dataLastMonth={dataLastMonth} />
        <PrevistaXRealizadaPeriodo contas={data} />
        <PrevistaXRealizadaCurso contas={data} />
        <InadimplenciaPeriodo contas={data} />
      </div>
    </AppContext>
  );
}