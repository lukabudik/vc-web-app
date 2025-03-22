"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AgentMessage, searchStartupInfo } from "@/lib/agent/agent-service";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Chat } from "@/components/chat/Chat";

export default function AnalysisPage() {
   const searchParams = useSearchParams();
   const companyParam = searchParams.get("company");

   const [companyName, setCompanyName] = useState(companyParam || "Nvidia");
   const [isLoading, setIsLoading] = useState(false);
   const [dashboardData, setDashboardData] = useState<any>(null);
   const initialChatHistory: AgentMessage[] = [
      {
         role: "agent",
         content: [
            {
               text: `I am exploring the company ${
                  companyParam || "Nvidia"
               }. Lets start with the fundamentals.`,
            },
         ],
      },
      {
         role: "agent",
         heading: "Researching key people in company",
         content: [
            { text: "Searching for CEO" },
            { text: "Nguya Trung", highlighted: true },
         ],
      },
      {
         role: "agent",
         heading: "Researching company overview",
         content: [
            { text: "Found information on:" },
            {
               text: "bloomberg.com",
               highlighted: true,
               url: "https://bloomberg.com",
            },
            { text: "Cheap kebab in Prague", highlighted: true },
         ],
      },
      {
         role: "agent",
         content: [
            {
               text: "Thinking about e-commerce, telco, and virtual assistant chatbots. Stats suggest chatbots could save $11 billion and 2.5 billion hours.",
            },
         ],
      },
      {
         role: "agent",
         content: [{ text: "Searching..." }],
         status: {
            text: "Searching... give me 2 more minutes",
            icon: "loading",
         },
      },
   ];

   // Initialize data when the component mounts
   useEffect(() => {
      if (companyName) {
         setIsLoading(true);

         // In a real implementation, this would call the agent to search for information
         // and return the dashboard data
         searchStartupInfo(companyName, () => {}).finally(() => {
            setIsLoading(false);

            // In a real implementation, this would be the data returned from the API
            // For now, we'll pass null to use the sample data in the Dashboard component
            setDashboardData(null);
         });
      }
   }, [companyName]);

   return (
      <div className="h-screen bg-black flex flex-col overflow-hidden">
         {/* Header */}
         <header className="flex items-center justify-between p-4 py-2 border-white/10 sticky top-0 z-10 text-sm">
            <div className="flex items-center gap-2 text-white">
               <Link href="/" className="flex items-center gap-2">
                  <Image
                     src="/standa.svg"
                     alt="Standa Logo"
                     width={20}
                     height={20}
                  />
                  <span className="font-semibold">Standa</span>
               </Link>
               <ChevronRight className="h-4 w-4 text-white/50" />
               <span className="text-white">{companyName} analysis</span>
            </div>
            <Link href="/" className="cursor-pointer">
               <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white bg-transparent hover:bg-transparent"
               >
                  <X className="h-5 w-5 mr-1" /> Close
               </Button>
            </Link>
         </header>

         {/* Main content */}
         <div
            id="main-top-mask"
            className="absolute top-10 w-[calc(33%-10px)] left-0 h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none hidden opacity-100"
         ></div>
         <div className="flex flex-1 h-[calc(100vh-64px)] pr-4">
            {/* Left chat section */}
            <div className="w-1/3">
               <Chat
                  companyName={companyName}
                  initialChatHistory={initialChatHistory}
               />
            </div>

            {/* Right dashboard section */}
            <div className="w-2/3 bg-white p-6 pr-10 overflow-y-auto h-full">
               <Dashboard companyName={companyName} data={dashboardData} />
            </div>
         </div>
      </div>
   );
}
