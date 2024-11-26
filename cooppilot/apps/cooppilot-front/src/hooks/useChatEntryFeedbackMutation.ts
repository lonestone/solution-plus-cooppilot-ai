import { AuthContext } from "@/auth/AuthProvider";
import { ChatEntryFeedback } from "@common/types/back/chat";
import { useContext } from "react";
import useSWRMutation from "swr/mutation";

async function fetcher(
  {
    url,
    token,
  }: {
    url: string;
    token: string;
  },
  {
    arg,
  }: {
    arg: {
      feedback: ChatEntryFeedback;
    };
  }
) {
  if (token == null) throw new Error("No token");

  const { feedback } = arg;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(feedback),
  });

  if (res.status !== 200 && res.status !== 201)
    throw new Error(await res.text());

  return res.status;
}

export const useChatEntryFeedbackMutation = ({
  projectSlug,
  chatEntryId,
}: {
  projectSlug: string | undefined;
  chatEntryId: number;
}) => {
  const { token } = useContext(AuthContext);

  return useSWRMutation(
    projectSlug == null || chatEntryId == null || token == null
      ? null
      : {
          url: `${
            import.meta.env.VITE_BACK_END_API_ENDPOINT
          }/ai/chat/_/${projectSlug}/${chatEntryId}/feedback`,
          token,
        },
    fetcher
  );
};
