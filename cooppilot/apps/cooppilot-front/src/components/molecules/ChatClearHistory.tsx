import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ChatClearHistoryProps = {
  onDeleteConfirm: () => void;
};

const ChatClearHistory = ({ onDeleteConfirm }: ChatClearHistoryProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onDeleteConfirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-stone-800 flex flex-row px-4 py-1.5 gap-2 items-center justify-center">
          <Trash2 className="size-4" />
          <span className=" text-sm text-stone-50">
            {t("Chat.clearConversation")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] dark:bg-stone-800 bg-stone-800">
        <DialogHeader>{t("Chat.clearConversation")}</DialogHeader>
        <DialogTitle className="text-sm text-stone-50">
          {t("Chat.clearConversationDesc")}
        </DialogTitle>
        <DialogFooter>
          <Button
            onClick={handleConfirm}
            className="rounded-2xl w-full flex flex-row px-4 py-1.5 gap-2 items-center justify-center"
          >
            {t("Chat.clearConversation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatClearHistory;
