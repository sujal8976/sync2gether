import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import TextBubble from "../message-bubble/text-bubble";
import ChatInput from "../chats/chat-input";
import { useUserStore } from "@/store/user";
import useChatsStore from "@/store/chat";

export default function ChatTab({ className }: { className?: string }) {
  const { chats } = useChatsStore();
  const chatsEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = useUserStore().getUser()?.id;

  // Auto-scroll to the latest message
  useEffect(() => {
    chatsEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [chats]);

  // Mock function to simulate AI response
  // const generateBotResponse = () => {
  //   return new Promise<string>((resolve) => {
  //     setTimeout(() => {
  //       const responses = [
  //         "I understand what you're asking about. Can you provide more details?",
  //         "That's an interesting point! Here's what I think...",
  //         "Let me help you with that. Based on what you've shared...",
  //         "I'm processing your request. Here's what I found...",
  //       ];
  //       const randomResponse =
  //         responses[Math.floor(Math.random() * responses.length)];
  //       resolve(randomResponse);
  //     }, 1000);
  //   });
  // };

  // const handleSendMessage = async () => {
  //   if (!input.trim()) return;

  //   // Add user message
  //   const userMessage: Chat = {
  //     id: Date.now().toString(),
  //     content: input,
  //     sender: "user",
  //     timestamp: new Date(),
  //   };

  //   setChats((prev) => [...prev, userMessage]);
  //   setInput("");

  //   // Generate and add bot response
  //   try {
  //     const botResponse = await generateBotResponse();
  //     const botMessage: Chat = {
  //       id: (Date.now() + 1).toString(),
  //       content: botResponse,
  //       sender: "bot",
  //       timestamp: new Date(),
  //     };
  //     setChats((prev) => [...prev, botMessage]);
  //   } catch (error) {
  //     console.error("Error generating response:", error);
  //   }
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSendMessage();
  //   }
  // };

  return (
    <div
      className={cn(
        "flex flex-col relative bg-background h-[390px] md:h-[610px] rounded-md border",
        className
      )}
    >
      {/* Chat area */}
      <div className="p-4 mb-13 md:mb-19 pb-0 w-full overflow-y-scroll remove-scrollbar">
        <div className="flex flex-col">
          {chats.map((chat, index) => {
            const previousMessage = index > 0 ? chats[index - 1] : null;
            const isConsecutive = previousMessage
              ? previousMessage.user.id === chat.user.id
              : false;
            return (
            <TextBubble
              key={chat.id}
              user={chat.user}
              createdAt={chat.createdAt}
              tempId={chat.tempId}
              isConsecutive={isConsecutive}
              isCurrentUser={currentUserId === chat.user.id}
              message={chat.message}
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
          <div ref={chatsEndRef} />
        </div>
      </div>

      {/* Input area */}
      {/* <div className="bg-black p-2 md:p-4 absolute bottom-0 w-full md:border-t">
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
      </div> */}
      <ChatInput className="absolute bottom-0 w-full"/>
    </div>
  );
}
