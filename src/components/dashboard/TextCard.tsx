import { DashboardComponentProps } from "@/lib/dashboard/registry";

interface TextData {
   text?: string;
   items?: string[];
   footer?: string;
   sections?: {
      title: string;
      items?: string[];
      description?: string;
   }[];
   mentions?: {
      source: string;
      quote: string;
      date: string;
   }[];
}

export function TextCard({ data }: DashboardComponentProps) {
   const textData = data as TextData;

   if (textData.mentions) {
      return (
         <div className="space-y-2 overflow-auto h-full">
            {textData.mentions.map((mention, index) => (
               <div key={index} className="border rounded-lg p-2">
                  <p className="text-xs font-medium">{mention.source}</p>
                  <p className="text-xs text-muted-foreground">
                     "{mention.quote}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                     {mention.date}
                  </p>
               </div>
            ))}
         </div>
      );
   }

   if (textData.sections) {
      return (
         <div className="space-y-2 overflow-auto h-full">
            {textData.sections.map((section, index) => (
               <div key={index}>
                  <p className="text-xs font-medium">{section.title}</p>
                  {section.items && (
                     <ul className="list-disc pl-4 text-xs">
                        {section.items.map((item, idx) => (
                           <li key={idx}>{item}</li>
                        ))}
                     </ul>
                  )}
                  {section.description && (
                     <p className="text-xs text-muted-foreground">
                        {section.description}
                     </p>
                  )}
               </div>
            ))}
         </div>
      );
   }

   return (
      <div className="space-y-2 overflow-auto h-full">
         {textData.text && <p className="text-xs">{textData.text}</p>}
         {textData.items && (
            <ul className="list-disc pl-4 space-y-1 text-xs">
               {textData.items.map((item, index) => (
                  <li key={index}>{item}</li>
               ))}
            </ul>
         )}
         {textData.footer && <p className="text-xs">{textData.footer}</p>}
      </div>
   );
}
