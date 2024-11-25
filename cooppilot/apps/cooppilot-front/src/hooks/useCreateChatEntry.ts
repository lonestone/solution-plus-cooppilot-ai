import { AuthContext } from "@/auth/AuthProvider";
import { chatEntrySchema } from "@common/types/back/chat";
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
  { arg: message }: { arg: string }
) {
  if (token == null) throw new Error("No token");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (res.status !== 201) throw new Error(await res.text());

  return chatEntrySchema.parse(await res.json());
}

export const useCreateChatEntry = ({
  projectSlug,
}: {
  projectSlug: string | undefined;
}) => {
  const { token } = useContext(AuthContext);

  return useSWRMutation(
    projectSlug == null || token == null
      ? null
      : {
          url: `${
            import.meta.env.VITE_BACK_END_API_ENDPOINT
          }/ai/chat/_/${projectSlug}/create`,
          token,
        },
    fetcher
  );
};
