import { AuthContext } from "@/auth/AuthProvider";
import ContentSection from "@/components/layouts/ContentSection";
import FirstStepCard from "@/components/molecules/FirstStepCard";
import UsageExamples from "@/components/molecules/UsageExamples";
import { useChatExamples } from "@/hooks/useChatExamples";
import { CloudCog, FileSearch, MessageSquare } from "lucide-react";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

type NewChatHeaderProps = {
  onExampleClick: (example: string) => void;
};

const NewChatHeader = ({ onExampleClick }: NewChatHeaderProps) => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation("translation", {
    keyPrefix: "NewChatHeader",
  });

  const steps = useMemo(() => {
    return [
      {
        desc: t("Fragments.FirstSteps.Steps.1"),
        icon: <CloudCog className="size-5" />,
        onDiscoverClick: () => {},
      },
      {
        desc: t("Fragments.FirstSteps.Steps.2"),
        icon: <FileSearch className="size-5" />,
        onDiscoverClick: () => {},
      },
      {
        desc: t("Fragments.FirstSteps.Steps.3"),
        icon: <MessageSquare className="size-5" />,
        onDiscoverClick: () => {},
      },
    ];
  }, [t]);

  const questions = useChatExamples();

  return (
    <div className="flex-grow flex flex-col gap-1 pt-6 md:pt-0 px-4 sm:px-6 lg:px-20 overflow-auto h-full">
      <span className="font-bold text-7xl bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text inline-block text-transparent mb-10">
        {t("title", { name: user?.name?.split(" ")[0] })}
      </span>
      <div className="flex flex-col gap-20" id="list-view">
        <ContentSection title={t("Fragments.FirstSteps.title")}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {steps.map((step) => (
              <FirstStepCard
                key={step.desc}
                desc={step.desc}
                icon={step.icon}
                onDiscoverClick={step.onDiscoverClick}
              />
            ))}
          </div>
        </ContentSection>
        <ContentSection title={t("Fragments.Questions.title")}>
          <div className="flex flex-col gap-10">
            {questions.map((question) => (
              <UsageExamples
                key={question.title}
                icon={question.icon}
                title={question.title}
                onExampleClick={onExampleClick}
                examples={question.examples}
              />
            ))}
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default NewChatHeader;
