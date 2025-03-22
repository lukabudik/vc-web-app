import { DashboardComponent } from "@/lib/dashboard/registry";
import { ResearchData } from "./api-service";

// API configuration
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "your-secret-api-key-12345";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

// Research WebSocket message types
export type ResearchProgressMessage = {
  type: "progress";
  message: string;
  percentage: number;
};

export type ResearchResultMessage = {
  type: "result";
  data: ResearchData;
};

export type ResearchErrorMessage = {
  type: "error";
  message: string;
};

export type ResearchWebSocketMessage =
  | ResearchProgressMessage
  | ResearchResultMessage
  | ResearchErrorMessage;

// Chat WebSocket message types
export type ChatContentMessage = {
  type: "content";
  content: string;
};

export type ChatToolCallMessage = {
  type: "tool_call";
  tool: string;
  arguments: {
    card: DashboardComponent;
  };
};

export type ChatFinalMessage = {
  type: "final";
  content: string;
};

export type ChatErrorMessage = {
  type: "error";
  message: string;
};

export type ChatWebSocketMessage =
  | ChatContentMessage
  | ChatToolCallMessage
  | ChatFinalMessage
  | ChatErrorMessage;

// WebSocket connection for research
export function connectToResearchWebSocket(
  companyName: string,
  callbacks: {
    onProgress?: (message: string, percentage: number) => void;
    onResult?: (data: ResearchData) => void;
    onError?: (message: string) => void;
    onClose?: () => void;
  }
): WebSocket {
  const socket = new WebSocket(`${WS_BASE_URL}/ws/research`);

  socket.onopen = () => {
    // Send initial message with API key and company name
    socket.send(
      JSON.stringify({
        api_key: API_KEY,
        company_name: companyName,
      })
    );
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as ResearchWebSocketMessage;

      switch (data.type) {
        case "progress":
          callbacks.onProgress?.(data.message, data.percentage);
          break;

        case "result":
          callbacks.onResult?.(data.data);
          socket.close();
          break;

        case "error":
          callbacks.onError?.(data.message);
          socket.close();
          break;
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      callbacks.onError?.("Failed to parse server message");
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    callbacks.onError?.("WebSocket connection error");
  };

  socket.onclose = () => {
    callbacks.onClose?.();
  };

  return socket;
}

// Chat message history interface
export interface ChatHistory {
  role: "user" | "assistant";
  content: string;
}

// WebSocket connection for chat
export function connectToChatWebSocket(
  message: string,
  history: ChatHistory[],
  researchData: ResearchData,
  callbacks: {
    onContent?: (content: string) => void;
    onToolCall?: (tool: string, args: { card: DashboardComponent }) => void;
    onFinal?: (content: string) => void;
    onError?: (message: string) => void;
    onClose?: () => void;
  }
): WebSocket {
  const socket = new WebSocket(`${WS_BASE_URL}/ws/chat`);

  socket.onopen = () => {
    // Send initial message with API key, message, history, and research data
    socket.send(
      JSON.stringify({
        api_key: API_KEY,
        message,
        history,
        research_data: researchData,
      })
    );
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as ChatWebSocketMessage;

      switch (data.type) {
        case "content":
          callbacks.onContent?.(data.content);
          break;

        case "tool_call":
          callbacks.onToolCall?.(data.tool, data.arguments);
          break;

        case "final":
          callbacks.onFinal?.(data.content);
          socket.close();
          break;

        case "error":
          callbacks.onError?.(data.message);
          socket.close();
          break;
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      callbacks.onError?.("Failed to parse server message");
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    callbacks.onError?.("WebSocket connection error");
  };

  socket.onclose = () => {
    callbacks.onClose?.();
  };

  return socket;
}
