import { AuthContext } from "@/auth/AuthProvider";
import { useLastChatCleanup } from "@/hooks/useLastChatCleanup";
import { useContext } from "react";
import useSWRMutation from "swr/mutation";

export const useLastChatCleanupMutation = () => {
  const { token: token } = useContext(AuthContext);
  const { mutate } = useLastChatCleanup(false);

  return useSWRMutation(
    {
      url: `${
        import.meta.env.VITE_BACK_END_API_ENDPOINT
      }/ai/chat/clear/history`,
    },
    async ({ url }) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200 && res.status !== 201)
        throw new Error(await res.text());
    },
    {
      onSuccess: () => {
        mutate();
      },
    }
  );
};
