import { useEffect, useState } from "react";

export type UsePermissionState = PermissionStatus["state"] | "loading";

export function useMicPermission() {
  const [state, setState] = useState<UsePermissionState>("loading");

  useEffect(() => {
    window.navigator.permissions.query({ name: "microphone" as any }).then(function (result: PermissionStatus) {
      setState(result.state);
    });
  }, []);

  const request = () => {
    if (state === "granted" || state === "denied") {
      return;
    }
    window.navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setState("granted");
      })
      .catch(function (err) {
        console.error("Microphone access error:", err);
        setState("denied");
      });
  };

  return {
    microphonePermission: state,
    requestMicrophone: request,
  };
}
