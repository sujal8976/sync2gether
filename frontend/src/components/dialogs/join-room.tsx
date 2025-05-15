import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";

export default function JoinRoomDialog({isLoading}: {isLoading: boolean}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={isLoading}
          variant={"outline"}
          className="rounded-full w-[40%] mt-4 text-lg"
        >
          Join Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        
      </DialogContent>
    </Dialog>
  );
}
