import React from 'react';
import { LabelList, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartLegend, ChartLegendContent, ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";

interface DataItem {
  Dia: number;
  "Pagantes (%)": string;
  "A Pagar (%)": string;
}

interface ChartProps {
  data: DataItem[];
}

const percentLabel = (props: any) => {
  if (props == 0)
    return ``;
  return `${props}%`;
};

const processData = (data: DataItem[]) => {
  return data.map(item => ({
    Dia: item.Dia,
    pagantes: parseFloat(item["Pagantes (%)"].replace(",", ".").replace("%", "") || "0").toFixed(1),
    aPagar: parseFloat(item["A Pagar (%)"].replace(",", ".").replace("%", "") || "0").toFixed(1)
  }));
};

const FullStackedChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = processData(data);

  const chartConfig = {
    pagantes: {
      label: "Pagantes (%)",
      color: "green",
    },
    aPagar: {
      label: "A Pagar (%)",
      color: "red",
    },
  } satisfies ChartConfig;

  return (
    <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:text-left">
    <Card className="w-full h-full">
      <CardHeader className="relative flex justify-between items-left">
        <CardTitle>Pago x Pendente (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full h-[180px]" config={chartConfig}>
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
              dataKey="pagantes"
              stackId="a"
              fill="var(--color-pagantes)"
              radius={[0, 0, 0, 0]}
              barSize={15}
            ><LabelList dataKey="pagantes" position="center" offset={5} className="fill-white" fontSize={9} formatter={percentLabel} angle={-90}/></Bar>
            <Bar
              dataKey="aPagar"
              stackId="a"
              fill="var(--color-aPagar)"
              radius={[0, 0, 0, 0]}
            ><LabelList dataKey="aPagar" position="center" offset={5} className="fill-white" fontSize={9} formatter={percentLabel} angle={-90} /></Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </div>
  );
};

export default FullStackedChart;