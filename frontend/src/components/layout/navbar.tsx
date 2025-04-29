import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import api from "@/services/api";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useUserStore } from "@/store/user";

export default function Navbar() {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const removeUser = useUserStore().removeUser;
  const getUser = useUserStore().getUser;

  const isAuthenticated = !!getUser();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      removeUser();
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data?.message || "Logout failed");
      else toast.error("something went wrong");
    }
  };

  return (
    <nav className="flex justify-center items-center border-b-2">
      <div className="w-[90%] flex justify-end items-center py-4">
        <div className="flex gap-4 justify-center items-center">
          {pathname === "/auth/signup" && !isAuthenticated && (
            <Button className="text-md" onClick={() => navigate("/auth/login")}>
              Login
            </Button>
          )}
          {pathname === "/auth/login" && !isAuthenticated && (
            <Button
              className="text-md"
              onClick={() => navigate("/auth/signup")}
            >
              Sign Up
            </Button>
          )}
          {isAuthenticated && (
            <Button className="text-md" onClick={logout}>
              Log Out
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
