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
   MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
   DashboardComponent,
   componentRegistry,
   getSizeClass,
} from "@/lib/dashboard/registry";
import { DashboardCard } from "./DashboardCard";

import { ResearchData } from "@/lib/api/api-service";

interface DashboardProps {
   companyName: string;
   data?: ResearchData | null; // Research data from the API
   components?: DashboardComponent[]; // Dynamic components created by the agent
   isLoading?: boolean;
}

export function Dashboard({
   companyName,
   isLoading,
   data,
   components = [],
}: DashboardProps) {
   const [dashboardComponents, setDashboardComponents] = useState<
      DashboardComponent[]
   >([]);
   const [dynamicComponents, setDynamicComponents] = useState<
      DashboardComponent[]
   >([]);
   const [artificialLoading, setArtificialLoading] = useState(true);

   // Set dynamic components when they change
   useEffect(() => {
      setDynamicComponents(components);
   }, [components]);

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
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const initializeDashboard = (_researchData: ResearchData) => {
      // In a real implementation, this would parse the data from the API
      // and create dashboard components based on the research data

      // For now, we'll just use the sample data
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

      // Default color scale for all charts
      const defaultColors = [
         "#4F46E5", // Indigo
         "#3B82F6", // Blue
         "#10B981", // Emerald
         "#8B5CF6", // Violet
         "#EC4899", // Pink
         "#F59E0B", // Amber
         "#EF4444", // Red
         "#6366F1", // Indigo-500
      ];

      // Chart configuration using the default color scale
      const chartConfig = {
         visits: {
            label: "Monthly Web Visits",
            color: defaultColors[0],
         },
         growth: {
            label: "Annual Growth",
            color: defaultColors[1],
         },
         market: {
            label: "Market Share",
            color: defaultColors[2],
         },
         social: {
            label: "Social Media Engagement",
            color: defaultColors[3],
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

   const loadingMessage = {
      title: "Preparing startup ANALysis",
      message: "Searching for the cheapest kebab in Prague, Žižkov",
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

   
   const isError = !isLoading && !data;
   const isSuccess = !isLoading && !!data && dynamicComponents.length > 0;

   // Add this useEffect to handle the timeout
   useEffect(() => {
      // Start with artificial loading
      setArtificialLoading(true);
      
      // Set a timeout to end the artificial loading after 4 seconds
      const timer = setTimeout(() => {
         setArtificialLoading(false);
      }, 4000);
      
      // Clean up the timeout if the component unmounts
      return () => clearTimeout(timer);
   }, []); // Empty dependency array means this runs once when component mounts

   const isRealLoading = artificialLoading || isLoading;

   return (
      <div className="max-w-4xl mx-auto text-black">
         {/* Company header */}
         <div className="mb-8">
            <div>
               <div className="text-xs text-gray-500">Generated report for</div>
               <h1 className="text-2xl font-bold text-black">{companyName}</h1>
            </div>
         </div>

         {/* {isError && (
            <div className="flex flex-col items-center justify-center h-full">
               <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full shadow-sm">
                  <div className="flex items-start space-x-3">
                     <div className="flex-shrink-0">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="h-6 w-6 text-red-500"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                           strokeWidth={2}
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                           />
                        </svg>
                     </div>
                     <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-800">
                           Unable to load data
                        </h3>
                        <div className="mt-1 text-xs text-red-700">
                           We encountered a problem while trying to retrieve the
                           latest information. This could be due to a connection
                           issue or temporary service interruption.
                        </div>
                        <div className="mt-3 flex space-x-2">
                           <button
                              className="inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              onClick={() => window.location.reload()}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="h-3.5 w-3.5 mr-1"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                                 strokeWidth={2}
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                 />
                              </svg>
                              Retry
                           </button>
                           <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-600 bg-transparent hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                              Contact support
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )} */}

         {!isRealLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardComponents.map((component) => renderComponent(component))}
        </div>
      )}

         {isRealLoading && (
            <DashboardCard
               id="loading"
               size="large"
               isChart={false}
               className="col-span-4 grid items-center"
            >
               <div className="flex flex-col items-center gap-1">
                  <AnimatedStandaLogo />
                  <p className="text-md font-semibold">
                     {loadingMessage.title}
                  </p>
                  <div className="text-xs font-medium opacity-40">
                     {loadingMessage.message}
                  </div>
               </div>
            </DashboardCard>
         )}

         {isSuccess && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               {dynamicComponents.map((component) =>
                  renderComponent(component)
               )}
            </div>
         )}
      </div>
   );
}

const AnimatedStandaLogo = () => {
   const [currentImage, setCurrentImage] = useState<1 | 2>(1);

   useEffect(() => {
      // Set up a timer to swap images every 800ms
      const timer = setInterval(() => {
         setCurrentImage((prev) => (prev === 1 ? 2 : 1));
      }, 200);

      // Clean up the timer when component unmounts
      return () => clearInterval(timer);
   }, []);

   return (
      <div className="flex items-center justify-center relative w-[50px] h-[50px] ">
         <img
            src={`/standa-b${currentImage === 1 ? "" : "-2"}.svg`}
            alt="Loading"
         />
      </div>
   );
};
