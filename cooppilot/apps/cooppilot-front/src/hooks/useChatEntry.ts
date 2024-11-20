import { AuthContext } from "@/auth/AuthProvider";
import { useChatEntryPolling as chatEntryHook } from "@common/hooks/useChatEntryPolling";
import { ChatEntry, chatEntrySchema } from "@common/types/back/chat";
import { useContext } from "react";

const URL = `${import.meta.env.VITE_BACK_END_API_ENDPOINT}/ai/chat`;

const fetcher = (token: string, chatId: number) => async () => {
  const res = await fetch(`${URL}/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return chatEntrySchema.parse(await res.json());
};

export const useChatEntryPolling = ({
  active,
  chatId,
  cachedChatEntry,
}: {
  active: boolean;
  chatId: number;
  cachedChatEntry: ChatEntry | null;
}) => {
  const { userId: token } = useContext(AuthContext);

  return chatEntryHook({
    key: {
      url: URL,
      chatId,
    },
    active,
    cachedChatEntry,
    fetcher: fetcher(token, chatId),
  });
};
