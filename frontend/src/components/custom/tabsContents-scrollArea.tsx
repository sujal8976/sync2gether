import { ReactNode } from "react";
import { TabsContent } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

interface TabsContentScrollAreaProps {
  children: ReactNode;
  value: string;
}

export default function TabsContentScrollArea({
  children,
  value,
}: TabsContentScrollAreaProps) {
  return (
    <TabsContent value={value}>
      <ScrollArea className="h-[390px] md:h-[610px]">{children}</ScrollArea>
    </TabsContent>
  );
}
