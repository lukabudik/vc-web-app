import { DashboardComponentProps } from "@/lib/dashboard/registry";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Person {
  name: string;
  role: string;
  avatar: string;
}

interface PeopleCardData {
  people: Person[];
}

export function PeopleCard({ data }: DashboardComponentProps) {
  // Handle both formats: direct array or {people: Person[]}
  const peopleData = Array.isArray(data)
    ? (data as Person[])
    : (data as PeopleCardData)?.people || [];

  return (
    <div className="space-y-2 h-full overflow-auto">
      {peopleData.map((person, index) => (
        <div key={index} className="flex items-center gap-2">
          <Avatar className="h-6 w-6 text-xs">
            <AvatarFallback className="text-xs">{person.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-medium">{person.name}</p>
            <p className="text-xs text-muted-foreground">{person.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
