"use client";

import { useState, useEffect } from "react";
import {
   BarChart3,
   LineChart as LineChartIcon,
   PieChart as PieChartIcon,
   Users,
   Code,
   DollarSign,
   Globe,
   Building,
   Share2,
   Newspaper,
   Filter,
   MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
   DashboardComponent,
   componentRegistry,
   getSizeClass,
} from "@/lib/dashboard/registry";

interface DashboardProps {
   companyName: string;
   data?: any; // This would be the JSON data from the API
}

export function Dashboard({ companyName, data }: DashboardProps) {
   const [dashboardComponents, setDashboardComponents] = useState<
      DashboardComponent[]
   >([]);
   const [activeTimeframe, setActiveTimeframe] = useState("12 months");

   // Initialize the dashboard with data
   useEffect(() => {
      if (data) {
         initializeDashboard(data);
      } else {
         // Use sample data if no data is provided
         initializeDashboardWithSampleData();
      }
   }, [data, companyName]);

   // Initialize the dashboard with data from props
   const initializeDashboard = (dashboardData: any) => {
      // This function would parse the data from the API and create dashboard components
      // For now, we'll use the sample data
      initializeDashboardWithSampleData();
   };

   // Sample data for charts and stats
   const initializeDashboardWithSampleData = () => {
      const webVisitsData = [
         { month: "Jan", visits: 4000 },
         { month: "Feb", visits: 3000 },
         { month: "Mar", visits: 5000 },
         { month: "Apr", visits: 7000 },
         { month: "May", visits: 6000 },
         { month: "Jun", visits: 8000 },
      ];

      const marketShareData = [
         { name: "Company", value: 30 },
         { name: "Competitor 1", value: 25 },
         { name: "Competitor 2", value: 20 },
         { name: "Competitor 3", value: 15 },
         { name: "Others", value: 10 },
      ];

      const growthData = [
         { year: "2020", growth: 20 },
         { year: "2021", growth: 35 },
         { year: "2022", growth: 50 },
         { year: "2023", growth: 65 },
         { year: "2024", growth: 80 },
         { year: "2025", growth: 95, predicted: true },
      ];

      const socialMediaData = [
         { platform: "Twitter", engagement: 75 },
         { platform: "LinkedIn", engagement: 90 },
         { platform: "Facebook", engagement: 60 },
         { platform: "Instagram", engagement: 45 },
      ];

      const chartConfig = {
         visits: {
            label: "Monthly Web Visits",
            color: "#4F46E5", // Indigo
         },
         growth: {
            label: "Annual Growth",
            color: "#10B981", // Emerald
         },
         market: {
            label: "Market Share",
            color: "#3B82F6", // Blue
         },
         social: {
            label: "Social Media Engagement",
            color: "#8B5CF6", // Violet
         },
      };

      // Sample KPI data
      const kpiData = {
         revenue: {
            value: "$48,880",
            change: null,
            period: "Last 12 months",
         },
         paidMembers: {
            value: "2,671",
            change: "+6.6%",
            period: null,
         },
         emailOpenRate: {
            value: "82%",
            change: "+0.1%",
            period: null,
         },
         totalMembers: {
            value: "1,230",
            change: "+9.2%",
            period: null,
         },
      };

      setDashboardComponents([
         {
            id: "key-people",
            title: "Key People",
            type: "people",
            icon: <Users className="h-4 w-4" />,
            size: "small",
            data: [
               { name: "Jane Doe", role: "CEO & Founder", avatar: "JD" },
               { name: "John Smith", role: "CTO", avatar: "JS" },
               { name: "Alice Stevens", role: "CFO", avatar: "AS" },
            ],
         },
         {
            id: "business-model",
            title: "Business Model",
            type: "text",
            icon: <DollarSign className="h-4 w-4" />,
            size: "small",
            data: {
               text: "SaaS subscription model with tiered pricing:",
               items: [
                  "Basic: $10/month per user",
                  "Professional: $25/month per user",
                  "Enterprise: Custom pricing",
               ],
               footer:
                  "Additional revenue from API access and professional services.",
            },
         },
         {
            id: "tech-stack",
            title: "Tech Stack",
            type: "list",
            icon: <Code className="h-4 w-4" />,
            size: "small",
            data: [
               { title: "Frontend", items: ["React", "Next.js", "TypeScript"] },
               {
                  title: "Backend",
                  items: ["Node.js", "Express", "PostgreSQL"],
               },
               {
                  title: "Infrastructure",
                  items: ["AWS", "Docker", "Kubernetes"],
               },
            ],
         },
         {
            id: "tam",
            title: "Total Addressable Market (TAM)",
            type: "stat",
            icon: <Globe className="h-4 w-4" />,
            size: "small",
            data: {
               value: "$4.5B",
               description:
                  "Global market for enterprise SaaS solutions in this category",
            },
         },
         {
            id: "sam",
            title: "Serviceable Addressable Market (SAM)",
            type: "stat",
            icon: <Globe className="h-4 w-4" />,
            size: "small",
            data: {
               value: "$1.2B",
               description:
                  "Market that can be served with current business model and technology",
            },
         },
         {
            id: "growth",
            title: "Company Growth + Market Prediction",
            type: "lineChart",
            icon: <LineChartIcon className="h-4 w-4" />,
            size: "large",
            data: {
               chartData: growthData,
               dataKey: "growth",
               xAxisKey: "year",
               config: chartConfig,
               configKey: "growth",
            },
         },
         {
            id: "web-visits",
            title: "Monthly Web Visits",
            type: "barChart",
            icon: <BarChart3 className="h-4 w-4" />,
            size: "large",
            data: {
               chartData: webVisitsData,
               dataKey: "visits",
               xAxisKey: "month",
               config: chartConfig,
               configKey: "visits",
            },
         },
         {
            id: "clients",
            title: "Clients",
            type: "text",
            icon: <Building className="h-4 w-4" />,
            size: "small",
            data: {
               sections: [
                  {
                     title: "Enterprise Clients:",
                     items: [
                        "Acme Corporation",
                        "Globex Industries",
                        "Initech Solutions",
                     ],
                  },
                  {
                     title: "SMB Clients:",
                     description:
                        "Over 500 small and medium businesses across 20 countries",
                  },
               ],
            },
         },
         {
            id: "social-media",
            title: "Social Media Engagement",
            type: "barChart",
            icon: <Share2 className="h-4 w-4" />,
            size: "medium",
            data: {
               chartData: socialMediaData,
               dataKey: "engagement",
               xAxisKey: "platform",
               layout: "vertical",
               config: chartConfig,
               configKey: "social",
            },
         },
         {
            id: "competitors",
            title: "Competitors + Metrics",
            type: "pieChart",
            icon: <PieChartIcon className="h-4 w-4" />,
            size: "large",
            data: {
               chartData: marketShareData,
               dataKey: "value",
               nameKey: "name",
               config: chartConfig,
               configKey: "market",
               analysis: [
                  {
                     name: "Competitor 1",
                     strengths: "User experience, enterprise integrations",
                     weaknesses: "Pricing, customer support",
                  },
                  {
                     name: "Competitor 2",
                     strengths: "Market presence, feature set",
                     weaknesses: "Outdated technology, slow innovation",
                  },
               ],
            },
         },
         {
            id: "mentioned-in",
            title: "Mentioned In",
            type: "text",
            icon: <Newspaper className="h-4 w-4" />,
            size: "medium",
            data: {
               mentions: [
                  {
                     source: "TechCrunch",
                     quote: "One of the most promising startups in the enterprise SaaS space",
                     date: "March 15, 2024",
                  },
                  {
                     source: "Forbes",
                     quote: "Named in '30 Under 30' list for Enterprise Technology",
                     date: "January 5, 2024",
                  },
                  {
                     source: "Gartner",
                     quote: "Positioned as a 'Visionary' in the Magic Quadrant",
                     date: "December 10, 2023",
                  },
               ],
            },
         },
         // KPI components
         {
            id: "kpi-revenue",
            title: "Revenue",
            type: "stat",
            icon: <DollarSign className="h-4 w-4" />,
            size: "small",
            data: {
               value: kpiData.revenue.value,
               description: kpiData.revenue.period,
            },
         },
         {
            id: "kpi-paid-members",
            title: "Paid Members",
            type: "stat",
            icon: <Users className="h-4 w-4" />,
            size: "small",
            data: {
               value: kpiData.paidMembers.value,
               change: kpiData.paidMembers.change,
            },
         },
         {
            id: "kpi-email-open-rate",
            title: "Email Open Rate",
            type: "stat",
            icon: <MessageSquare className="h-4 w-4" />,
            size: "small",
            data: {
               value: kpiData.emailOpenRate.value,
               change: kpiData.emailOpenRate.change,
            },
         },
         {
            id: "kpi-total-members",
            title: "Total Members",
            type: "stat",
            icon: <Users className="h-4 w-4" />,
            size: "small",
            data: {
               value: kpiData.totalMembers.value,
               change: kpiData.totalMembers.change,
            },
         },
      ]);
   };

   // Render a dashboard component
   const renderComponent = (component: DashboardComponent) => {
      const Component = componentRegistry[component.type];
      if (!Component) return null;

      // Determine if this is a chart component
      const isChart = ["barChart", "lineChart", "pieChart"].includes(
         component.type
      );

      return (
         <div
            key={component.id}
            className={cn(
               "border rounded-md p-4 overflow-hidden relative h-full flex-grow self-stretch min-h-0",
               getSizeClass(component.size)
            )}
         >
            <div className="flex items-center justify-between mb-2">
               <div className="text-gray-800 text-xs font-medium flex items-center gap-1">
                  {component.icon}
                  {component.title}
               </div>
            </div>
            <Component data={component.data} />

            {/* Add white gradient mask for charts to handle overflow */}
            {isChart && (
               <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
         </div>
      );
   };

   return (
      <div className="max-w-4xl mx-auto text-black">
         {/* Company header */}
         <div className="mb-8">
            <div>
               <div className="text-xs text-gray-500">Generated report for</div>
               <h1 className="text-2xl font-bold text-black">{companyName}</h1>
            </div>
         </div>

         {/* All components in a single grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardComponents.map((component) => renderComponent(component))}
         </div>
      </div>
   );
}
