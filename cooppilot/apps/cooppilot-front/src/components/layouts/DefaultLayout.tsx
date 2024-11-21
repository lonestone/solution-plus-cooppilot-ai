import { AuthContext } from "@/auth/AuthProvider";
import TopBar from "@/components/organisms/TopBar";
import NotLoggedIn from "@/pages/NotLoggedIn";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <NotLoggedIn />;
  }

  return (
    <div className="h-[calc(100dvh)] flex flex-col p-0 overflow-hidden bg-[radial-gradient(circle_33vw_at_top_right,#e2762294,transparent),radial-gradient(circle_33vw_at_bottom_left,#e2762266,transparent)]">
      <TopBar />
      <div className="px-3 pb-2 w-full h-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
