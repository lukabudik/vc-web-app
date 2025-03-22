import { DashboardComponent } from "@/lib/dashboard/registry";

// API configuration
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "your-secret-api-key-12345";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Common headers for all API requests
const getHeaders = () => ({
  "X-API-Key": API_KEY,
  "Content-Type": "application/json",
});

// Error handling for fetch requests
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }
  return response.json();
}

// Base fetch function with error handling
export async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Health check endpoint
export async function healthCheck(): Promise<{ status: string }> {
  return fetchWithErrorHandling(`${API_BASE_URL}/`, {
    method: "GET",
    headers: getHeaders(),
  });
}

// Startup data interface
export interface StartupData {
  company_name: string;
  company_description: string;
  [key: string]: string | number | boolean | object | null | undefined; // Allow for additional fields
}

// Get basic data about a startup
export async function getStartupData(
  companyName: string
): Promise<StartupData> {
  return fetchWithErrorHandling(`${API_BASE_URL}/getData`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      company_name: companyName,
    }),
  });
}

// Research data interface
export interface ResearchData {
  company_name: string;
  company_description: string;
  company_website?: string;
  industry?: string;
  founding_date?: string;
  founded_year?: number;
  location?: string;
  business_model?: string;
  founders?: string[];
  tech_stack?: string[];
  key_people?: Array<{
    name: string;
    role: string;
    background?: string;
  }>;
  tam?: {
    size: string;
    year?: number;
    cagr?: string;
    description?: string;
    sources?: string[];
  };
  sam?: {
    size: string;
    year?: number;
    cagr?: string | null;
    description?: string;
    sources?: string[];
  };
  competitors?:
    | string[]
    | {
        direct?: string[];
        indirect?: string[];
        competitive_advantage?: string;
      };
  growth_metrics?: {
    user_growth?: string;
    revenue_growth?: string;
    funding?: string;
    other_metrics?: string;
  };
  funding?: {
    total: string;
    rounds: Array<{
      date: string;
      amount: string;
      type: string;
      investors?: string[];
    }>;
  };
  clients?: {
    major_clients?: string[];
    target_segments?: string[];
    case_studies?: string[];
  };
  social_media?: {
    twitter?: string;
    linkedin?: string | null;
    other_platforms?: string | null;
  };
  media_mentions?: Array<{
    title: string;
    source: string;
    date: string | null;
    summary?: string;
  }>;
  [key: string]:
    | string
    | number
    | boolean
    | object
    | null
    | undefined
    | Array<unknown>; // Allow for additional fields
}

// Perform comprehensive research on a startup
export async function researchStartup(
  companyName: string
): Promise<ResearchData> {
  return fetchWithErrorHandling(`${API_BASE_URL}/research`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      company_name: companyName,
    }),
  });
}

// Chat message interface
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Chat request interface
export interface ChatRequest {
  message: string;
  history: ChatMessage[];
  research_data: ResearchData;
}

// Chat response interface
export interface ChatResponse {
  response: string;
  tool_calls?: {
    tool: string;
    arguments: {
      card: DashboardComponent;
    };
  }[];
}

// Send a chat message and receive a response
export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  return fetchWithErrorHandling(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
}
