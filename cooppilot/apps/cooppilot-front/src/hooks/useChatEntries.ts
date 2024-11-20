import { AuthContext } from "@/auth/AuthProvider";
import { useChatEntries as chatEntriesHook } from "@common/hooks/useChatEntries";
import { chatEntrySchema } from "@common/types/back/chat";
import { useContext } from "react";
import { z } from "zod";

const URL = `${import.meta.env.VITE_BACK_END_API_ENDPOINT}/ai/chat`;

const fetcher = (token: string) => async () => {
  const res = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return z.array(chatEntrySchema).parse(await res.json());
};

export const useChatEntries = (shouldFetch = true) => {
  const { userId: token } = useContext(AuthContext);

  return chatEntriesHook({
    key: shouldFetch
      ? {
          url: URL,
        }
      : null,
    fetcher: fetcher(token),
  });
};
