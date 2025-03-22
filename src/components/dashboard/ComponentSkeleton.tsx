import { ComponentType } from "@/lib/dashboard/registry";
import { Skeleton } from "@/components/ui/skeleton";

interface ComponentSkeletonProps {
  type: ComponentType;
}

export function ComponentSkeleton({ type }: ComponentSkeletonProps) {
  switch (type) {
    case "barChart":
    case "lineChart":
    case "pieChart":
      return <Skeleton className="h-[200px] w-full" />;
    default:
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
  }
}
