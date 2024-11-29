import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, HomeIcon, PointerIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export function WelcomePanel({
  agentId,
  hidden,
  onAgentSelect,
  onAgentClear,
  onQuestionSelect,
}: {
  agentId: string | undefined;
  hidden: boolean;
  onAgentSelect: (agentId: string) => void;
  onAgentClear: () => void;
  onQuestionSelect: (question: string) => void;
}) {
  const { t } = useTranslation("translation", {
    keyPrefix: "Welcome",
  });

  const agents = useMemo(() => {
    const data = z
      .record(
        z.string(),
        z.object({ description: z.string(), questions: z.array(z.string()) })
      )
      .parse(t("agents", { returnObjects: true }));

    return Object.entries(data).map(([agentId, info]) => ({
      agentId,
      ...info,
    }));
  }, [t]);

  const agent = useMemo(() => {
    if (agentId == null) return null;
    return agents.find((ai) => ai.agentId === agentId);
  }, [agentId, agents]);

  const debouncedAgentLabel = useDebounceValue(agent?.description, 0, 500);

  const questions: string[] | null = useMemo(() => {
    if (agent == null) return null;
    return agent?.questions ?? [];
  }, [agent]);

  const debouncedQuestions = useDebounceValue(questions, 0, 500);

  const [question, setQuestion] = useState<string>();
  useEffect(() => setQuestion(undefined), [agentId]);

  return (
    <div className="relative w-full">
      <div className="relative mx-auto max-w-[932px] z-10">
        <div
          className={cn(
            "absolute w-full",
            "group",
            "mt-0 lg:mt-2 2xl:mt-4",
            "transition-opacity data-[state=open]:opacity-0 data-[state=closed]:opacity-100"
          )}
          data-state={question == null && !hidden ? "open" : "closed"}
        >
          <Button
            className="rounded-b-full lg:rounded-full h-12 bg-gradient-to-r from-[#C43437] to-[#ECBF30]"
            onClick={onAgentClear}
          >
            {/* <HandIcon className="!size-8 group-data-[state=closed]:wave" /> */}
            <HomeIcon className="!size-6 mb-[2px]" />
            {debouncedAgentLabel}
          </Button>
        </div>
        <div
          className={cn(
            "absolute w-full",
            "mt-3 2xl:mt-6 flex flex-col gap-10",
            "transition-opacity data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
            "data-[state=closed]:pointer-events-none"
          )}
          data-state={question == null && !hidden ? "open" : "closed"}
        >
          <div className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-6xl 2xl:leading-[125%]">
            <div className="font-bold inline-block bg-gradient-to-r from-[#C73C37] to-[#EDC642] text-transparent bg-clip-text">
              {t("title")}
            </div>
            <div className="font-semibold">{t("subTitle")}</div>
          </div>
          <div
            className="flex flex-col gap-4 group/step"
            data-step={agentId == null ? 0 : 1}
          >
            <div className="text-xl xl:text-2xl relative">
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
                data-active={agentId == null}
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
                data-active={agentId != null}
              >
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full mr-4"
                  onClick={() => onAgentClear()}
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
                    {agents.map((agentInfo) => (
                      <CarouselItem
                        key={agentInfo.agentId}
                        className="pl-2 basis-1/5"
                      >
                        <WelcomeButton
                          label={agentInfo.description}
                          onClick={() => onAgentSelect(agentInfo.agentId)}
                          className="text-lg font-semibold"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                <Carousel orientation="horizontal">
                  <CarouselContent className="-ml-2">
                    {debouncedQuestions &&
                      debouncedQuestions.map((question, index) => (
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
                "py-2 2xl:py-10",
                "flex gap-4 text-lg justify-center"
              )}
              data-active={agentId != null}
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
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="secondary"
      className={cn(
        "size-44 rounded-xl p-8",
        "bg-gradient-to-br from-[#C73C37] to-[#C73C37]",
        "hover:bg-gradient-to-br hover:from-[#C73C37] hover:to-[#EDC642]",
        "font-normal text-sm text-center whitespace-normal text-white",
        className
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
