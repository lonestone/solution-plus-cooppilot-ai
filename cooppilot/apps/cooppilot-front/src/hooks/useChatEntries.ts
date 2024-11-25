import { AuthContext } from "@/auth/AuthProvider";
import { useChatEntries as chatEntriesHook } from "@common/hooks/useChatEntries";
import { chatEntrySchema } from "@common/types/back/chat";
import { useContext } from "react";
import { z } from "zod";

const fetcher = async ({ url, token }: { url: string; token: string }) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return z.array(chatEntrySchema).parse(await res.json());
};

export const useChatEntries = ({
  projectSlug,
}: {
  projectSlug: string | undefined;
}) => {
  const { token } = useContext(AuthContext);

  return chatEntriesHook({
    key:
      projectSlug && token != null
        ? {
            url: `${
              import.meta.env.VITE_BACK_END_API_ENDPOINT
            }/ai/chat/_/${projectSlug}`,
            token,
          }
        : null,
    fetcher,
  });
};
