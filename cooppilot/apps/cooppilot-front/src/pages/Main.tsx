import { WelcomePanel } from "@/components/organisms/WelcomePanel";
import { useCallback, useState } from "react";
import Chat from "./Chat";

export function Main() {
  const [projectSlug, setProjectSlug] = useState<string>();
  const [question, setQuestion] = useState<string>();

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

  return (
    <div className="flex flex-col h-full">
      <WelcomePanel
        projectSlug={projectSlug}
        question={question}
        onProjectSelect={onProjectSelect}
        onProjectClear={onProjectClear}
        onQuestionSelect={onQuestionSelect}
      />
      <Chat projectSlug={projectSlug} question={question} />
    </div>
  );
}
