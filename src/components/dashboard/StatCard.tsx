import { DashboardComponentProps } from "@/lib/dashboard/registry";

interface StatData {
   value: string;
   description?: string;
   change?: string;
   period?: string;
}

export function StatCard({ data }: DashboardComponentProps) {
   const statData = data as StatData;

   return (
      <div className="text-center h-full flex flex-col justify-center">
         <div className="flex items-baseline justify-center">
            <p className="text-2xl font-bold">{statData.value}</p>
            {statData.change && (
               <p className="ml-2 text-green-500 text-xs font-medium">
                  {statData.change.startsWith("-") ? "↓" : "↑"}{" "}
                  {statData.change.replace(/^[+-]/, "")}
               </p>
            )}
         </div>
         {(statData.description || statData.period) && (
            <p className="text-xs text-muted-foreground mt-1">
               {statData.description || statData.period}
            </p>
         )}
      </div>
   );
}
