import { WelcomePanel } from "@/components/organisms/WelcomePanel";
import { useCallback, useRef, useState } from "react";
import Chat from "./Chat";

export function Main() {
  const [projectSlug, setProjectSlug] = useState<string>();
  const [question, setQuestion] = useState<string>();
  const [panelHidden, setPanelHidden] = useState<boolean>(false);
  const sendMessageRef = useRef<(message: string) => Promise<void>>();

  const onProjectSelect = useCallback((projectSlug: string) => {
    setProjectSlug(projectSlug);
  }, []);

  const onProjectClear = useCallback(() => {
    setProjectSlug(undefined);
    setQuestion(undefined);
  }, []);

  const onQuestionSelect = useCallback((question: string) => {
    setQuestion(question);
    sendMessageRef?.current?.(question);
  }, []);

  const onEmptyChange = useCallback((empty: boolean) => {
    setPanelHidden(!empty);
  }, []);

  return (
    <div className="grid grid-rows-[max-content_1fr] h-full">
      <WelcomePanel
        projectSlug={projectSlug}
        question={question}
        hidden={panelHidden}
        onProjectSelect={onProjectSelect}
        onProjectClear={onProjectClear}
        onQuestionSelect={onQuestionSelect}
      />
      <Chat
        projectSlug={projectSlug}
        sendMessageRef={sendMessageRef}
        onEmptyChange={onEmptyChange}
      />
    </div>
  );
}
