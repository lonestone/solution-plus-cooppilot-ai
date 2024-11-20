import { UnansweredQuestionAnswer } from "@/utils/types/questionsAnswers";
import { CircleHelp } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

type UnansweredQuestionCardProps = {
  question: UnansweredQuestionAnswer;
  onClick?: () => void;
};

const UnansweredQuestionCard = ({
  question,
  onClick,
}: UnansweredQuestionCardProps) => {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "Knowledge",
  });
  const rtf = useMemo(() => {
    return new Intl.RelativeTimeFormat(i18n.language, { style: "short" });
  }, [i18n.language]);

  const getNbDaysAgo = useCallback((dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.round(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diffInDays;
  }, []);

  const nbDaysAgo = getNbDaysAgo(question.createdAt);

  return (
    <div
      onClick={onClick}
      className={
        "flex h-full w-full flex-col gap-2 rounded-xl bg-stone-800 p-4" +
        (onClick ? " cursor-pointer hover:bg-stone-700" : "")
      }
    >
      <div className="flex flex-row items-center gap-4">
        <div className="flex justify-center items-center rounded-sm w-10 h-10 bg-stone-600">
          <CircleHelp className="text-white size-5" />
        </div>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="text-sm">{question.question}</div>
        <span className="text-xs mt-6 text-gray-text">
          {nbDaysAgo !== 0 && rtf.format(nbDaysAgo, "days")}
          {nbDaysAgo === 0 && t("today")}
        </span>
      </div>
    </div>
  );
};

export default UnansweredQuestionCard;
