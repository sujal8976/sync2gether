import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";

export default function TextBubble({
  sender,
  content,
  timestamp,
  isConsecutive,
}: {
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  isConsecutive: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5",
        sender === "user" ? "flex-row-reverse" : "",
        isConsecutive ? "mt-1" : "mt-3"
      )}
    >
      <div className="flex-shrink-0">
        {sender === "user" ? (
          isConsecutive ? (
            <div className="size-8" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
          )
        ) : isConsecutive ? (
          <div className="size-8" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <Avatar>
              <AvatarFallback className="capitalize">
                {"rahul"[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
      <div
        className={cn(
          "max-w-3/4 px-4 py-1.5 rounded-lg flex flex-col",
          sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {sender === "bot" && !isConsecutive && (
          <p className="font-semibold">sujal123</p>
        )}
        <p className="text-sm">{content}</p>
        <p className="text-xs mt-1 opacity-70">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
