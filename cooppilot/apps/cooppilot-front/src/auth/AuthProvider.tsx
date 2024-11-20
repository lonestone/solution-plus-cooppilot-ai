import useMe from "@/hooks/useMe";
import { nameGenerator } from "@/utils/nameGenerator";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export const AuthContext = createContext<AuthContextData>({
  isLoading: false,
  error: undefined,
  user: undefined,
  userId: "",
});

type AuthContextData = {
  isLoading: boolean;
  error: string | undefined;
  userId: string;
  user:
    | {
        id: string;
        name: string;
        email: string;
      }
    | undefined;
};

const localStorageItemKey = "x-user-id";
const localeItemKey = "x-locale";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState<string>(
    localStorage.getItem(localStorageItemKey) ?? nameGenerator() ?? ""
  );
  const { i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem(localStorageItemKey, userId);
  }, [userId]);

  useEffect(() => {
    const lsLocale = localStorage.getItem(localeItemKey) ?? "";

    if (lsLocale.length > 0) {
      i18n.changeLanguage(lsLocale);
    }
  }, [i18n]);

  useEffect(() => {
    const spUserId = (searchParams.get("user-id") ?? "").trim();
    const spLocale = (searchParams.get("locale") ?? "").trim();

    if (spLocale.length > 0) {
      i18n.changeLanguage(spLocale);
      localStorage.setItem(localeItemKey, spLocale);
      searchParams.delete("locale");
    }

    if (spUserId.length === 0) {
      return;
    }

    localStorage.setItem(localStorageItemKey, spUserId);
    searchParams.delete("user-id");
    setUserId(spUserId);
  }, [searchParams, i18n]);

  const { data: user, error, isLoading } = useMe(userId);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        error,
        user,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
