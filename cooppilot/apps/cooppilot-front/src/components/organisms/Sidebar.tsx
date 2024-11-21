import logo from "@/assets/logo.svg";
import AccountCard from "@/components/molecules/AccountCard";
import SidebarNavCategory from "@/components/molecules/SidebarNavCategory";
import useNavBarCategories from "@/hooks/useNavBarCategories";
import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "Sidebar",
  });
  const { unnamedCategories } = useNavBarCategories();

  return (
    <div className="flex flex-col w-80 h-full justify-between gap-8 items-start max-h-full overflow-y-auto overflow-x-hidden">
      <div className="rounded-2xl bg-card flex flex-col p-4 gap-8 w-full">
        <div className="flex flex-row w-full items-center justify-center pt-2">
          <img src={logo} alt="Logo" />
          <span className="text-white text-2xl ml-3">CoopIA</span>
        </div>
        <Link
          to="/chat"
          className="rounded-full justify-start flex flex-row items-center bg-gradient-to-r from-gradient-from to-gradient-to py-[0.7rem] text-gray-text text-sm"
        >
          <Bot className="size-5 ml-3 text-white" />
          <span className="ml-2 text-white">{t("talkWith")}</span>
        </Link>
        <div className="h-[1px] bg-gray opacity-50" />
        {unnamedCategories.map((category, index) => (
          <SidebarNavCategory key={index} links={category.links} />
        ))}
      </div>
      <div className="flex flex-col gap-8 w-full">
        <AccountCard />
      </div>
    </div>
  );
};

export default Sidebar;
