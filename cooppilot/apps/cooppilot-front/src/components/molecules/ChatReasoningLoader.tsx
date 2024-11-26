import { ChatEntry } from "@common/types/back/chat";
import { Loader } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type ChatReasoningLoaderProps = {
  entry?: ChatEntry;
};

const ChatReasoningLoader = ({ entry }: ChatReasoningLoaderProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "Chat",
  });

  const text = useMemo(() => {
    if (!entry) return t("Chat.answerLoading");

    if ("response" in entry) {
      const actions = entry.response?.reasoning?.filter(
        (r) => r.type === "action"
      );

      if (actions.length <= 0) {
        return t("answerLoading");
      }

      const latestAction = actions[actions.length - 1];

      if ("action" in latestAction) {
        return t("Reasoning." + latestAction?.action);
      }
    }

    return t("answerLoading");
  }, [entry, t]);

  if (!entry || entry.queryStatus === "DONE" || entry.queryStatus === "ERROR")
    return null;

  return (
    <div className="flex flex-row items-center gap-2 mt-2">
      <Loader className="animate-spin text-primary" />
      <span className="text-xs">{text}</span>
    </div>
  );
};

export default ChatReasoningLoader;
