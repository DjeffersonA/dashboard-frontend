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

const PrevistaXRealizadaPeriodo: React.FC<GProps> = ({ contas }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (contas.length > 0) {
        const intervalos = ['Dia 05', 'Dia 10', 'Dia 15', 'Dia 20', 'Dia 25', 'Dia 30/31'];
        const periodos = await getPeriodos(getYear(new Date()), getMonth(new Date()) + 1);
        const periodoMap = contas.reduce((acc, item) => {
          const intervalo = getIntervalo(new Date(item.data_vencimento).getDate(), periodos);
          if (!intervalo) return acc;

          if (!acc[intervalo]) {
            acc[intervalo] = { previsto: 0, pago: 0 };
          }

          acc[intervalo].previsto += parseFloat(item.valor_mensalidade || '0');

          if (item.data_pagamento !== null) {
            acc[intervalo].pago += parseFloat(item.valor_pago || '0');
          }

          return acc;
        }, {} as Record<string, { previsto: number, pago: number }>);

        const chartDataFormatted = intervalos.map((intervalo) => {
          const previsto = Math.ceil((periodoMap[intervalo]?.previsto || 0) * 100) / 100;
          const pago = Math.ceil((periodoMap[intervalo]?.pago || 0) * 100) / 100;
          const percent = previsto > 0 ? ((pago / previsto) * 100).toFixed(2) : '0.00';

          return {
            intervalo,
            previsto,
            pago,
            percent: parseFloat(percent),
          };
        });

        setChartData(chartDataFormatted);
      }
    };

    fetchData();
  }, [contas]);

  const chartConfig = {
    previsto: {
      label: "Receita Prevista",
      color: "hsl(var(--chart-1))",
    },
    pago: {
      label: "Valor Pago",
      color: "hsl(var(--chart-2))",
    },
    percent: {
      label: "(%) Realização Total",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="mb-32 grid gap-2 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:text-left">
    <Card className="w-full h-full">
      <CardHeader className="relative flex justify-between items-left">
        <CardTitle><div className="flex gap-2 leading-none">Prevista x Realizada - Acumulada<TrendingUp className="h-4 w-4" /></div></CardTitle>
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
            <Bar dataKey="previsto" fill={chartConfig.previsto.color} radius={0} barSize={15}>
              <LabelList dataKey="previsto" position="right" offset={8} className="fill-foreground" fontSize={11} formatter={valueLabel} />
            </Bar>
            <Bar dataKey="pago" fill={chartConfig.pago.color} radius={0} barSize={15}>
              <LabelList dataKey="pago" position="right" offset={8} className="fill-foreground" fontSize={11} formatter={valueLabel} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </div>
  );
};

export default PrevistaXRealizadaPeriodo;