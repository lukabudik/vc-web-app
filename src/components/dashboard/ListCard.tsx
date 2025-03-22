import { DashboardComponentProps } from "@/lib/dashboard/registry";

interface ListSection {
   title: string;
   items: string[];
}

export function ListCard({ data }: DashboardComponentProps) {
   const listData = data as ListSection[];

   return (
      <div className="space-y-2 h-full overflow-auto">
         {listData.map((section, index) => (
            <div key={index}>
               <p className="text-xs font-medium">{section.title}:</p>
               <p className="text-xs text-muted-foreground">
                  {section.items.join(", ")}
               </p>
            </div>
         ))}
      </div>
   );
}
