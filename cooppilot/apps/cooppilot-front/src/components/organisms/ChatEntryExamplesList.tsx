import { ChatEntryExamples, Entry } from "@/pages/Chat";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ContentSection from "../layouts/ContentSection";
import UsageExamples from "../molecules/UsageExamples";

const isChatEntryExamples = (
  chatEntry: Entry
): chatEntry is ChatEntryExamples => {
  return (chatEntry as ChatEntryExamples).examples != null;
};

type ChatEntryExamplesListProps = {
  entries: Entry[];
  onExampleClick: (example: string) => void;
  onLoaded: () => void;
};

const ChatEntryExamplesList = ({
  entries,
  onExampleClick,
  onLoaded,
}: ChatEntryExamplesListProps) => {
  const { t } = useTranslation();

  const chatEntryExamples = useMemo(
    () => entries?.find(isChatEntryExamples),
    [entries]
  );

  const hasExamples = chatEntryExamples?.examples?.length ?? 0 > 0;

  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  if (!hasExamples) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <ContentSection
          title={t("Help.Questions.title")}
          desc={t("Help.Questions.desc")}
          size="3xl"
        >
          <div className="flex flex-col gap-4">
            {chatEntryExamples?.examples.map((example) => {
              return (
                <UsageExamples
                  key={example.title}
                  icon={example.icon}
                  title={example.title}
                  onExampleClick={onExampleClick}
                  examples={example.examples}
                />
              );
            })}
          </div>
        </ContentSection>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatEntryExamplesList;
