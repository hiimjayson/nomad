import {
  SailboatIcon as Boat,
  Building2,
  Castle,
  Home,
  Mountain,
  TreePalmIcon as PalmTree,
  Snowflake,
  Tent,
  Trees,
  Warehouse,
  Waves,
} from "lucide-react";
import Link from "next/link";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "All homes",
    icon: Home,
  },
  {
    name: "Amazing views",
    icon: Mountain,
  },
  {
    name: "Tiny homes",
    icon: Warehouse,
  },
  {
    name: "Beach",
    icon: Waves,
  },
  {
    name: "Countryside",
    icon: Trees,
  },
  {
    name: "Camping",
    icon: Tent,
  },
  {
    name: "Castles",
    icon: Castle,
  },
  {
    name: "Islands",
    icon: PalmTree,
  },
  {
    name: "Boats",
    icon: Boat,
  },
  {
    name: "Ski-in/out",
    icon: Snowflake,
  },
  {
    name: "Mansions",
    icon: Building2,
  },
];

export function CategoryBar() {
  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-2 justify-center pb-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href="#"
            className={cn(
              "rounded flex min-w-fit flex-col items-center gap-2 p-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
            )}
          >
            <category.icon className="h-5 w-5" />
            <span className="whitespace-nowrap">{category.name}</span>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}
