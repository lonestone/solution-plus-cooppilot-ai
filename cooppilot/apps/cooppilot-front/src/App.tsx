import { AuthProvider } from "@/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { Outlet, ScrollRestoration, useNavigate } from "react-router-dom";

export function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
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
