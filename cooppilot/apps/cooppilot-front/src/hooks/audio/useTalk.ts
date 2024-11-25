import { useCallback, useEffect, useRef, useState } from "react";

import {
  micAnalyser,
  startMicrophone,
  stopMicrophone,
} from "@/utils/audio/microphone";
import { useMicRecorder } from "./useMicRecorder";
import useTranscript from "./useTranscript";

export type UseTalkReturn = {
  isStarting: boolean;
  isStarted: boolean;
  isPaused: boolean;
  isSpeaking: boolean;
  isMicStarted: boolean;
  micThreshold: number;
  changeMicThreshold: (threshold: number) => void;
  start: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  transcript: string;
  isTranscribing: boolean;
  volumeHistory: number[];
};

export default function useTalk(): UseTalkReturn {
  // State
  const [transcript, setTranscript] = useState<string>("");
  const startTime = useRef(0);
  const micStream = useRef<MediaStream>();
  const [isMicStarted, setIsMicStarted] = useState(false);

  const defaultHistoryDepth = 5; // s
  const ticks =
    defaultHistoryDepth * (1 / (micAnalyser?.node?.smoothingTimeConstant ?? 1)); // 5 * 0.1s
  const defaultVolumeHistory = Array.from({ length: ticks }, (_) => -1);
  const [volumeHistory, setVolumeHistory] =
    useState<number[]>(defaultVolumeHistory);

  // Cleanup on unmount
  useEffect(
    () => () => {
      stop(true);
    },
    []
  );

  // Microphone
  const { micRecorder, micState } = useMicRecorder({
    async onChunk(blob) {
      // console.debug(`[Mic] onChunk`, blob);
      const localTranscript = await transcribeAudio(blob);
      if (localTranscript.length > 1) {
        setTranscript(localTranscript);
      }
      stop();
    },
    onStartSpeaking() {
      // console.debug("[Mic] onStartSpeaking");
    },
    onStopSpeaking() {
      // console.debug("[Mic] onSilence");
    },
  });

  const startMic = async (deviceId?: string) => {
    // Stop recorder if it was running
    const isRecorderStarted = micRecorder.state.isStarted;
    if (isRecorderStarted) {
      micRecorder.stop();
    }

    // Start microphone
    micStream.current = await startMicrophone(deviceId);
    setIsMicStarted(true);

    // Restart recorder if it was running
    if (isRecorderStarted) {
      await micRecorder.start(micStream.current);
    }
  };

  const changeMicThreshold = (threshold: number) => {
    micRecorder.setThreshold(threshold);
  };

  const { isTranscribing, transcribeAudio } = useTranscript();

  const start = async () => {
    if (!micStream.current) {
      await startMic();
    }

    startTime.current = Date.now();
    setTranscript("");
    setVolumeHistory(defaultVolumeHistory);

    try {
      // Start microphone
      if (!micRecorder.state.isStarted) {
        micRecorder.stop();
      }
      await micRecorder.start(micStream.current!);
    } catch (error) {
      stop();
      throw error;
    }
  };

  const stop = async (noState?: boolean) => {
    if (!noState) {
      //setTranscript("");
      setVolumeHistory(defaultVolumeHistory);
    }

    // Stop microphone
    if (micStream.current) {
      stopMicrophone();
      micStream.current = undefined;
      setIsMicStarted(false);
    }

    // Stop MicRecorder
    micRecorder.stop();
  };

  const resume = async () => {
    micRecorder.unmute();
  };

  const updateHistory = useCallback(
    (humanVolume: number) => {
      const newActivityHistory = [...volumeHistory];
      newActivityHistory.shift();
      newActivityHistory.push(humanVolume);
      setVolumeHistory(newActivityHistory);
    },
    [volumeHistory]
  );

  // Update volume
  useEffect(() => {
    const analyser = micAnalyser;
    if (!analyser) return;
    if (!micState.isStarted) return;
    const onVolumeChange = (volume: number) => {
      const humanVolume = Math.max(0, volume + 100) / 100;
      updateHistory(humanVolume);
    };
    analyser.on("volume", onVolumeChange);
    return () => {
      analyser.off("volume", onVolumeChange);
    };
  }, [micState.isStarted, updateHistory]);

  return {
    isStarting: micState.isStarting,
    isStarted: micState.isStarted,
    isSpeaking: micState.isSpeaking,
    isPaused: micState.isMuted,
    isMicStarted,
    micThreshold: micRecorder.state.threshold,
    changeMicThreshold,
    start,
    stop,
    pause: micRecorder.mute.bind(micRecorder),
    resume,
    transcript,
    isTranscribing,
    volumeHistory,
  };
}
