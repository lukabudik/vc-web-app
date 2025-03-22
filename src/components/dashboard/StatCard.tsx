import { DashboardComponentProps } from "@/lib/dashboard/registry";

interface StatData {
  value: string;
  description: string;
}

export function StatCard({ data }: DashboardComponentProps) {
  const statData = data as StatData;

  return (
    <div className="text-center">
      <p className="text-4xl font-bold">{statData.value}</p>
      <p className="text-sm text-muted-foreground mt-2">
        {statData.description}
      </p>
    </div>
  );
}
