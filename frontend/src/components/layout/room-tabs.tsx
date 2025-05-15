import { useEffect } from "react";
import TabsContentScrollArea from "../custom/tabsContents-scrollArea";
import ChatTab from "../tabs/chat-tab";
import MembersTab from "../tabs/members-tab";
import QueueTab from "../tabs/queue-tab";
import SearchTab from "../tabs/search-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import useRoomMembersStore from "@/store/room-members";

const TABS = ["queue", "search", "chat", "members"];

export default function RoomTabs({roomId}: {roomId: string}) {
  const fetchRoomMembers = useRoomMembersStore().fetchRoomMembers;

  useEffect(() => {
    const initialize = async () => {
      await fetchRoomMembers(roomId);
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
