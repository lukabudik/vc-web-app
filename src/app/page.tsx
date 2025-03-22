"use client";

import { useState } from "react";
import {
  Search,
  Send,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Users,
  Code,
  DollarSign,
  Globe,
  Building,
  Share2,
  MessageSquare,
  Newspaper,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardComponent } from "@/components/dashboard/DashboardComponent";
import { DashboardComponent as DashboardComponentType } from "@/lib/dashboard/registry";
import {
  AgentMessage,
  AgentState,
  askAgent,
  searchStartupInfo,
} from "@/lib/agent/agent-service";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<AgentMessage[]>([
    {
      role: "agent",
      content:
        "Hello! I'm your VC analyst assistant. How can I help you research this startup?",
    },
  ]);
  const [dashboardComponents, setDashboardComponents] = useState<
    DashboardComponentType[]
  >([]);

  // Mock data for charts
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
      color: "hsl(var(--chart-1))",
    },
    growth: {
      label: "Annual Growth",
      color: "hsl(var(--chart-2))",
    },
    market: {
      label: "Market Share",
      color: "hsl(var(--chart-3))",
    },
    social: {
      label: "Social Media Engagement",
      color: "hsl(var(--chart-4))",
    },
  };

  // Initialize the dashboard with sample components
  const initializeDashboard = () => {
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
          { title: "Backend", items: ["Node.js", "Express", "PostgreSQL"] },
          { title: "Infrastructure", items: ["AWS", "Docker", "Kubernetes"] },
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
              quote:
                "One of the most promising startups in the enterprise SaaS space",
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
    ]);
  };

  // Handle search for a company
  const handleSearch = async () => {
    if (!companyName.trim()) return;

    setIsLoading(true);

    // Initialize the dashboard with sample data
    initializeDashboard();

    // In a real implementation, this would call the agent to search for information
    try {
      await searchStartupInfo(companyName, (newComponent) => {
        setDashboardComponents((prev) => [...prev, newComponent]);
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a message to the agent
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    // Add user message to chat history
    const userMessage: AgentMessage = { role: "user", content: chatMessage };
    setChatHistory((prev) => [...prev, userMessage]);

    // Clear input
    setChatMessage("");

    // Get agent state
    const agentState: AgentState = {
      companyName,
      messages: [...chatHistory, userMessage],
      isSearching: false,
    };

    // Ask the agent
    try {
      const response = await askAgent(
        chatMessage,
        agentState,
        (newComponent) => {
          setDashboardComponents((prev) => [...prev, newComponent]);
        }
      );

      // Add agent response to chat history
      setChatHistory((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error asking agent:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "agent",
          content:
            "Sorry, I encountered an error while processing your request.",
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">VC Startup Analyzer</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dashboard Section */}
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Search for a Startup</CardTitle>
                <CardDescription>
                  Enter the name of a startup to analyze its potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter company name..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? "Searching..." : "Search"}
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardComponents.map((component) => (
                <DashboardComponent
                  key={component.id}
                  component={component}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-120px)] flex flex-col sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat with the Agent
                </CardTitle>
                <CardDescription>
                  Ask questions about the startup to get more detailed
                  information
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto border rounded-md p-4 mb-4">
                <div className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`${
                        message.role === "agent"
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground ml-auto"
                      } p-3 rounded-lg max-w-[80%] ${
                        message.role === "user" ? "ml-auto" : ""
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {message.role === "agent" ? "Agent" : "You"}
                      </p>
                      <p>{message.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Type your question..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
