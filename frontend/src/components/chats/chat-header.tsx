import { MessageSquareText } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="py-2 px-4 border-b flex items-center">
      <MessageSquareText className="h-5 w-5 mr-2 text-primary" />
      <h2 className="text-lg font-medium">Room Name</h2>
    </div>
  );
}
