import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import SearchCard from "../cards/search-card";

export default function SearchTab({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <Input placeholder="Paste Video URL or Search Video" />
        <Button size={"icon"}>
          <Search />
        </Button>
      </div>

      {Array.from({ length: 20 }).map((_, i) => {
        return <SearchCard key={i} />;
      })}
    </div>
  );
}
