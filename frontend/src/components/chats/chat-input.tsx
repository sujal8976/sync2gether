import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useWebSocket from "@/hooks/useWebSocket";

export default function ChatInput({ className }: { className?: string; }) {
  const {sendMessage} = useWebSocket(false, false);

  const [input, setInput] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
        handleSendMessage();
    }
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div
      className={cn(
        "bg-black p-2 md:p-4 md:border-t",
        className
      )}
    >
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim()}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
