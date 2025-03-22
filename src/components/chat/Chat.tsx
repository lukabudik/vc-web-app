"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AgentMessage, AgentState, askAgent } from "@/lib/agent/agent-service";

interface ChatProps {
   companyName: string;
   initialChatHistory?: AgentMessage[];
}

export function Chat({ companyName, initialChatHistory = [] }: ChatProps) {
   const [chatMessage, setChatMessage] = useState("");
   const [chatHistory, setChatHistory] =
      useState<AgentMessage[]>(initialChatHistory);

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

      // Call the local API endpoint
      try {
         const response = await fetch('http://127.0.0.1:8000', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
               query: chatMessage 
            }),
         });

         if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
         }

         const data = await response.json();
         
         // Add agent response to chat history
         const agentResponse: AgentMessage = {
            role: "agent",
            content: [{ text: data.response || data.message || JSON.stringify(data) }],
         };
         
         setChatHistory((prev) => [...prev, agentResponse]);
      } catch (error) {
         console.error("Error calling API:", error);
         setChatHistory((prev) => [
            ...prev,
            {
               role: "agent",
               content: [
                  {
                     text: "Sorry, I encountered an error while connecting to the service.",
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

   return (
      <div className="bg-black text-white flex flex-col border-r border-white/10 h-full relative">
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
                        {message.highlights &&
                           message.highlights.length > 0 && (
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
                  placeholder="I want to make something that something"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                     }
                  }}
                  className="bg-white/10 border border-white/10 text-white text-xs rounded-md pr-10 h-16 w-full p-3 resize-none focus:outline-none"
               />
               <Button
                  onClick={handleSendMessage}
                  className="absolute right-0 bottom-1 text-white/40 hover:text-white/100 flex items-center gap-1 bg-transparent hover:bg-transparent text-xs"
               >
                  <span className="">Send</span>
                  <ArrowRight className="size-3" />
               </Button>
            </div>
         </div>
      </div>
   );
}
