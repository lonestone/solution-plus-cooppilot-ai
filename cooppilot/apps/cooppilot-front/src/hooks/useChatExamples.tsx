import { Drill, Files, Package, ShoppingCart, Users } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export type QuestionCategory = {
  title: string;
  icon: JSX.Element;
  examples: string[];
};

export const useChatExamples = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "NewChatHeader",
  });

  const questions: QuestionCategory[] = useMemo(() => {
    return [
      {
        title: t("Fragments.Questions.Orders.title"),
        icon: <ShoppingCart className="size-5" />,
        examples: [
          t("Fragments.Questions.Orders.Examples.1"),
          t("Fragments.Questions.Orders.Examples.2"),
        ],
      },
      {
        title: t("Fragments.Questions.Tools.title"),
        icon: <Drill className="size-5" />,
        examples: [
          t("Fragments.Questions.Tools.Examples.1"),
          t("Fragments.Questions.Tools.Examples.2"),
          t("Fragments.Questions.Tools.Examples.3"),
          t("Fragments.Questions.Tools.Examples.4"),
          t("Fragments.Questions.Tools.Examples.5"),
        ],
      },
      {
        title: t("Fragments.Questions.Stocks.title"),
        icon: <Package className="size-5" />,
        examples: [
          t("Fragments.Questions.Stocks.Examples.1"),
          t("Fragments.Questions.Stocks.Examples.2"),
        ],
      },
      {
        title: t("Fragments.Questions.People.title"),
        icon: <Users className="size-5" />,
        examples: [
          t("Fragments.Questions.People.Examples.1"),
          t("Fragments.Questions.People.Examples.2"),
        ],
      },
      {
        title: t("Fragments.Questions.Documents.title"),
        icon: <Files className="size-5" />,
        examples: [
          t("Fragments.Questions.Documents.Examples.1"),
          t("Fragments.Questions.Documents.Examples.2"),
        ],
      },
    ];
  }, [t]);

  return questions;
};
