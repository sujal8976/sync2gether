import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export default function SearchCard() {
  return (
    <div className="dark:bg-zinc-800 w-full flex p-2 rounded-lg gap-1">
      <img
        className="w-[20%] min-w-19 h-[55px] md:h-15 object-cover rounded-sm"
        src="https://cdn.pixabay.com/photo/2024/01/10/06/50/pop-art-8499041_1280.jpg"
        alt=""
      />
      <div className="flex-1 flex flex-col h-[55px] md:h-15">
        <h3 className="truncate-text">
          asf fasf asf adf afafasfads asf asdfasf{" "}
        </h3>
        <p className="truncate-text text-sm">
          Channel: <span className="">user123</span>
        </p>
      </div>
      <div className="flex justify-center items-center">
        <Button>
          Add
          <Plus />
        </Button>
      </div>
    </div>
  );
}
