import { useEffect } from "react";
import TabsContentScrollArea from "../custom/tabsContents-scrollArea";
import ChatTab from "../tabs/chat-tab";
import MembersTab from "../tabs/members-tab";
import QueueTab from "../tabs/queue-tab";
import SearchTab from "../tabs/search-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import useRoomMembersStore from "@/store/room-members";
import useChatsStore from "@/store/chat";
import { toast } from "sonner";

const TABS = ["queue", "search", "chat", "members"];

export default function RoomTabs({roomId}: {roomId: string}) {
  const fetchRoomMembers = useRoomMembersStore().fetchRoomMembers;
  const fetchChats = useChatsStore().fetchChats;

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchRoomMembers(roomId);
        await fetchChats(roomId, 1, 30);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message || "Failed to load room resources.");
        else toast.error("Failed to load room resources.");
      }
    };

    initialize();
  }, [fetchRoomMembers]);

  return (
    <Tabs defaultValue="queue" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {TABS.map((tab, i) => (
          <TabsTrigger key={i} className="capitalize" value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContentScrollArea value="queue">
        <QueueTab />
      </TabsContentScrollArea>
      <TabsContentScrollArea value="search">
        <SearchTab />
      </TabsContentScrollArea>
      <TabsContent value="chat">
        <ChatTab />
      </TabsContent>
      <TabsContentScrollArea value="members">
        <MembersTab />
      </TabsContentScrollArea>
    </Tabs>
  );
}
