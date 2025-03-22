import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentSkeleton } from "@/components/dashboard/ComponentSkeleton";
import {
  DashboardComponent as DashboardComponentType,
  componentRegistry,
  getSizeClass,
} from "@/lib/dashboard/registry";

interface DashboardComponentProps {
  component: DashboardComponentType;
  isLoading: boolean;
}

export function DashboardComponent({
  component,
  isLoading,
}: DashboardComponentProps) {
  const { id, type, title, icon, size, data } = component;
  const Component = componentRegistry[type];

  return (
    <Card key={id} className={getSizeClass(size)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ComponentSkeleton type={type} />
        ) : (
          <Component data={data} />
        )}
      </CardContent>
    </Card>
  );
}
