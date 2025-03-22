import { DashboardComponentProps } from "@/lib/dashboard/registry";
import { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface LineChartData {
  chartData: Record<string, unknown>[];
  dataKey: string;
  xAxisKey: string;
  config: ChartConfig;
  configKey: string;
}

export function LineChartCard({ data }: DashboardComponentProps) {
  const chartData = data as LineChartData;

  return (
    <ChartContainer config={chartData.config} className="min-h-[200px]">
      <LineChart data={chartData.chartData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={chartData.xAxisKey} tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey={chartData.dataKey}
          stroke={`var(--color-${chartData.configKey})`}
          strokeWidth={2}
          dot={{ fill: `var(--color-${chartData.configKey})` }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
