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

export default function JoinRoomDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="rounded-full w-[40%] mt-4 text-lg"
        >
          Join Room
        </Button>
      </DialogTrigger>
    </Dialog>
  );
}
