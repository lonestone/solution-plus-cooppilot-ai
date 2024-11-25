import ContentSection from "@/components/layouts/ContentSection";
import HelpCard from "@/components/molecules/HelpCard";
import { useHelpSections } from "@/hooks/useHelpSections";
import { useMostVisibleElement } from "@/hooks/useMostVisibleElement";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export const Help = () => {
  const { t } = useTranslation();
  const { usecases, features, privacy, experimentalMode } = useHelpSections();
  const useCasesRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const privacyRef = useRef<HTMLDivElement>(null);
  const experimentalModeRef = useRef<HTMLDivElement>(null);
  const { onScroll, mostVisibleElementRef } = useMostVisibleElement([
    useCasesRef,
    questionsRef,
    featuresRef,
    privacyRef,
    experimentalModeRef,
  ]);

  return (
    <div className="flex w-full h-full justify-center">
      <div className="w-full max-w-[1100px] flex flex-col h-full gap-10">
        <div className="flex flex-col justify-center gap-2">
          <span className="font-bold leading-tight text-5xl inline-block text-white">
            {t("Help.title")}
          </span>
          <span className="text-gray">{t("Help.desc")}</span>
        </div>
        <div className="w-full flex flex-col-reverse sm:flex-row overflow-hidden gap-4">
          <div
            className="flex flex-col gap-20 flex-grow overflow-auto"
            onScroll={onScroll}
          >
            <ContentSection
              title={t("Help.Usecases.title")}
              desc={t("Help.Usecases.desc")}
              ref={useCasesRef}
            >
              <div className="flex flex-col gap-4">
                {usecases.examples.map((usecase, index) => (
                  <HelpCard
                    key={usecases.title + index}
                    title={usecase.title}
                    desc={usecase.desc}
                  />
                ))}
              </div>
            </ContentSection>
            <ContentSection
              title={t("Help.Features.title")}
              desc={t("Help.Features.desc")}
              ref={featuresRef}
            >
              <div className="flex flex-col gap-4">
                {features.examples.map((feature, index) => (
                  <HelpCard
                    key={features.title + index}
                    title={feature.title}
                    desc={feature.desc}
                  />
                ))}
              </div>
            </ContentSection>
            <ContentSection
              title={t("Help.Privacy.title")}
              desc={t("Help.Privacy.desc")}
              ref={privacyRef}
            >
              <div className="flex flex-col gap-4">
                {privacy.examples.map((p, index) => (
                  <HelpCard
                    key={privacy.title + index}
                    title={p.title}
                    desc={p.desc}
                  />
                ))}
              </div>
            </ContentSection>
            <ContentSection
              title={t("Help.ExpMode.title")}
              desc={t("Help.ExpMode.desc")}
              ref={experimentalModeRef}
            >
              <div className="flex flex-col gap-4">
                {experimentalMode.examples.map((em, index) => (
                  <HelpCard
                    key={experimentalMode.title + index}
                    title={em.title}
                    desc={em.desc}
                  />
                ))}
              </div>
            </ContentSection>
          </div>
          <div className="flex flex-col gap-4 cursor-pointer">
            <div
              className={
                mostVisibleElementRef !== useCasesRef.current
                  ? "opacity-40"
                  : undefined
              }
              onClick={() =>
                useCasesRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("Help.Usecases.title")}
            </div>
            <div
              className={
                mostVisibleElementRef !== featuresRef.current
                  ? "opacity-40"
                  : undefined
              }
              onClick={() =>
                featuresRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("Help.Features.title")}
            </div>
            <div
              className={
                mostVisibleElementRef !== privacyRef.current
                  ? "opacity-40"
                  : undefined
              }
              onClick={() =>
                privacyRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("Help.Privacy.title")}
            </div>
            <div
              className={
                mostVisibleElementRef !== experimentalModeRef.current
                  ? "opacity-40"
                  : undefined
              }
              onClick={() =>
                experimentalModeRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              {t("Help.ExpMode.title")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
