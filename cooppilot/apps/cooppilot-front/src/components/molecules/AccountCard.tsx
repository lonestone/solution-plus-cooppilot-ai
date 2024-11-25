import { AuthContext } from "@/auth/AuthProvider";
import { useContext } from "react";

const AccountCard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="rounded-2xl bg-card flex flex-row p-4 gap-3 w-full">
      <div className="flex flex-col w-full justify-center h-full items-center">
        <div className="flex flex-col w-full">
          <div className="text-white text-md font-semibold bg-clip-text">
            {user.name}
          </div>
          <span className="text-gray max-w-full text-sm text-ellipsis overflow-hidden">
            {user.email}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
