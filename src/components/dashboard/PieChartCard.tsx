import { DashboardComponentProps } from "@/lib/dashboard/registry";
import { ChartConfig } from "@/components/ui/chart";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
         <div className="h-full">
            <ChartContainer config={chartData.config} className="h-full w-full">
               <PieChart accessibilityLayer>
                  <Pie
                     data={chartData.chartData}
                     dataKey={chartData.dataKey}
                     nameKey={chartData.nameKey}
                     cx="50%"
                     cy="50%"
                     outerRadius={60}
                     label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                     }
                     labelLine={false}
                     isAnimationActive={true}
                  >
                     {/* Use default colors for each segment */}
                     {chartData.chartData.map((entry, index) => {
                        // Define a default color palette
                        const colors = [
                           "#4F46E5", // Indigo
                           "#3B82F6", // Blue
                           "#10B981", // Emerald
                           "#8B5CF6", // Violet
                           "#EC4899", // Pink
                           "#F59E0B", // Amber
                           "#EF4444", // Red
                           "#6366F1", // Indigo-500
                        ];
                        return (
                           <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length]}
                           />
                        );
                     })}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
               </PieChart>
            </ChartContainer>
         </div>
         {chartData.analysis && (
            <div className="h-full overflow-auto">
               <h3 className="text-xs font-medium mb-2">Competitor Analysis</h3>
               <div className="space-y-2">
                  {chartData.analysis.map((competitor, index) => (
                     <div key={index} className="text-xs">
                        <p className="font-medium">{competitor.name}</p>
                        <p className="text-xs text-muted-foreground">
                           <span className="font-medium">Strengths:</span>{" "}
                           {competitor.strengths}
                        </p>
                        <p className="text-xs text-muted-foreground">
                           <span className="font-medium">Weaknesses:</span>{" "}
                           {competitor.weaknesses}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
}
