import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import TextBubble from "../message-bubble/text-bubble";

// Types for our chat messages
interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatTab({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  // Mock function to simulate AI response
  const generateBotResponse = () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const responses = [
          "I understand what you're asking about. Can you provide more details?",
          "That's an interesting point! Here's what I think...",
          "Let me help you with that. Based on what you've shared...",
          "I'm processing your request. Here's what I found...",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];
        resolve(randomResponse);
      }, 1000);
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Generate and add bot response
    try {
      const botResponse = await generateBotResponse();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col relative bg-background h-[390px] md:h-[610px] rounded-md border",
        className
      )}
    >
      {/* Messages area */}
      <div className="p-4 mb-13 md:mb-19 pb-0 w-full overflow-y-scroll remove-scrollbar">
        <div className="flex flex-col">
          {messages.map((message, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const isConsecutive = previousMessage
              ? previousMessage.sender === message.sender
              : false;
            return (
            <TextBubble
              key={message.id}
              isConsecutive={isConsecutive}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          )})}
          {/* {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
              </div>
              <div className="max-w-3/4 px-4 py-2 rounded-lg bg-muted">
                <p className="text-sm">
                  <span className="inline-block animate-bounce">.</span>
                  <span className="inline-block animate-bounce delay-75">
                    .
                  </span>
                  <span className="inline-block animate-bounce delay-150">
                    .
                  </span>
                </p>
              </div>
            </div>
          )} */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-black p-2 md:p-4 absolute bottom-0 w-full md:border-t">
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
    </div>
  );
}
