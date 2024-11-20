import { useEffect, useState } from "react";
import { MicRecorder, defaultMicRecorderState } from "../../utils/audio/MicRecorder";

type Config = {
  onChunk(blob: Blob): void;
  onStartSpeaking(): void;
  onStopSpeaking(): void;
};

let micRecorder: MicRecorder | undefined;

export function useMicRecorder(props: Config) {
  const [state, setState] = useState(defaultMicRecorderState);

  // Instantiate MicRecorder only once
  if (!micRecorder) {
    micRecorder = new MicRecorder();
  }

  useEffect(() => {
    if (!micRecorder) return;
    micRecorder.on("Chunk", props.onChunk);
    micRecorder.on("StartSpeaking", props.onStartSpeaking);
    micRecorder.on("StopSpeaking", props.onStopSpeaking);
    micRecorder.on("StateChange", setState);

    // Cleanup on unmount
    return () => {
      if (!micRecorder) return;
      micRecorder.stop();
      micRecorder.removeAllListeners();
    };
  }, []);

  return {
    micRecorder,
    micState: state,
  };
}
