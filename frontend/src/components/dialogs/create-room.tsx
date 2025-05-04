import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function CreateRoomDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full flex mt-12 items-center justify-center w-[40%] text-lg">
          <Plus size={24} className="" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-[600px]">
      <DialogHeader >
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <form>

        </form>
      </DialogContent>
    </Dialog>
  );
}
