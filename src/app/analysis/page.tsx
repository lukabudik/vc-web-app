"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  AgentMessage,
  AgentState,
  askAgent,
  searchStartupInfo,
} from "@/lib/agent/agent-service";
import { ResearchData } from "@/lib/api/api-service";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DashboardComponent } from "@/lib/dashboard/registry";

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const companyParam = searchParams.get("company");

  const [companyName] = useState(companyParam || "Nvidia");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [dashboardData, setDashboardData] = useState<ResearchData | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  const [dashboardComponents, setDashboardComponents] = useState<
    DashboardComponent[]
  >([]);
  const [chatHistory, setChatHistory] = useState<AgentMessage[]>([
    {
      role: "agent",
      content: [
        {
          text: `I am exploring the company ${
            companyParam || "Nvidia"
          }. Let's start with the fundamentals.`,
        },
      ],
    },
  ]);

  // Handle sending a message to the agent
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    // Add user message to chat history
    const userMessage: AgentMessage = {
      role: "user",
      content: [{ text: chatMessage }],
    };
    setChatHistory((prev) => [...prev, userMessage]);

    // Clear input
    setChatMessage("");

    // Add loading message
    const loadingMessage: AgentMessage = {
      role: "agent",
      content: [{ text: "Thinking..." }],
      status: {
        text: "Processing your request",
        icon: "loading",
      },
    };
    setChatHistory((prev) => [...prev, loadingMessage]);

    // Get agent state
    const agentState: AgentState = {
      companyName,
      messages: [...chatHistory, userMessage],
      isSearching: false,
      researchData: dashboardData || undefined,
    };

    // Ask the agent
    try {
      // Create a function to handle new components
      const handleNewComponent = (component: DashboardComponent) => {
        setDashboardComponents((prev) => [...prev, component]);
      };

      // Remove the loading message
      setChatHistory((prev) => prev.filter((msg) => msg !== loadingMessage));

      // Ask the agent
      const response = await askAgent(
        chatMessage,
        agentState,
        handleNewComponent
      );

      // Add agent response to chat history
      setChatHistory((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error asking agent:", error);

      // Remove the loading message
      setChatHistory((prev) => prev.filter((msg) => msg !== loadingMessage));

      // Add error message
      setChatHistory((prev) => [
        ...prev,
        {
          role: "agent",
          content: [
            {
              text: "Sorry, I encountered an error while processing your request.",
            },
          ],
        },
      ]);
    }
  };

  // Handle scroll event to show/hide main top mask
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    const mainTopMask = document.getElementById("main-top-mask");

    if (chatContainer && mainTopMask) {
      const handleScroll = () => {
        if (chatContainer.scrollTop > 20) {
          // Show the mask when scrolled
          mainTopMask.classList.remove("hidden");
        } else {
          // Hide the mask when at the top
          mainTopMask.classList.add("hidden");
        }
      };

      // Initial check
      handleScroll();

      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  // Initialize data when the component mounts
  useEffect(() => {
    if (companyName) {
      setIsLoading(true);
      setIsResearching(true);

      // Clear previous components and data
      setDashboardComponents([]);
      setDashboardData(null);

      // Reset chat history
      setChatHistory([
        {
          role: "agent",
          content: [
            {
              text: `I'm starting research on ${companyName}...`,
            },
          ],
        },
      ]);

      // Add a researching message with progress updates
      const researchingMessage: AgentMessage = {
        role: "agent",
        content: [{ text: "Gathering company information..." }],
        status: {
          text: `Researching ${companyName}`,
          icon: "loading",
        },
      };
      setChatHistory((prev) => [...prev, researchingMessage]);

      // Create a function to handle new components
      const handleNewComponent = (component: DashboardComponent) => {
        // Add the component to the dashboard
        setDashboardComponents((prev) => {
          // Check if we already have a component with this ID
          const exists = prev.some((c) => c.id === component.id);
          if (exists) {
            // Replace the existing component
            return prev.map((c) => (c.id === component.id ? component : c));
          }
          // Add the new component
          return [...prev, component];
        });

        // Update the researching message to show progress
        setChatHistory((prev) =>
          prev.map((msg) => {
            if (msg === researchingMessage) {
              return {
                ...msg,
                content: [
                  { text: `Found information about ${component.title}...` },
                ],
                status: {
                  text: `Researching ${companyName}`,
                  icon: "loading",
                },
              };
            }
            return msg;
          })
        );
      };

      // Call the searchStartupInfo function
      searchStartupInfo(companyName, handleNewComponent)
        .then((data) => {
          // Set the research data
          setDashboardData(data);

          // Remove the researching message
          setChatHistory((prev) =>
            prev.filter((msg) => msg !== researchingMessage)
          );

          // Add a success message
          setChatHistory((prev) => [
            ...prev,
            {
              role: "agent",
              content: [
                {
                  text: `I've gathered key information about ${companyName}. What specific aspects would you like to know more about?`,
                },
              ],
            },
          ]);
        })
        .catch((error) => {
          console.error("Error searching for startup info:", error);

          // Remove the researching message
          setChatHistory((prev) =>
            prev.filter((msg) => msg !== researchingMessage)
          );

          // Add an error message
          setChatHistory((prev) => [
            ...prev,
            {
              role: "agent",
              content: [
                {
                  text: `I encountered an error while researching ${companyName}. Please try again later.`,
                },
              ],
            },
          ]);
        })
        .finally(() => {
          setIsLoading(false);
          setIsResearching(false);
        });
    }
  }, [companyName]);

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 py-2 border-white/10 sticky top-0 z-10 text-sm">
        <div className="flex items-center gap-2 text-white">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/standa.svg" alt="Standa Logo" width={20} height={20} />
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
        <div className="w-1/3 bg-black text-white flex flex-col border-r border-white/10 h-full relative">
          {/* Chat messages */}
          <div
            className="flex-1 overflow-y-auto p-4 h-full pb-20 mask-bottom relative"
            id="chat-container"
          >
            {/* No inner top mask as requested */}
            <div className="space-y-6 pb-20">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.role === "user"
                        ? "bg-white/10 rounded-2xl ml-auto"
                        : "bg-transparent"
                    } px-3 py-2 ${
                      message.role === "agent" ? "animate-fade-in" : ""
                    }`}
                  >
                    {/* Render heading if present */}
                    {message.heading && (
                      <h2 className="text-sm font-semibold mb-2 text-white">
                        {message.heading}
                      </h2>
                    )}

                    {/* Render content */}
                    {message.content && Array.isArray(message.content) ? (
                      <div className="space-y-1">
                        {message.content.map((item, i) => (
                          <div key={i} className="flex items-center">
                            {item.url ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs ${
                                  item.highlighted
                                    ? "text-blue-400 hover:underline"
                                    : "text-white/90"
                                }`}
                              >
                                {item.text}
                              </a>
                            ) : (
                              <span
                                className={`text-xs ${
                                  item.highlighted
                                    ? "text-blue-400"
                                    : "text-white/90"
                                }`}
                              >
                                {item.text}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : message.content &&
                      typeof message.content === "string" ? (
                      <pre className="text-xs text-white/90 font-sans whitespace-pre-wrap">
                        {message.content}
                      </pre>
                    ) : null}

                    {/* Render highlighted text (legacy format) */}
                    {message.highlights && message.highlights.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-center">
                            {highlight.url ? (
                              <a
                                href={highlight.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline text-xs"
                              >
                                {highlight.text}
                              </a>
                            ) : (
                              <span className="text-blue-400 text-xs">
                                {highlight.text}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render status message */}
                    {message.status && (
                      <div className="flex items-center gap-2 mt-2">
                        {/* Use Standa logo for status messages */}
                        <Image
                          src="/standa.svg"
                          alt="Standa Logo"
                          width={16}
                          height={16}
                          className={
                            message.status.icon === "loading"
                              ? "animate-pulse"
                              : ""
                          }
                        />
                        <span className="text-xs text-white/90">
                          {message.status.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div
            className="p-3 pb-2 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            }}
          >
            <div className="relative">
              <textarea
                placeholder="Ask me anything about this company..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="bg-white/10 border border-white/10 text-white text-xs rounded-md pr-10 h-16 w-full p-3 resize-none focus:outline-none"
                disabled={isResearching || isLoading}
              />
              <Button
                onClick={handleSendMessage}
                className="absolute right-0 bottom-1 text-white/40 hover:text-white/100 flex items-center gap-1 bg-transparent hover:bg-transparent text-xs"
                disabled={isResearching || isLoading}
              >
                <span className="">Send</span>
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right dashboard section */}
        <div className="w-2/3 bg-white p-6 pr-10 overflow-y-auto h-full">
          <Dashboard
            companyName={companyName}
            data={dashboardData}
            components={dashboardComponents}
          />
        </div>
      </div>
    </div>
  );
}
