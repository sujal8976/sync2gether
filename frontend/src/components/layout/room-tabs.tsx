import { useEffect, useRef } from "react";
import TabsContentScrollArea from "../custom/tabsContents-scrollArea";
import ChatTab from "../tabs/chat-tab";
import MembersTab from "../tabs/members-tab";
import PlaylistTab from "../tabs/playlist-tab";
import SearchTab from "../tabs/search-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import useRoomMembersStore from "@/store/room-members";
import useChatsStore from "@/store/chat";
import { toast } from "sonner";
import usePlayerStore from "@/store/player";

const TABS = ["playlist", "search", "chat", "members"];

export default function RoomTabs({ roomId }: { roomId: string }) {
  const fetchRoomMembers = useRoomMembersStore().fetchRoomMembers;
  const clearAllMembers = useRoomMembersStore().clearAllMembers;
  const fetchChats = useChatsStore().fetchChats;
  const resetChatsStore = useChatsStore().resetChatsStore;
  const fetchPlaylist = usePlayerStore().fetchPlaylist;
  const pageRef = useRef(1); // for ChatTab

  useEffect(() => {
    const initialize = async () => {
      // for ChatTab
      pageRef.current = 1;

      try {
        await fetchPlaylist(roomId);
        await fetchRoomMembers(roomId);
        await fetchChats(roomId, pageRef.current, 30);
      } catch (error) {
        if (error instanceof Error)
          toast.error(error.message || "Failed to load room resources.");
        else toast.error("Failed to load room resources.");
      }
    };

    initialize();

    return () => {
      resetChatsStore();
      clearAllMembers();
    };
  }, [fetchRoomMembers]);

  return (
    <Tabs defaultValue="playlist" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {TABS.map((tab, i) => (
          <TabsTrigger key={i} className="capitalize" value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContentScrollArea value="playlist">
        <PlaylistTab />
      </TabsContentScrollArea>
      <TabsContentScrollArea value="search">
        <SearchTab />
      </TabsContentScrollArea>
      <TabsContent value="chat">
        <ChatTab pageRef={pageRef} roomId={roomId}/>
      </TabsContent>
      <TabsContentScrollArea value="members">
        <MembersTab />
      </TabsContentScrollArea>
    </Tabs>
  );
}
