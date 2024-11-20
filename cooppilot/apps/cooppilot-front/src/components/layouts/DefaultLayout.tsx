import { AuthContext } from "@/auth/AuthProvider";
import Sidebar from "@/components/organisms/Sidebar";
import TopBar from "@/components/organisms/TopBar";
import NotLoggedIn from "@/pages/NotLoggedIn";
import { useContext, useMemo } from "react";
import { Outlet } from "react-router-dom";
import useBreakpoint from "use-breakpoint";

const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
};

const DefaultLayout = () => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "mobile");
  const { userId: token } = useContext(AuthContext);

  const layout = useMemo(() => {
    if (!token) {
      return <NotLoggedIn />;
    }

    if (breakpoint === "mobile") {
      return (
        <div className="h-[calc(100dvh)] flex flex-col p-0 overflow-hidden">
          <TopBar />
          <div className="px-3 pb-2 w-full h-full overflow-hidden">
            <Outlet />
          </div>
        </div>
      );
    }

    return (
      <div className="h-[calc(100dvh)] flex flex-row p-6 overflow-hidden">
        <Sidebar />
        <div className="p-4 w-full h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    );
  }, [breakpoint, token]);

  return layout;
};

export default DefaultLayout;
