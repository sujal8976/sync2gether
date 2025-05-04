import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot } from "lucide-react";
import ChatHeader from "../chats/chat-header";

// Types for our chat messages
interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatTab({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    // {
    //   id: "1",
    //   content: "Hello! How can I help you today?",
    //   sender: "bot",
    //   timestamp: new Date(),
    // },
    // {
    //   id: "13",
    //   content: "Hello! How can I help you today?",
    //   sender: "bot",
    //   timestamp: new Date(),
    // },
    // {
    //   id: "12",
    //   content: "Hello! How can I help you today?",
    //   sender: "bot",
    //   timestamp: new Date(),
    // },
    // {
    //   id: "1432",
    //   content: "Hello! How can I help you today?",
    //   sender: "bot",
    //   timestamp: new Date(),
    // },
    // {
    //   id: "1234",
    //   content: "Hello! How can I help you today?",
    //   sender: "bot",
    //   timestamp: new Date(),
    // },
    // {
    //   id: "12343",
    //   content: "Hello! How can I help you today?",
    //   sender: "bot",
    //   timestamp: new Date(),
    // },
    // {
    //   id: "1122",
    //   content: "Hello! How can I help you today?",
    //   sender: "bot",
    //   timestamp: new Date(),
    // },
    {
      id: "1756",
      content: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "1567",
      content: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "1345345",
      content: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
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
      <ChatHeader />

      {/* Messages area */}
      {/* <ScrollArea className="p-4 h-[288px-69px-45px]"> */}
      <div className="p-4 mb-10 md:mb-15 pb-0 w-full overflow-y-scroll remove-scrollbar">
        <div className="flex flex-col space-y-4 ">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-2.5",
                message.sender === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div className="flex-shrink-0">
                {message.sender === "user" ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div
                className={cn(
                  "max-w-3/4 px-4 py-2 rounded-lg",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
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
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* </ScrollArea> */}

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
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
