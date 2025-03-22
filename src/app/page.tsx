"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
   const [companyName, setCompanyName] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [isButtonHovered, setIsButtonHovered] = useState(false);
   const [animationState, setAnimationState] = useState({
      logoVisible: false,
      contentVisible: false
   });
   const router = useRouter();
   const logoRef = useRef<HTMLDivElement>(null);

   // Handle animations on mount
   useEffect(() => {
      // Show logo first
      setTimeout(() => {
         setAnimationState(prev => ({ ...prev, logoVisible: true }));
      }, 200);
      
      // Then show content
      setTimeout(() => {
         setAnimationState(prev => ({ ...prev, contentVisible: true }));
      }, 800);
   }, []);

   // Handle search for a company
   const handleSearch = async () => {
      if (!companyName.trim()) return;

      setIsLoading(true);

      try {
         // Add a small delay to show the loading state
         await new Promise((resolve) => setTimeout(resolve, 800));

         // Navigate to the analysis page with the company name as a parameter
         router.push(`/analysis?company=${encodeURIComponent(companyName)}`);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
         <div className="container max-w-md mx-auto py-6 flex flex-col items-center">
            <div 
               ref={logoRef} 
               className={`flex items-center gap-2 mb-4 transition-all duration-500 ease-out ${
                  animationState.logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
               }`}
            >
               <div
                  className={`transition-transform duration-300 ${
                     isButtonHovered ? "animate-wiggle" : ""
                  } ${isLoading ? "animate-pulse-custom" : ""}`}
               >
                  <Image
                     src="/standa.svg"
                     alt="Standa Logo"
                     width={29}
                     height={30}
                  />
               </div>
               <h1 className="text-2xl font-bold text-white">Standa</h1>
            </div>

            <p 
               className={`text-white/40 font-medium mb-12 text-center transition-all duration-500 delay-100 ease-out ${
                  animationState.contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
               }`}
            >
               Which startup do you want to analyse?
            </p>

            <div 
               className={`w-full max-w-md transition-all duration-500 delay-200 ease-out ${
                  animationState.contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
               }`}
            >
               <div className="flex items-center gap-2 bg-white/15 rounded-md p-1">
                  <Input
                     placeholder="E2B"
                     value={companyName}
                     onChange={(e) => setCompanyName(e.target.value)}
                     className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/50"
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           handleSearch();
                        }
                     }}
                     disabled={isLoading}
                     autoFocus
                  />
                  <Button
                     onClick={handleSearch}
                     disabled={isLoading}
                     className="bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105"
                     size="sm"
                     onMouseEnter={() => setIsButtonHovered(true)}
                     onMouseLeave={() => setIsButtonHovered(false)}
                  >
                     {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                        <>
                           Send
                           <ArrowRight className="h-4 w-4" />
                        </>
                     )}
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
