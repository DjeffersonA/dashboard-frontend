import React from 'react';
import { LabelList, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartLegend, ChartLegendContent, ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";

interface DataItem {
  Dia: number;
  "Pago": string;
  "Pendente": string;
}

interface ChartProps {
  data: DataItem[];
}

const valueLabel = (props: any) => {
  if (props == 0)
    return ``;
  return `R$${props.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const processData = (data: DataItem[]) => {
  const formatMoney = (valor: string | undefined): number => {
    if (!valor || valor.includes('-')) {
      return 0;
    }
    const valorLimpo = valor.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
    return parseFloat(valorLimpo) || 0;
  };

  return data.map(item => ({
    Dia: item.Dia,
    pago: formatMoney(item["Pago"]),
    pendente: formatMoney(item["Pendente"])
  }));
};

const StackedChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = processData(data);

  const chartConfig = {
    pago: {
      label: "Pago",
      color: "green",
    },
    pendente: {
      label: "Pendente",
      color: "red",
    },
  } satisfies ChartConfig;

  return (
    <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:text-left">
    <Card className="w-full h-full">
      <CardHeader className="relative flex justify-between items-left">
        <CardTitle>Pago x Pendente (R$)</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full h-[235px]" config={chartConfig}>
          <BarChart accessibilityLayer
            data={chartData}
            layout="horizontal"
            width={300}
            height={200}
            barCategoryGap="5px"
          >
            <XAxis dataKey="Dia" type="category" tickLine={false}
              tickMargin={10}
              axisLine={false} />
            <YAxis type="number" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <ChartLegend verticalAlign="top" content={<ChartLegendContent />} fontSize={20} />
            <CartesianGrid vertical={false} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="pago"
              stackId="a"
              fill="var(--color-pago)"
              radius={[0, 0, 0, 0]}
              barSize={15}
            ><LabelList dataKey="pago" position="top" offset={5} className="fill-foreground" fontSize={9} formatter={valueLabel} /></Bar>
            <Bar
              dataKey="pendente"
              stackId="a"
              fill="var(--color-pendente)"
              radius={[0, 0, 0, 0]}
            ><LabelList dataKey="pendente" position="top" offset={5} className="fill-foreground" fontSize={9} formatter={valueLabel} /></Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </div>
  );
};

export default StackedChart;