import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useHelpSections = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "Help",
  });

  const usecases = useMemo(() => {
    return {
      title: t("Usecases.title"),
      desc: t("Usecases.desc"),
      examples: [
        {
          title: t("Usecases.Examples.1.title"),
          desc: t("Usecases.Examples.1.desc"),
        },
        {
          title: t("Usecases.Examples.2.title"),
          desc: t("Usecases.Examples.2.desc"),
        },
        {
          title: t("Usecases.Examples.3.title"),
          desc: t("Usecases.Examples.3.desc"),
        },
        {
          title: t("Usecases.Examples.4.title"),
          desc: t("Usecases.Examples.4.desc"),
        },
      ],
    };
  }, [t]);

  const features = useMemo(() => {
    return {
      title: t("Features.title"),
      desc: t("Features.desc"),
      examples: [
        {
          title: t("Features.Examples.1.title"),
          desc: t("Features.Examples.1.desc"),
        },
        {
          title: t("Features.Examples.2.title"),
          desc: t("Features.Examples.2.desc"),
        },
        {
          title: t("Features.Examples.3.title"),
          desc: t("Features.Examples.3.desc"),
        },
        {
          title: t("Features.Examples.4.title"),
          desc: t("Features.Examples.4.desc"),
        },
      ],
    };
  }, [t]);

  const privacy = useMemo(() => {
    return {
      title: t("Privacy.title"),
      desc: t("Privacy.desc"),
      examples: [
        {
          title: t("Privacy.Examples.1.title"),
          desc: t("Privacy.Examples.1.desc"),
        },
        {
          title: t("Privacy.Examples.2.title"),
          desc: t("Privacy.Examples.2.desc"),
        },
        {
          title: t("Privacy.Examples.3.title"),
          desc: t("Privacy.Examples.3.desc"),
        },
        {
          title: t("Privacy.Examples.4.title"),
          desc: t("Privacy.Examples.4.desc"),
        },
      ],
    };
  }, [t]);

  const experimentalMode = useMemo(() => {
    return {
      title: t("ExpMode.title"),
      desc: t("ExpMode.desc"),
      examples: [
        {
          title: t("ExpMode.Examples.1.title"),
          desc: t("ExpMode.Examples.1.desc"),
        },
        {
          title: t("ExpMode.Examples.2.title"),
          desc: t("ExpMode.Examples.2.desc"),
        },
        {
          title: t("ExpMode.Examples.3.title"),
          desc: t("ExpMode.Examples.3.desc"),
        },
        {
          title: t("ExpMode.Examples.4.title"),
          desc: t("ExpMode.Examples.4.desc"),
        },
      ],
    };
  }, [t]);

  return {
    usecases,
    features,
    privacy,
    experimentalMode,
  };
};
