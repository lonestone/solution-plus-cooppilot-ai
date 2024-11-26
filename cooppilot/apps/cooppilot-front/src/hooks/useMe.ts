import useSWR from "swr";

const useMe = (token: string) => {
  return useSWR(
    `${import.meta.env.VITE_BACK_END_API_ENDPOINT}/auth/me`,
    async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACK_END_API_ENDPOINT}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) throw new Error(await res.text());

      return res.json();
    }
  );
};

export default useMe;
