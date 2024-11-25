import { AuthProvider } from "@/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet, ScrollRestoration } from "react-router-dom";

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="cooppilot-ui-theme">
      <AuthProvider>
        <TooltipProvider>
          <Outlet />
          <Toaster />
          <ScrollRestoration />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
