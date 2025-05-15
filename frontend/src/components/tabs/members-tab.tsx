import { cn } from "@/lib/utils";
import MembersCard from "../cards/members-card";
import useRoomMembersStore from "@/store/room-members";
import useRoomStore from "@/store/room";

export default function MembersTab({ className }: { className?: string }) {
  const roomMembers = useRoomMembersStore().roomMembers;
  const roomHostId = useRoomStore().getRoom()?.roomHost;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {roomMembers.map((member) => {
        const isHost = roomHostId === member.userId;
        return (
          <MembersCard
            key={member.userId}
            isHost={isHost}
            username={member.username}
            isOnline={member.isOnline}
          />
        );
      })}
    </div>
  );
}
