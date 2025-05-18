import { useRef, useEffect, RefObject } from "react";
import { cn } from "@/lib/utils";
import TextBubble from "../message-bubble/text-bubble";
import ChatInput from "../chats/chat-input";
import { useUserStore } from "@/store/user";
import useChatsStore from "@/store/chat";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function ChatTab({
  className,
  pageRef,
  roomId,
}: {
  className?: string;
  pageRef: RefObject<number>;
  roomId: string;
}) {
  const { chats, hasMore, isLoading, fetchChats } = useChatsStore();
  const chatsEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = useUserStore().getUser()?.id;
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);

  const handleScroll = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && hasMore && !isLoading) {
      await handleLoadMore();
    }
  };

  const handleLoadMore = async () => {
    if (!containerRef.current || isLoading) return;

    prevScrollHeightRef.current = containerRef.current.scrollHeight;

    pageRef.current += 1;

    try {
      await fetchChats(roomId, pageRef.current, 20);
    } catch (error) {
      toast.error("Failed to load more messages");
    }

    if (containerRef.current) {
      const scrollDif =
        containerRef.current.scrollHeight - prevScrollHeightRef.current;
      containerRef.current.scrollTop = scrollDif;
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    chatsEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [chats]);

  return (
    <div
      className={cn(
        "flex flex-col relative bg-background h-[390px] md:h-[610px] rounded-md border",
        className
      )}
    >
      {isLoading && (
        <div className="w-full flex flex-col gap-1 justify-center items-center mb-0 m-2">
          <Loader className="animate-spin" />
          <p className="text-xs text-gray-400">Loading chats...</p>
        </div>
      )}
      {/* Chat area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="p-4 mb-13 md:mb-19 pb-0 w-full overflow-y-scroll remove-scrollbar"
      >
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
            );
          })}
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
               true       .
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
      <ChatInput className="absolute bottom-0 w-full" />
    </div>
  );
}
