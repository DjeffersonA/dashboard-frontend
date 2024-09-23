"use client";
import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDateRange: DateRange | undefined;
  onDateChange: (dateRange: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  selectedDateRange,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [localDateRange, setLocalDateRange] = React.useState<DateRange | undefined>(selectedDateRange);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setLocalDateRange(selectedDateRange);
  }, [selectedDateRange]);
  
  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setLocalDateRange(newDateRange);
  };

  const handleApply = () => {
    onDateChange(localDateRange);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalDateRange(undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !localDateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {localDateRange?.from ? (
              localDateRange.to ? (
                <>
                  {format(localDateRange.from, "dd MMM, yyyy", { locale: ptBR })} -{" "}
                  {format(localDateRange.to, "dd MMM, yyyy", { locale: ptBR })}
                </>
              ) : (
                format(localDateRange.from, "dd MMM, yyyy", { locale: ptBR })
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={localDateRange?.from}
            selected={localDateRange}
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={ptBR}
          />
          <div className="flex justify-between p-2">
            <Button variant="ghost" onClick={handleClear}>
              Limpar
            </Button>
            <Button onClick={handleApply}>Aplicar</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}