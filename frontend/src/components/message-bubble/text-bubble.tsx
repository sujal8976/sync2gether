import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { Chat } from "@/types/chat";
import { format } from "date-fns";

type ChatWithoutIdAndUserId = Omit<Chat, "id" | "user"> & {
  user: Omit<Chat["user"], "id">;
  isConsecutive: boolean;
  isCurrentUser: boolean;
};

export default function TextBubble({
  message,
  user,
  createdAt,
  tempId,
  isConsecutive,
  isCurrentUser,
}: ChatWithoutIdAndUserId) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5",
        isCurrentUser ? "flex-row-reverse" : "",
        isConsecutive ? "mt-1" : "mt-3"
      )}
    >
      <div className="flex-shrink-0">
        {isCurrentUser ? (
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
                {user.username[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
      <div
        className={cn(
          "max-w-3/4 px-4 py-1.5 rounded-lg flex flex-col",
          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {!isCurrentUser && !isConsecutive && (
          <p className="font-semibold">{user.username}</p>
        )}
        <p className="text-sm">{message}</p>
        <p className="text-xs mt-1 opacity-70">
          {format(new Date(createdAt), "HH:mm")}
        </p>
      </div>
    </div>
  );
}
