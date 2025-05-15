import { Circle } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function MembersCard({username, isOnline, isHost}: {
  username: string;
  isOnline: boolean;
  isHost: boolean;
}) {
  return (
    <div className="dark:bg-zinc-800 w-full flex items-center justify-between p-2 rounded-lg gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Avatar>
            <AvatarFallback className="capitalize">{username[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center gap-4">
          {username}
          {isHost && (
            <span className="rounded-lg border p-1.5 text-xs">Host</span>
          )}
        </div>
      </div>
      <div className="mr-4 flex items-center gap-2">
        {isOnline ? (
          <>
            <Circle size={16} color="green" fill="green" />
            <span>online</span>
          </>
        ) : (
          <>
            <Circle size={16} color="red" fill="red" />
            <span>offline</span>
          </>
        )}
      </div>
    </div>
  );
}
