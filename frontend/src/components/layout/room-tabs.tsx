import TabsContentScrollArea from "../custom/tabsContents-scrollArea";
import ChatTab from "../tabs/chat-tab";
import MembersTab from "../tabs/members-tab";
import QueueTab from "../tabs/queue-tab";
import SearchTab from "../tabs/search-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const TABS = ["queue", "search", "chat", "members"];
const TABSCONTENT = [
  { value: "queue", component: <QueueTab /> },
  { value: "search", component: <SearchTab /> },
  // { value: "chat", component: <ChatTab /> },
  { value: "members", component: <MembersTab /> },
];

export default function RoomTabs() {
  return (
    <Tabs defaultValue="queue" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {TABS.map((tab, i) => (
          <TabsTrigger key={i} className="capitalize" value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      {TABSCONTENT.map((tabCon, i) => (
        <TabsContentScrollArea key={i} value={tabCon.value}>
          {tabCon.component}
        </TabsContentScrollArea>
      ))}
      <TabsContent value="chat">
        <ChatTab />
      </TabsContent>
    </Tabs>
  );
}
