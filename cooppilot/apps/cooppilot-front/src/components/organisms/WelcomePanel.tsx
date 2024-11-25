import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, HandIcon, PointerIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type AgentInfo = {
  projectSlug: string;
  description: string;
};

// TODO update agent project slugs
const agentProjectSlugs = [
  "agent-formation",
  "next-2",
  "next-3",
  "next-4",
  "next-5",
];

export function WelcomePanel({
  projectSlug,
  question,
  hidden,
  onProjectSelect,
  onProjectClear,
  onQuestionSelect,
}: {
  projectSlug: string | undefined;
  question: string | undefined;
  hidden: boolean;
  onProjectSelect: (projectSlug: string) => void;
  onProjectClear: () => void;
  onQuestionSelect: (question: string) => void;
}) {
  const { t } = useTranslation("translation", {
    keyPrefix: "Welcome",
  });

  const agentInfos: AgentInfo[] = useMemo(
    () =>
      agentProjectSlugs.map((projectSlug) => ({
        projectSlug,
        description: t(`agents.${projectSlug}.description`),
      })),
    [t]
  );

  const questions: string[] = useMemo(() => {
    if (projectSlug == null) return [];
    const qs = t(`agents.${projectSlug}.questions`, {
      returnObjects: true,
    });
    return Array.isArray(qs)
      ? qs.filter((q): q is string => typeof q === "string")
      : [];
  }, [projectSlug, t]);

  return (
    <div className="relative w-full">
      <div className="relative mx-auto max-w-[932px]  z-10">
        <div
          className={cn(
            "sticky group",
            "my-2 lg:my-4",
            "transition-opacity data-[state=open]:opacity-0 data-[state=closed]:opacity-100"
          )}
          data-state={question == null && !hidden ? "open" : "closed"}
        >
          <Button
            className="rounded-full size-16 bg-gradient-to-r from-[#C43437] to-[#ECBF30]"
            onClick={onProjectClear}
          >
            <HandIcon className="!size-8 group-data-[state=closed]:wave" />
            {/* <div className="text-[40px]">👋🏾</div> */}
          </Button>
        </div>
        <div
          className={cn(
            "absolute w-full",
            "my-12 lg:my-24 flex flex-col gap-10",
            "transition-opacity data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
          )}
          data-state={question == null && !hidden ? "open" : "closed"}
        >
          <div className="text-3xl lg:text-6xl leading-[125%]">
            <div className="font-bold inline-block bg-gradient-to-r from-[#C73C37] to-[#EDC642] text-transparent bg-clip-text">
              {t("title")}
            </div>
            <div className="font-semibold">{t("subTitle")}</div>
          </div>
          <div
            className="flex flex-col gap-4 group/step"
            data-step={projectSlug == null ? 0 : 1}
          >
            <div className="text-xl lg:text-3xl relative">
              <div className="opacity-0 pointer-events-none gap-4">
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full mr-4"
                >
                  <ChevronLeftIcon />
                </Button>
                {t("selectAgent")}
              </div>
              <div
                className={cn(
                  "absolute top-0 left-0 transition-opacity opacity-0",
                  "group-data-[step='0']/step:opacity-100"
                )}
                data-active={projectSlug == null}
                data-size="large"
              >
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full mr-4 opacity-0 pointer-events-none"
                >
                  <ChevronLeftIcon />
                </Button>
                {t("selectAgent")}
              </div>
              <div
                className={cn(
                  "absolute top-0 left-0 transition-opacity opacity-0",
                  "group-data-[step='1']/step:opacity-100"
                )}
                data-active={projectSlug != null}
              >
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full mr-4"
                  onClick={() => onProjectClear()}
                >
                  <ChevronLeftIcon />
                </Button>
                {t("selectQuestion")}
              </div>
            </div>

            <div className="relative overflow-hidden h-[176px]">
              <div
                className={cn(
                  "h-full",
                  "relative top-0",
                  "transition-[top] ease-in-out delay-150 duration-300",
                  "group-data-[step='1']/step:-top-[100%]",
                  "flex flex-col [&>div]:flex-[0_0_100%]"
                )}
              >
                <Carousel orientation="horizontal">
                  <CarouselContent className="-ml-2">
                    {agentInfos.map((agentInfo) => (
                      <CarouselItem
                        key={agentInfo.projectSlug}
                        className="pl-2 basis-1/5"
                      >
                        <WelcomeButton
                          label={agentInfo.description}
                          onClick={() => onProjectSelect(agentInfo.projectSlug)}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                <Carousel orientation="horizontal">
                  <CarouselContent className="-ml-2">
                    {questions.map((question, index) => (
                      <CarouselItem key={index} className="pl-2 basis-1/5">
                        <WelcomeButton
                          label={question}
                          onClick={() => onQuestionSelect(question)}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>

            <div
              className={cn(
                "transition-opacity opacity-0 delay-0",
                "group-data-[step='1']/step:opacity-100",
                "group-data-[step='1']/step:delay-1000",
                "flex gap-4 text-lg justify-center py-10"
              )}
              data-active={projectSlug != null}
            >
              {t("orTypeYourQuestion")}
              <PointerIcon className="rotate-180" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WelcomeButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="secondary"
      className="size-44 rounded-xl font-normal text-md whitespace-normal text-left p-8 hover:bg-gradient-to-br hover:from-[#FFDCDA] hover:to-[#FFE0CA]"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
