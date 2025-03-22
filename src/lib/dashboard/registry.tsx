import { ReactNode } from "react";

// Define the base component props interface
export interface DashboardComponentProps {
   data: any;
}

// Define the dashboard component metadata interface
export interface DashboardComponent {
   id: string;
   title: string;
   type: ComponentType;
   icon: ReactNode;
   size: "small" | "medium" | "large";
   data: any;
}

// Define component types
export type ComponentType =
   | "people"
   | "text"
   | "list"
   | "stat"
   | "barChart"
   | "lineChart"
   | "pieChart";

// Import all dashboard components
import { PeopleCard } from "@/components/dashboard/PeopleCard";
import { TextCard } from "@/components/dashboard/TextCard";
import { ListCard } from "@/components/dashboard/ListCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { PieChartCard } from "@/components/dashboard/PieChartCard";

// Register all components
export const componentRegistry: Record<
   ComponentType,
   React.ComponentType<DashboardComponentProps>
> = {
   people: PeopleCard,
   text: TextCard,
   list: ListCard,
   stat: StatCard,
   barChart: BarChartCard,
   lineChart: LineChartCard,
   pieChart: PieChartCard,
};

// Helper function to get the CSS class based on component size
export const getSizeClass = (size: DashboardComponent["size"]): string => {
   switch (size) {
      case "large":
         return "col-span-2 lg:col-span-3 h-64";
      case "medium":
         return "col-span-2 h-48";
      default:
         return "col-span-1 h-40";
   }
};
