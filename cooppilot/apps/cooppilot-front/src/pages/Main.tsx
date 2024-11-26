import { WelcomePanel } from "@/components/organisms/WelcomePanel";
import { useCallback, useState } from "react";
import Chat from "./Chat";

export function Main() {
  const [projectSlug, setProjectSlug] = useState<string>();
  const [question, setQuestion] = useState<string>();
  const [panelHidden, setPanelHidden] = useState<boolean>(false);

  const onProjectSelect = useCallback((projectSlug: string) => {
    setProjectSlug(projectSlug);
  }, []);

  const onProjectClear = useCallback(() => {
    setProjectSlug(undefined);
    setQuestion(undefined);
  }, []);

  const onQuestionSelect = useCallback((question: string) => {
    setQuestion(question);
  }, []);

  const onEmptyChange = useCallback((empty: boolean) => {
    setPanelHidden(!empty);
  }, []);

  const onQuestionChange = useCallback((question: string) => {
    setQuestion(question.length === 0 ? undefined : question);
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
        initialQuestion={question}
        onEmptyChange={onEmptyChange}
        onQuestionChange={onQuestionChange}
      />
    </div>
  );
}
