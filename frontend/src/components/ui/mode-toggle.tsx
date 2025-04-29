import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { useState } from "react";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const onClickChangeMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setTheme(newMode ? "dark" : "light");
  };

  return (
    <Button variant="outline" size="icon" onClick={() => onClickChangeMode()}>
      {isDarkMode ? (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      )}
    </Button>
  );
}
