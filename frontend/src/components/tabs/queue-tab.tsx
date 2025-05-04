import { cn } from "@/lib/utils";
import QueueCard from "../cards/queue-card";

export default function QueueTab({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2 w-full", className)}>
      {Array.from({ length: 20 }).map((_, i) => (
        <QueueCard key={i} />
      ))}
    </div>
  );
}
