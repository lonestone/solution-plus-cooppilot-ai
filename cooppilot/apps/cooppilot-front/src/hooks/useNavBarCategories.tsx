import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  Megaphone
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type CategoryLink = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const useNavBarCategories = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "Sidebar.Categories",
  });

  const unnamedCategories = useMemo(() => {
    return [
      {
        links: [
          {
            name: t("whatsNew"),
            href: "/news",
            icon: <Megaphone className="size-5" />,
          },
          {
            name: t("help"),
            href: "/help",
            icon: <QuestionMarkCircledIcon className="size-5" />,
          },
        ],
      },
    ];
  }, [t]);

  return {
    unnamedCategories,
  };
};

export default useNavBarCategories;
