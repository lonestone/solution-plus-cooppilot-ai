import changelog from "@/assets/changelogs.json";
import ContentSection from "@/components/layouts/ContentSection";
import VersionCard from "@/components/molecules/VersionCard";
import { useMostVisibleElement } from "@/hooks/useMostVisibleElement";
import { createRef, useRef } from "react";
import { useTranslation } from "react-i18next";

export const News = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "News",
  });
  const refs = useRef(Array(changelog.versions.length).fill(createRef()));
  const { onScroll, mostVisibleElementRef } = useMostVisibleElement(
    refs.current
  );

  return (
    <div className="flex w-full h-full justify-center">
      <div className="w-full max-w-[1100px] flex flex-col h-full gap-10">
        <div className="flex flex-col justify-center gap-2">
          <span className="font-bold leading-tight text-5xl inline-block text-white">
            {t("title")}
          </span>
          <span className="text-gray">{t("desc")}</span>
        </div>
        <div className="w-full flex flex-col-reverse sm:flex-row overflow-hidden gap-4">
          <div
            className="flex flex-col gap-16 flex-grow overflow-auto"
            onScroll={onScroll}
          >
            {changelog.versions.map((version, index) => (
              <ContentSection
                key={version.version}
                title={version.version}
                desc={t("released", { date: version.date })}
                ref={(r) => (refs.current[index] = { current: r })}
                size="3xl"
              >
                <VersionCard
                  title={version.title}
                  categories={version.categories}
                />
              </ContentSection>
            ))}
          </div>
          <div className="flex flex-col gap-4 cursor-pointer">
            {changelog.versions.map((version, index) => (
              <div
                key={version.version}
                className={
                  mostVisibleElementRef === refs.current[index].current
                    ? "text-white"
                    : "text-gray-500"
                }
                onClick={() =>
                  refs.current[index].current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                {version.version}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
