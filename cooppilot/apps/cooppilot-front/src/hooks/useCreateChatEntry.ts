import { AuthContext } from "@/auth/AuthProvider";
import { chatEntrySchema } from "@common/types/back/chat";
import { useContext } from "react";
import useSWRMutation from "swr/mutation";

const URL = `${import.meta.env.VITE_BACK_END_API_ENDPOINT}/ai/chat/create`;
const fetcher =
  (token: string) =>
  async (
    _: object,
    {
      arg,
    }: {
      arg: string;
    }
  ) => {
    const message = arg;
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (res.status !== 201) throw new Error(await res.text());

    return chatEntrySchema.parse(await res.json());
  };

export const useCreateChatEntry = () => {
  const { token: token } = useContext(AuthContext);

  return useSWRMutation({ key: URL }, fetcher(token));
};
