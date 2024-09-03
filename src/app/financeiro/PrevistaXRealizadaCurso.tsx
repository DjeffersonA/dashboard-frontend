"use client"
import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { LabelList, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartLegend, ChartLegendContent, ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const capWords = (text: string): string => {
  const smallWords = new Set(['de', 'do', 'das', 'da', 'a', 'o', 'e', 'em', 'para', 'com', 'por']);
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word, index, array) => {
      if (index === 0 || index === array.length - 1 || !smallWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
};

const percentLabel = (props: any) => {
  return `${props}%`;
};

const valueLabel = (props: any) => {
  return `R$${props.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

interface Conta {
  curso: string;
  data_vencimento: string;
  valor_mensalidade: string;
  data_pagamento: string;
  valor_pago: string;
}

interface GProps {
  contas: Conta[];
}

const PrevistaXRealizadaCurso: React.FC<GProps> = ({ contas }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState<string>("previsto");

  useEffect(() => {
    if (contas.length > 0) {
      const cursosMap = contas.reduce((acc, item) => {
        const cursoFormatado = capWords(item.curso);
        
        if (!acc[cursoFormatado]) {
          acc[cursoFormatado] = { previsto: 0, pago: 0 };
        }
        
        acc[cursoFormatado].previsto += parseFloat(item.valor_mensalidade || '0');
        
        if (item.data_pagamento !== null) {
          acc[cursoFormatado].pago += parseFloat(item.valor_pago || '0');
        }
        
        return acc;
      }, {} as Record<string, { previsto: number, pago: number }>);

      const listCursos = Array.from(new Set(contas.map((item) => capWords(item.curso))));

      const chartDataFormatted = listCursos.map((curso) => {
        const previsto = Math.ceil((cursosMap[curso]?.previsto || 0) * 100) / 100;
        const pago = Math.ceil((cursosMap[curso]?.pago || 0) * 100) / 100;
        const percent = previsto > 0 ? ((pago / previsto) * 100).toFixed(2) : '0.00';
        
        return {
          curso,
          previsto,
          pago,
          percent: parseFloat(percent),
        };
      });

      const sortedChartData = chartDataFormatted.sort((a, b) => {
        if (sortOption === "alfabetica") {
          return a.curso.localeCompare(b.curso);
        } else if (sortOption === "previsto") {
          return b.previsto - a.previsto;
        } else if (sortOption === "pago") {
          return b.pago - a.pago;
        }
        return 0;
      });

      setChartData(sortedChartData);
    }
  }, [contas, sortOption]);

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
        <CardTitle><div className="flex gap-2 leading-none">Prevista x Realizada - Curso<TrendingUp className="h-4 w-4" /></div></CardTitle>
        {/* <CardDescription></CardDescription> */}
        <div className="absolute right-7 top-3 flex items-center space-x-2">
          <span className="text-sm">Ordenar por:</span>
          <Select onValueChange={setSortOption} defaultValue="previsto">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alfabetica">Ordem Alfabética</SelectItem>
              <SelectItem value="previsto">Receita Prevista</SelectItem>
              <SelectItem value="pago">Valor Pago</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            <XAxis type="number" tickCount={10} />
            <YAxis
              dataKey="curso"
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

export default PrevistaXRealizadaCurso;