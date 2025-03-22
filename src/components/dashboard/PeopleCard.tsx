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
  const peopleData = data as unknown as Person[];

  return (
    <div className="space-y-4">
      {peopleData.map((person, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{person.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{person.name}</p>
            <p className="text-sm text-muted-foreground">{person.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
