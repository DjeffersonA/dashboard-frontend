"use client"
import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { LabelList, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartLegend, ChartLegendContent, ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";
import { getMonth, getYear } from "date-fns";
import { getPeriodos, getIntervalo } from "./Periodos"

const percentLabel = (props: any) => {
  return `${props}%`;
};

const valueLabel = (props: any) => {
  return `R$${props.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

interface Conta {
  data_vencimento: string;
  valor_mensalidade: string;
  data_pagamento: string;
  valor_pago: string;
}

interface GProps {
  contas: Conta[];
}

const InadimplenciaPeriodo: React.FC<GProps> = ({ contas }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const today: Date = new Date();
    const formatToday: string = today.toISOString().split('T')[0];
    const fetchData = async () => {
      if (contas.length > 0) {
        const intervalos = ['Dia 05', 'Dia 10', 'Dia 15', 'Dia 20', 'Dia 25', 'Dia 30/31'];
        const periodos = await getPeriodos(getYear(new Date()), getMonth(new Date()) + 1);
        console.log(periodos);
        const periodoMap = contas.reduce((acc, item) => {
          const intervalo = getIntervalo(new Date(item.data_vencimento).getDate(), periodos);
          if (!intervalo) return acc;

          if (!acc[intervalo]) {
            acc[intervalo] = { pago: 0, inadimplencia: 0 };
          }

          if (item.data_pagamento !== null) {
            acc[intervalo].pago += parseFloat(item.valor_pago || '0');
          }

          if (formatToday > item.data_vencimento && item.valor_pago == null && item.data_pagamento == null) {
            acc[intervalo].inadimplencia += parseFloat(item.valor_mensalidade || '0') 
          }

          return acc;
        }, {} as Record<string, { pago: number, inadimplencia: number }>);

        const chartDataFormatted = intervalos.map((intervalo) => {
          const pago = Math.ceil((periodoMap[intervalo]?.pago || 0) * 100) / 100;
          const inadimplencia = Math.ceil((periodoMap[intervalo]?.inadimplencia || 0) * 100) / 100;;
          const percent = pago > 0 ? ((inadimplencia / pago) * 100).toFixed(2) : '0.00';

          return {
            intervalo,
            pago,
            inadimplencia,
            percent: parseFloat(percent),
          };
        });

        setChartData(chartDataFormatted);
      }
    };

    fetchData();
  }, [contas]);

  const chartConfig = {
    pago: {
      label: "Valor Pago",
      color: "hsl(var(--chart-2))",
    },
    inadimplencia: {
      label: "Inadimplência",
      color: "hsl(var(--chart-4))",
    },
    percent: {
      label: "(%) Inadimplência",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="mb-32 grid gap-2 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:text-left">
    <Card className="w-full h-full">
      <CardHeader className="relative flex justify-between items-left">
        <CardTitle><div className="flex gap-2 leading-none">Inadimplência Acumulada<TrendingUp className="h-4 w-4" /></div></CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>

      <CardContent>
        <ChartContainer className="w-full h-[500px]" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            width={300}
            height={200}
            barCategoryGap="5px"
          >
            <XAxis type="number" tickCount={15} />
            <YAxis
              dataKey="intervalo"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={true}
              width={100}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <ChartLegend verticalAlign="top" content={<ChartLegendContent />} fontSize={20} />
            <CartesianGrid horizontal={false} />
            <Bar dataKey="percent" fill={chartConfig.percent.color} radius={0} barSize={15}>
              <LabelList dataKey="percent" position="right" offset={8} fill={chartConfig.percent.color} fontSize={11} formatter={percentLabel} />
            </Bar>
            <Bar dataKey="pago" fill={chartConfig.pago.color} radius={0} barSize={15}>
              <LabelList dataKey="pago" position="right" offset={8} className="fill-foreground" fontSize={11} formatter={valueLabel} />
            </Bar>
            <Bar dataKey="inadimplencia" fill={chartConfig.inadimplencia.color} radius={0} barSize={15}>
              <LabelList dataKey="inadimplencia" position="right" offset={8} className="fill-foreground" fontSize={11} formatter={valueLabel} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </div>
  );
};

export default InadimplenciaPeriodo;