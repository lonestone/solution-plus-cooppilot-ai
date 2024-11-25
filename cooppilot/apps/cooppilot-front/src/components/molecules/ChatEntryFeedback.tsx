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
import { cn } from "@/lib/utils";
import { ChatEntryFeedback as ChatEntryFeedbackType } from "@common/types/back/chat";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ChatEntryFeedbackProps = {
  projectSlug: string;
  chatEntryId: number;
  userFeedback?: ChatEntryFeedbackType;
  onFeedbackUpdated?: (feedback: ChatEntryFeedbackType) => void;
};

const ChatEntryFeedback = ({
  projectSlug,
  chatEntryId,
  userFeedback,
  onFeedbackUpdated,
}: ChatEntryFeedbackProps) => {
  const { t } = useTranslation();
  const { trigger } = useChatEntryFeedbackMutation({
    projectSlug,
    chatEntryId,
  });
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
      const res = await trigger({ feedback });
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
      <div className="flex flex-row items-center gap-2 rounded-2xl ml-[3.5rem]">
        <Button
          size="icon"
          variant={"ghost"}
          onClick={() =>
            feedback?.evaluation !== "POSITIVE" &&
            setFeedbackDialogState({
              open: true,
              type: "POSITIVE",
              comment: "",
            })
          }
        >
          <ThumbsUp
            className={cn(
              feedback?.evaluation === "POSITIVE"
                ? "text-green-400"
                : "text-stone-600 hover:text-stone-200"
            )}
          />
        </Button>
        <Button
          size="icon"
          variant={"ghost"}
          onClick={() =>
            feedback?.evaluation !== "NEGATIVE" &&
            setFeedbackDialogState({
              open: true,
              type: "NEGATIVE",
              comment: "",
            })
          }
        >
          <ThumbsDown
            className={cn(
              feedback?.evaluation === "NEGATIVE"
                ? " text-red-400"
                : " text-stone-600 hover:text-stone-200"
            )}
          />
        </Button>
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
          <DialogContent>
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
