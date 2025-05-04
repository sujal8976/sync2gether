import { cn } from "@/lib/utils";
import MembersCard from "../cards/members-card";

export default function MembersTab({className}: {className?: string;}) {
    return(
        <div className={cn("w-full flex flex-col gap-2", className)}>
            {Array.from({length: 2}).map((_, i) => (
                <MembersCard key={i} />
            ))}
        </div>
    )
}