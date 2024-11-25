import { useEffect } from "react";

import { LoaderCircleIcon, Mic2, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import useTalk from "@/hooks/audio/useTalk";
import usePrevious from "@/hooks/usePrevious";
import { useTranslation } from "react-i18next";

const WhisperRecorder = ({
  disabled = false,
  onTranscriptionReady,
}: {
  disabled?: boolean;
  onTranscriptionReady: (query?: string) => void;
}) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "ChatPromptInput",
  });

  // Microphone
  const { isTranscribing, transcript, start, stop, isStarted, isSpeaking, volumeHistory } = useTalk();
  const previousTranscript = usePrevious(transcript);

  useEffect(() => {
    if (transcript !== previousTranscript) {
      onTranscriptionReady(transcript);
    }
  }, [onTranscriptionReady, transcript, previousTranscript]);

  const renderTick = (value: number, index: number) => {
    const silenceThresold = 0.3;
    const colorClassName = value < 0 ? "bg-transparent" : value >= silenceThresold ? "bg-white" : "bg-gray-500";

    return (
      <div key={index} className={cn("flex flex-col justify-center w-full")}>
        <div className={cn("w-px", colorClassName)} style={{ height: `${Math.max(0.3, value ?? 0) * 100}%` }} />
      </div>
    );
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-row items-center">
          <div className={cn("transition-all duration-2000 ease-in-out overflow-hidden", isStarted ? "w-52" : "w-0")}>
            <div className={cn("flex flex-row rounded-3xl outline outline-1 m-1 p-1 outline-stone-700 bg-stone-900")}>
              <div className={cn("flex flex-row flex-nowrap gap-0.5 ps-2")}>{volumeHistory.map(renderTick)}</div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={stop}
                disabled={disabled}
                className={isSpeaking ? "border-primary" : ""}
              >
                <Square className={cn("size-5")} />
                <span className="sr-only">{t("stop")}</span>
              </Button>
            </div>
          </div>
          <div className={cn("transition-all duration-2000 ease-in-out overflow-hidden", isStarted ? "w-0" : "w-10")}>
            <Button type="button" variant="ghost" size="icon" onClick={start} disabled={disabled} className={""}>
              {!isTranscribing && <Mic2 className={cn("size-5")} />}
              {isTranscribing && <LoaderCircleIcon className="size-5 animate-spin" />}
              <span className="sr-only">{t("micTooltip")}</span>
            </Button>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">{t("micTooltip")}</TooltipContent>
    </Tooltip>
  );

  /*
  // Former UI
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={!recording ? startRecording : stopRecording}
          disabled={disabled}
          className={speaking ? "border-primary" : ""}
        >
          {!transcribing && <Mic2 className={cn("size-5", recording ? "stroke-primary animate-pulse" : "")} />}
          {transcribing && <LoaderCircleIcon className="size-5 animate-spin" />}
          <span className="sr-only">Use OpenAI Microphone</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">Use OpenAI Microphone</TooltipContent>
    </Tooltip>
  );
  */
};

export default WhisperRecorder;
