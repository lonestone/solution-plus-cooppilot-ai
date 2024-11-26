import { AuthContext } from "@/auth/AuthProvider";
import { useChatEntryPolling as chatEntryHook } from "@common/hooks/useChatEntryPolling";
import { ChatEntry, chatEntrySchema } from "@common/types/back/chat";
import { useContext } from "react";

const URL = `${import.meta.env.VITE_BACK_END_API_ENDPOINT}/ai/chat/_`;

const fetcher =
  (token: string, projectId: string, chatId: number) => async () => {
    const res = await fetch(`${URL}/${projectId}/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return chatEntrySchema.parse(await res.json());
  };

export const useChatEntryPolling = ({
  active,
  projectId,
  chatId,
  cachedChatEntry,
}: {
  active: boolean;
  projectId: string;
  chatId: number;
  cachedChatEntry: ChatEntry | null;
}) => {
  const { token } = useContext(AuthContext);

  return chatEntryHook({
    key:
      token != null
        ? {
            url: URL,
            projectId,
            chatId,
          }
        : null,
    active,
    cachedChatEntry,
    fetcher: fetcher(token!, projectId, chatId),
  });
};
