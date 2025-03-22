import { DashboardComponent } from "@/lib/dashboard/registry";
import {
  ResearchData,
  sendChatMessage,
  researchStartup,
  ChatMessage,
} from "@/lib/api/api-service";
import {
  connectToResearchWebSocket,
  connectToChatWebSocket,
  ChatHistory,
} from "@/lib/api/websocket-service";

export interface ContentItem {
  text: string;
  highlighted?: boolean;
  url?: string;
}

export interface AgentMessage {
  role: "user" | "agent";
  content: string | ContentItem[];
  // New fields for enhanced message formatting
  heading?: string;
  highlights?: { text: string; url?: string }[];
  status?: {
    text: string;
    icon?: "loading" | "success" | "error";
  };
}

export interface AgentState {
  companyName: string;
  messages: AgentMessage[];
  isSearching: boolean;
  researchData?: ResearchData;
}

export type ComponentCreatedCallback = (component: DashboardComponent) => void;

// Function to search for startup information using WebSocket for streaming updates
export const searchStartupInfo = async (
  companyName: string,
  onComponentCreated: ComponentCreatedCallback
): Promise<ResearchData> => {
  return new Promise((resolve, reject) => {
    try {
      // Use WebSocket for streaming updates
      const socket = connectToResearchWebSocket(companyName, {
        onProgress: (message, percentage) => {
          // Create a progress component or update UI
          console.log(`Research progress: ${message} (${percentage}%)`);
        },
        onResult: (data) => {
          // Process the research data
          processResearchData(data, onComponentCreated);
          resolve(data);
        },
        onError: (message) => {
          console.error("Research error:", message);
          reject(new Error(message));
        },
      });

      // Fallback to HTTP request if WebSocket fails
      setTimeout(async () => {
        if (socket.readyState !== WebSocket.OPEN) {
          console.log("WebSocket connection failed, falling back to HTTP");
          try {
            const data = await researchStartup(companyName);
            processResearchData(data, onComponentCreated);
            resolve(data);
          } catch (error) {
            console.error("HTTP research error:", error);
            reject(error);
          }
        }
      }, 5000); // Wait 5 seconds before falling back
    } catch (error) {
      console.error("Error in searchStartupInfo:", error);
      reject(error);
    }
  });
};

// Process research data and create dashboard components
const processResearchData = (
  data: ResearchData,
  onComponentCreated: ComponentCreatedCallback
): void => {
  // Create a set to track component IDs to avoid duplicates
  const createdComponentIds = new Set<string>();

  // Helper function to create and track components
  const createAndTrackComponent = (
    type: DashboardComponent["type"],
    title: string,
    data: unknown,
    size: DashboardComponent["size"] = "small"
  ) => {
    const componentId = `${type}-${title.toLowerCase().replace(/\s+/g, "-")}`;

    // Skip if we've already created this component
    if (createdComponentIds.has(componentId)) {
      return;
    }

    // Create the component
    const component = createComponent(type, title, data, size);

    // Override the ID to make it more predictable and avoid duplicates
    component.id = componentId;

    // Track the component ID
    createdComponentIds.add(componentId);

    // Create the component
    onComponentCreated(component);
  };

  console.log("Processing research data:", JSON.stringify(data, null, 2));

  // Company overview
  if (data.company_description) {
    createAndTrackComponent(
      "text",
      "Company Overview",
      {
        text: data.company_description,
      },
      "medium"
    );
  }

  // Business model
  if (data.business_model) {
    createAndTrackComponent(
      "text",
      "Business Model",
      {
        text: data.business_model,
      },
      "medium"
    );
  }

  // Key people
  if (
    data.key_people &&
    Array.isArray(data.key_people) &&
    data.key_people.length > 0
  ) {
    createAndTrackComponent(
      "people",
      "Key People",
      data.key_people.map((person: { name: string; role: string }) => ({
        name: person.name,
        role: person.role,
        avatar: person.name
          .split(" ")
          .map((n: string) => n[0])
          .join(""),
      })),
      "medium"
    );
  } else if (data.founders && data.founders.length > 0) {
    // Fallback to founders if key_people is not available
    createAndTrackComponent(
      "people",
      "Key People",
      {
        people: data.founders.map((founder, index) => ({
          name: founder,
          role: index === 0 ? "Founder & CEO" : "Co-Founder",
          avatar: founder
            .split(" ")
            .map((n) => n[0])
            .join(""),
        })),
      },
      "small"
    );
  }

  // Tech stack
  if (
    data.tech_stack &&
    Array.isArray(data.tech_stack) &&
    data.tech_stack.length > 0
  ) {
    createAndTrackComponent(
      "list",
      "Tech Stack",
      [
        {
          title: "Technologies",
          items: data.tech_stack,
        },
      ],
      "small"
    );
  }

  // Competitors
  if (data.competitors) {
    // Handle both string array and object format
    if (Array.isArray(data.competitors)) {
      createAndTrackComponent(
        "list",
        "Competitors",
        {
          sections: [
            {
              title: "Main Competitors",
              items: data.competitors,
            },
          ],
        },
        "small"
      );
    } else if (typeof data.competitors === "object") {
      // Handle the structured competitors object
      const competitorsObj = data.competitors as {
        direct?: string[];
        indirect?: string[];
        competitive_advantage?: string;
      };

      const competitorSections = [];

      if (
        competitorsObj.direct &&
        Array.isArray(competitorsObj.direct) &&
        competitorsObj.direct.length > 0
      ) {
        competitorSections.push({
          title: "Direct Competitors",
          items: competitorsObj.direct,
        });
      }

      if (
        competitorsObj.indirect &&
        Array.isArray(competitorsObj.indirect) &&
        competitorsObj.indirect.length > 0
      ) {
        competitorSections.push({
          title: "Indirect Competitors",
          items: competitorsObj.indirect,
        });
      }

      if (competitorSections.length > 0) {
        createAndTrackComponent(
          "list",
          "Competitors",
          competitorSections,
          "medium"
        );
      }

      // Create a separate component for competitive advantage if available
      if (competitorsObj.competitive_advantage) {
        createAndTrackComponent(
          "text",
          "Competitive Advantage",
          {
            text: competitorsObj.competitive_advantage,
          },
          "medium"
        );
      }
    }
  }

  // TAM (Total Addressable Market)
  if (data.tam && typeof data.tam === "object") {
    const tam = data.tam as { size: string; description?: string };
    createAndTrackComponent(
      "stat",
      "Total Addressable Market",
      {
        value: tam.size || "N/A",
        description: tam.description ? tam.description.split(".")[0] + "." : "",
      },
      "small"
    );
  }

  // SAM (Serviceable Addressable Market)
  if (data.sam && typeof data.sam === "object") {
    const sam = data.sam as { size: string; description?: string };
    createAndTrackComponent(
      "stat",
      "Serviceable Market",
      {
        value: sam.size || "N/A",
        description: sam.description ? sam.description.split(".")[0] + "." : "",
      },
      "small"
    );
  }

  // Growth metrics
  if (data.growth_metrics && typeof data.growth_metrics === "object") {
    const metrics = data.growth_metrics as {
      revenue_growth?: string;
      user_growth?: string;
      funding?: string;
    };

    // Revenue growth
    if (metrics.revenue_growth) {
      createAndTrackComponent(
        "stat",
        "Revenue Growth",
        {
          value: metrics.revenue_growth.split(".")[0],
          description: "Latest revenue growth",
        },
        "small"
      );
    }

    // User growth
    if (metrics.user_growth) {
      createAndTrackComponent(
        "stat",
        "User Growth",
        {
          value: metrics.user_growth.includes("%")
            ? metrics.user_growth.match(/\d+%/)?.[0] || "N/A"
            : metrics.user_growth.split(".")[0],
          description: "Latest user growth metrics",
        },
        "small"
      );
    }

    // Funding
    if (metrics.funding) {
      createAndTrackComponent(
        "stat",
        "Total Funding",
        {
          value: metrics.funding.match(/\$[\d.]+ billion/)?.[0] || "N/A",
          description: "Total funding raised",
        },
        "small"
      );
    }
  }

  // Clients
  if (data.clients && typeof data.clients === "object") {
    const clients = data.clients as {
      major_clients?: string[];
      target_segments?: string[];
    };

    const clientSections = [];

    if (
      clients.major_clients &&
      Array.isArray(clients.major_clients) &&
      clients.major_clients.length > 0
    ) {
      clientSections.push({
        title: "Major Clients",
        items: clients.major_clients,
      });
    }

    if (
      clients.target_segments &&
      Array.isArray(clients.target_segments) &&
      clients.target_segments.length > 0
    ) {
      clientSections.push({
        title: "Target Segments",
        items: clients.target_segments,
      });
    }

    if (clientSections.length > 0) {
      createAndTrackComponent(
        "list",
        "Clients & Market Segments",
        clientSections,
        "medium"
      );
    }
  }

  // Media mentions
  if (
    data.media_mentions &&
    Array.isArray(data.media_mentions) &&
    data.media_mentions.length > 0
  ) {
    createAndTrackComponent(
      "text",
      "Media Mentions",
      {
        mentions: data.media_mentions.map(
          (mention: {
            source: string;
            title: string;
            date: string | null;
          }) => ({
            source: mention.source,
            quote: mention.title,
            date: mention.date || "Recent",
          })
        ),
      },
      "medium"
    );
  }

  // Location and founding year
  if (data.location || data.founded_year) {
    createAndTrackComponent(
      "stat",
      "Founded",
      {
        value: data.founded_year ? data.founded_year.toString() : "N/A",
        description: data.location || "",
      },
      "small"
    );
  } else if (data.founding_date) {
    // Fallback to founding_date if founded_year is not available
    createAndTrackComponent(
      "stat",
      "Founded",
      {
        value: new Date(data.founding_date).getFullYear().toString(),
        description: `${
          new Date().getFullYear() - new Date(data.founding_date).getFullYear()
        } years ago`,
      },
      "small"
    );
  }

  // Funding (old format)
  if (data.funding && data.funding.rounds && data.funding.rounds.length > 0) {
    const fundingData = data.funding.rounds.map((round) => ({
      year: new Date(round.date).getFullYear().toString(),
      growth: parseFloat(round.amount.replace(/[^0-9.]/g, "")),
      predicted: false,
    }));

    createAndTrackComponent(
      "lineChart",
      "Funding History",
      {
        chartData: fundingData,
        dataKey: "growth",
        xAxisKey: "year",
        config: {
          funding: {
            label: "Funding Amount",
            color: "#4F46E5",
          },
        },
        configKey: "funding",
      },
      "large"
    );
  }

  // Industry
  if (data.industry) {
    createAndTrackComponent(
      "stat",
      "Industry",
      {
        value: data.industry,
        description: "Primary business sector",
      },
      "small"
    );
  }

  // Total funding (old format)
  if (data.funding && data.funding.total) {
    createAndTrackComponent(
      "stat",
      "Total Funding",
      {
        value: data.funding.total,
        description: "Across all funding rounds",
      },
      "small"
    );
  }
};

// Function to ask the agent a question using WebSocket for streaming responses
export const askAgent = async (
  question: string,
  state: AgentState,
  onComponentCreated: ComponentCreatedCallback
): Promise<AgentMessage> => {
  return new Promise((resolve, reject) => {
    // Create a default research data object if none exists
    const researchData: ResearchData = state.researchData || {
      company_name: state.companyName,
      company_description: "",
      industry: "",
    };

    // Convert AgentMessage[] to ChatHistory[]
    const history: ChatHistory[] = state.messages
      .filter(
        (msg) =>
          typeof msg.content === "string" ||
          (Array.isArray(msg.content) && msg.content.length === 1)
      )
      .map((msg) => ({
        role: msg.role === "agent" ? ("assistant" as const) : ("user" as const),
        content:
          typeof msg.content === "string"
            ? msg.content
            : Array.isArray(msg.content)
            ? msg.content[0].text
            : "",
      }));

    let responseContent = "";
    const toolCalls: Array<{
      tool: string;
      arguments: { card: DashboardComponent };
    }> = [];

    try {
      // Use WebSocket for streaming responses
      const socket = connectToChatWebSocket(question, history, researchData, {
        onContent: (content) => {
          // Update the response content as it streams in
          responseContent += content;
        },
        onToolCall: (tool, args) => {
          if (tool === "add_dashboard_card") {
            // Process the dashboard card
            onComponentCreated(args.card);
            toolCalls.push({ tool, arguments: args });
          }
        },
        onFinal: (content) => {
          // Final response
          const finalContent = content || responseContent;

          // Create the agent message
          const agentMessage: AgentMessage = {
            role: "agent",
            content: [{ text: finalContent }],
          };

          resolve(agentMessage);
        },
        onError: (message) => {
          console.error("Chat error:", message);
          reject(new Error(message));
        },
      });

      // Fallback to HTTP request if WebSocket fails
      setTimeout(async () => {
        if (socket.readyState !== WebSocket.OPEN) {
          console.log("WebSocket connection failed, falling back to HTTP");
          try {
            const response = await sendChatMessage({
              message: question,
              history: history as ChatMessage[],
              research_data: researchData,
            });

            // Process any tool calls
            if (response.tool_calls && response.tool_calls.length > 0) {
              for (const toolCall of response.tool_calls) {
                if (toolCall.tool === "add_dashboard_card") {
                  onComponentCreated(toolCall.arguments.card);
                }
              }
            }

            // Create the agent message
            const agentMessage: AgentMessage = {
              role: "agent",
              content: [{ text: response.response }],
            };

            resolve(agentMessage);
          } catch (error) {
            console.error("HTTP chat error:", error);
            reject(error);
          }
        }
      }, 5000); // Wait 5 seconds before falling back
    } catch (error) {
      console.error("Error in askAgent:", error);
      reject(error);
    }
  });
};

// Create a dashboard component
export const createComponent = (
  type: DashboardComponent["type"],
  title: string,
  data: unknown,
  size: DashboardComponent["size"] = "small"
): DashboardComponent => {
  // Get appropriate icon based on component type
  const getIcon = () => {
    // This would be implemented to return the appropriate icon
    // For now, return null
    return null;
  };

  return {
    id: `dynamic-${Date.now()}`,
    type,
    title,
    icon: getIcon(),
    size,
    data,
  };
};
