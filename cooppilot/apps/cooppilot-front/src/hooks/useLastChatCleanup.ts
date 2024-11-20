import { AuthContext } from "@/auth/AuthProvider";
import { lastCleanupSchema } from "@/utils/types/lastCleanup";
import { useContext } from "react";
import useSWR from "swr";

export const useLastChatCleanup = (shouldFetch = true) => {
  const { userId: token } = useContext(AuthContext);

  return useSWR(
    shouldFetch && {
      url: `${
        import.meta.env.VITE_BACK_END_API_ENDPOINT
      }/ai/chat/clear/history`,
    },
    async ({ url }) => {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) throw new Error(await res.text());

      return lastCleanupSchema.parse(await res.json());
    }
  );
};
