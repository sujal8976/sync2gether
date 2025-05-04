import { Circle, User } from "lucide-react";

export default function MembersCard() {
  return (
    <div className="dark:bg-zinc-800 w-full flex items-center justify-between p-2 rounded-lg gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-4">
          username
          {true && (
            <span className="rounded-lg border p-1.5 text-xs">Host</span>
          )}
        </div>
      </div>
      <div className="mr-4 flex items-center gap-2">
        {true ? (
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
