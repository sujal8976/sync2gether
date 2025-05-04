import { ReactNode } from "react";
import { ThemeProvider } from "./components/ui/theme-provider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <div className="w-screen h-[100svh] flex flex-col p-3 gap-3">{children}</div>
        <Toaster richColors/>
      </BrowserRouter>
    </ThemeProvider>
  );
}
