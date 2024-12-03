"use client"

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCourseId, getCourseName, isPaidTraffic } from "@/common/utils/utils";

export interface MetaAds {
  campaign_name: string;
  adset_name: string;
  spend: string;
  date_start: string;
  date_stop: string;
}

export interface MarketingProps {
  data: MetaAds[];
}

const aggregateData = (data: MetaAds[]) => {
  const groupedData: { courseID: string; totalSpend: number; trafficSpend: number; formMetaSpend: number }[] = [];

  data.forEach((item) => {
    const classifiedCode = getCourseName(getCourseId(item.campaign_name, item.adset_name));
    const spend = parseFloat(item.spend);
    const isTraffic = isPaidTraffic(item.campaign_name, item.adset_name);

    const existingGroup = groupedData.find((group) => group.courseID === classifiedCode);

    if (existingGroup) {
      if(isTraffic)
        existingGroup.trafficSpend += spend;
      else
        existingGroup.formMetaSpend += spend;

      existingGroup.totalSpend += spend;
    } else {
      groupedData.push({ courseID: classifiedCode, totalSpend: spend, trafficSpend: isTraffic ? spend : 0, formMetaSpend: isTraffic ? 0 : spend });
    }
  });

  return groupedData.sort((a, b) => b.totalSpend - a.totalSpend);
};

export const columns: ColumnDef<{ courseID: string; totalSpend: number; trafficSpend: number; formMetaSpend: number }>[] = [
  {
    accessorKey: "courseID",
    header: "Curso",
    cell: ({ row }) => <div>{row.getValue("courseID")}</div>,
  },
  {
    accessorKey: "formMetaSpend",
    header: () => <div className="text-right">Gasto Form Meta</div>,
    cell: ({ row }) => {
      const amount = row.getValue("formMetaSpend") as number;

      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);
      
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "trafficSpend",
    header: () => <div className="text-right">Gasto Tráfego</div>,
    cell: ({ row }) => {
      const amount = row.getValue("trafficSpend") as number;

      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalSpend",
    header: () => <div className="text-right">Gasto Total</div>,
    cell: ({ row }) => {
      const amount = row.getValue("totalSpend") as number;

      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

export function MarketingTable({ data }: MarketingProps) {
  const aggregatedData = React.useMemo(() => aggregateData(data), [data]);

  const table = useReactTable({
    data: aggregatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}