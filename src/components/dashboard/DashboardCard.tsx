import { getSizeClass } from "@/lib/dashboard/registry";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  id: string;  // Required
  title?: string;  // Optional
  icon?: ReactNode;  // Optional
  size?: "small" | "medium" | "large";  // Optional
  isChart?: boolean;  // Optional
  children: ReactNode;  // Required
  className?: string;  // Optional
}

export function DashboardCard({
  id,
  title = "",  // Default empty string
  icon,
  className,
  size = "medium",  // Default medium size
  isChart = false,
  children
}: DashboardCardProps) {
  return (
    <div
      key={id}
      className={cn(
        "border rounded-md p-4 overflow-hidden relative h-full flex-grow self-stretch min-h-0",
        getSizeClass(size),
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-800 text-xs font-medium flex items-center gap-1">
            {icon}
            {title}
          </div>
        </div>
      )}
      
      {children}

      {/* Add white gradient mask for charts to handle overflow */}
      {isChart && (
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      )}
    </div>
  );
} 