import ChatInput from "@/components/molecules/ChatInput";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ChangeEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

type ChatPromptInputProps = {
  sendMessage: (message: string) => Promise<void>;
};

const ChatPromptInput = ({ sendMessage }: ChatPromptInputProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "ChatPromptInput",
  });
  const [message, setMessage] = useState("");

  const onSubmit = async () => {
    if (message.trim() === "" || message.length < 2) return;

    await sendMessage(message);
    setMessage("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const onTranscriptionReady = (q?: string) => {
    if (!q) return;
    setMessage(q);
  };

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
    [setMessage]
  );

  return (
    <div className="flex flex-row items-center w-full rounded-3xl outline outline-1 p-1 outline-[rgba(255,255,255,0.16)] bg-card">
      <ChatInput
        placeholder={t("typeYourMessage")}
        value={message}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        className="w-full border-none focus-visible:ring-3 resize-none min-h-[2.5rem] h-[2.5rem] bg-[#f7f5f5]"
      />
      {/* <WhisperRecorder onTranscriptionReady={onTranscriptionReady} /> */}
      <Button
        size="icon"
        className="rounded-full h-10 w-10 text-white p-2 ml-2"
        disabled={message.trim() === ""}
        onClick={onSubmit}
      >
        {/* C'était pas aligné donc bon..... a méditer */}
        <Send className="translate-y-[1px] translate-x-[-1px]" />
      </Button>
    </div>
  );
};

export default ChatPromptInput;
