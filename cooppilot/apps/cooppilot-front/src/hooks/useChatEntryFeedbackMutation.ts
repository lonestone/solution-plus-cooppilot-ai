import { AuthContext } from "@/auth/AuthProvider";
import { ChatEntryFeedback } from "@common/types/back/chat";
import { useContext } from "react";
import useSWRMutation from "swr/mutation";

const fetcher =
  (token: string) =>
  async (
    _: object,
    {
      arg,
    }: {
      arg: {
        chatEntryId: number;
        feedback: ChatEntryFeedback;
      };
    }
  ) => {
    const { chatEntryId, feedback } = arg;
    const URL = `${
      import.meta.env.VITE_BACK_END_API_ENDPOINT
    }/ai/chat/${chatEntryId}/feedback`;

    const res = await fetch(URL, {
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
  };

export const useChatEntryFeedbackMutation = (chatEntryId: number) => {
  const { userId: token } = useContext(AuthContext);

  return useSWRMutation(
    {
      key: `/ai/chat/${chatEntryId}/feedback`,
    },
    fetcher(token)
  );
};
