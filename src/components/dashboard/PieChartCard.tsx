import { DashboardComponentProps } from "@/lib/dashboard/registry";
import { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

interface Competitor {
  name: string;
  strengths: string;
  weaknesses: string;
}

interface PieChartData {
  chartData: Record<string, unknown>[];
  dataKey: string;
  nameKey: string;
  config: ChartConfig;
  configKey: string;
  analysis?: Competitor[];
}

export function PieChartCard({ data }: DashboardComponentProps) {
  const chartData = data as PieChartData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <ChartContainer config={chartData.config} className="min-h-[200px]">
          <PieChart accessibilityLayer>
            <Pie
              data={chartData.chartData}
              dataKey={chartData.dataKey}
              nameKey={chartData.nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={`var(--color-${chartData.configKey})`}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </div>
      {chartData.analysis && (
        <div>
          <h3 className="text-lg font-medium mb-4">Competitor Analysis</h3>
          <div className="space-y-4">
            {chartData.analysis.map((competitor, index) => (
              <div key={index}>
                <p className="font-medium">{competitor.name}</p>
                <p className="text-sm text-muted-foreground">
                  Strengths: {competitor.strengths}
                </p>
                <p className="text-sm text-muted-foreground">
                  Weaknesses: {competitor.weaknesses}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
