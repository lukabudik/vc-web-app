import { DashboardComponentProps } from "@/lib/dashboard/registry";
import { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface BarChartData {
  chartData: Record<string, unknown>[];
  dataKey: string;
  xAxisKey: string;
  layout?: "vertical" | "horizontal";
  config: ChartConfig;
  configKey: string;
}

export function BarChartCard({ data }: DashboardComponentProps) {
  const chartData = data as BarChartData;

  return (
    <ChartContainer config={chartData.config} className="min-h-[200px]">
      <BarChart
        data={chartData.chartData}
        layout={chartData.layout || "horizontal"}
        accessibilityLayer
      >
        <CartesianGrid
          vertical={chartData.layout !== "vertical"}
          horizontal={chartData.layout === "vertical"}
        />
        <XAxis
          dataKey={
            chartData.layout === "vertical" ? undefined : chartData.xAxisKey
          }
          type={chartData.layout === "vertical" ? "number" : "category"}
          tickLine={false}
          axisLine={false}
          domain={chartData.layout === "vertical" ? [0, 100] : undefined}
          tickFormatter={
            chartData.layout === "vertical" ? (value) => `${value}%` : undefined
          }
        />
        <YAxis
          dataKey={
            chartData.layout === "vertical" ? chartData.xAxisKey : undefined
          }
          type={chartData.layout === "vertical" ? "category" : "number"}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey={chartData.dataKey}
          fill={`var(--color-${chartData.configKey})`}
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}
