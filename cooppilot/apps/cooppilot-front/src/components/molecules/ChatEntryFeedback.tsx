import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useChatEntryFeedbackMutation } from "@/hooks/useChatEntryFeedbackMutation";
import { ChatEntryFeedback as ChatEntryFeedbackType } from "@common/types/back/chat";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ChatEntryFeedbackProps = {
  chatEntryId: number;
  userFeedback?: ChatEntryFeedbackType;
  onFeedbackUpdated?: (feedback: ChatEntryFeedbackType) => void;
};

const ChatEntryFeedback = ({
  chatEntryId,
  userFeedback,
  onFeedbackUpdated,
}: ChatEntryFeedbackProps) => {
  const { t } = useTranslation();
  const { trigger } = useChatEntryFeedbackMutation(chatEntryId);
  const [feedback, setFeedback] = useState<ChatEntryFeedbackType | undefined>(
    userFeedback
  );
  const { toast } = useToast();
  const [feedbackDialogState, setFeedbackDialogState] = useState<{
    open: boolean;
    type: ChatEntryFeedbackType["evaluation"];
    comment: string;
  }>({
    open: false,
    type: undefined,
    comment: "",
  });

  const onEvaluationSent = async () => {
    const feedback = {
      evaluation: feedbackDialogState.type,
      comment: feedbackDialogState.comment,
    };

    try {
      const res = await trigger({
        chatEntryId,
        feedback,
      });
      setFeedback(feedback);
      setFeedbackDialogState({
        open: false,
        type: undefined,
        comment: "",
      });
      if (res === 201) {
        toast({
          title: t("Chat.Feedback.sentDesc"),
          description: t("Chat.Feedback.createdSuccessfully"),
        });
      } else {
        toast({
          title: t("Chat.Feedback.sentDesc"),
          description: t("Chat.Feedback.updatedSuccessfully"),
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t("Toast.errorTitle"),
        description: t("Toast.errorDesc"),
        variant: "destructive",
      });
    }

    if (onFeedbackUpdated) onFeedbackUpdated(feedback);
  };

  return (
    <>
      <div className="flex flex-row items-center gap-2 rounded-2xl bg-stone-800 p-2 px-3 ml-[3.5rem]">
        <ThumbsUp
          onClick={() =>
            feedback?.evaluation !== "POSITIVE" &&
            setFeedbackDialogState({
              open: true,
              type: "POSITIVE",
              comment: "",
            })
          }
          className={
            " size-4 cursor-pointer" +
            (feedback?.evaluation === "POSITIVE"
              ? " text-green-400"
              : " text-stone-600 hover:text-stone-200")
          }
        />
        <ThumbsDown
          onClick={() =>
            feedback?.evaluation !== "NEGATIVE" &&
            setFeedbackDialogState({
              open: true,
              type: "NEGATIVE",
              comment: "",
            })
          }
          className={
            "size-4 cursor-pointer" +
            (feedback?.evaluation === "NEGATIVE"
              ? " text-red-400"
              : " text-stone-600 hover:text-stone-200")
          }
        />
      </div>
      {feedbackDialogState.open && (
        <Dialog
          open={feedbackDialogState.open}
          onOpenChange={() =>
            setFeedbackDialogState({
              open: false,
              type: undefined,
              comment: "",
            })
          }
        >
          <DialogContent className="dark:bg-stone-800 bg-stone-800">
            <DialogHeader>
              <DialogTitle>{t(`Chat.Feedback.title`)}</DialogTitle>
              <DialogDescription>
                {t(`Chat.Feedback.${feedbackDialogState.type}.desc`)}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Textarea
                placeholder={t("Chat.Feedback.commentPlaceholder")}
                value={feedbackDialogState.comment}
                className="border-stone-600"
                onChange={(e) =>
                  setFeedbackDialogState({
                    ...feedbackDialogState,
                    comment: e.target.value,
                  })
                }
              />
            </div>
            <DialogFooter>
              <Button
                className="w-full flex justify-center gap-2"
                onClick={onEvaluationSent}
              >
                {feedbackDialogState.type === "POSITIVE" ? (
                  <ThumbsUp className="size-5" />
                ) : (
                  <ThumbsDown className="size-5" />
                )}
                {t(`Chat.Feedback.${feedbackDialogState.type}.submit`)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ChatEntryFeedback;
