import { useContext, useState } from "react";

import { AuthContext } from "@/auth/AuthProvider";

const useTranscript = () => {
  const { userId: token } = useContext(AuthContext);

  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const transcribeAudio = async (audio: Blob): Promise<string> => {
    setIsTranscribing(true);
    const formData = new FormData();
    formData.append("audio", audio, `audio-${Date.now()}`); // Was strange to send a .wav with an non-matching mimeType

    let text = "";
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_END_API_ENDPOINT}/whisper/transcript`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload audio chunk");
      }

      text = await response.text();
    } catch (error) {
      console.error("Error uploading audio chunk:", error);
    }
    setIsTranscribing(false);
    return text;
  };

  return {
    isTranscribing,
    transcribeAudio,
  };
};

export default useTranscript;
