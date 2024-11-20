import { ChatEntry } from "@common/types/back/chat";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type ChatAnswerDetailsProps = {
  chatEntry: ChatEntry;
};

const ChatAnswerDetails = ({ chatEntry }: ChatAnswerDetailsProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const documents = useMemo(() => {
    if (!("response" in chatEntry)) return [];
    if (!("answer" in chatEntry.response)) return [];

    return Array.from(new Set(chatEntry.response.sources));
  }, [chatEntry]);

  const tools = useMemo(() => {
    if (!("response" in chatEntry)) return [];
    if (!("answer" in chatEntry.response)) return [];

    return chatEntry.response.used_tools.map((tool) => tool.split(":")[0]);
  }, [chatEntry]);

  if (documents.length <= 0 && tools.length <= 0) return null;

  return (
    <div className="flex flex-col gap-2 ml-[3.5rem]">
      <div
        className="flex flex-row items-center cursor-pointer text-muted-foreground/70 text-sm gap-1"
        onClick={() => setOpen(!open)}
      >
        <span>{t("Chat.details")}</span>
        <ChevronRight
          className={
            "h-4 w-4 transition-transform duration-300 transform " +
            (open ? "rotate-90" : "rotate-0")
          }
        />
      </div>
      <AnimatePresence mode="sync">
        {open && (
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            className="border-l-[1px] border-l-muted p-2 bg-muted/30 rounded-sm flex flex-col gap-4"
          >
            {documents.length > 0 && (
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-2">
                  <span>{t("Chat.sources")}</span>
                  <span className="text-muted-foreground/70">
                    {documents.length}
                  </span>
                </div>
                <div className="flex flex-col">
                  {documents.map((document) => (
                    <div
                      key={document}
                      className="flex flex-row items-center gap-2 rounded-md px-2 py-1 text-sm"
                    >
                      <span>- {document}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tools.length > 0 && (
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-2">
                  <span>{t("Chat.tools")}</span>
                  <span className="text-muted-foreground/70">
                    {tools.length}
                  </span>
                </div>
                <div className="flex flex-col">
                  {tools.map((tool) => (
                    <div
                      key={tool}
                      className="flex flex-row items-center gap-2 rounded-md px-2 py-1 text-sm"
                    >
                      <span>- {t("Chat.Tools." + tool)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatAnswerDetails;
