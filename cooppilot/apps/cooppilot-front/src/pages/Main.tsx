import { WelcomePanel } from "@/components/organisms/WelcomePanel";
import { useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "./Chat";

export function Main() {
  const { agentId } = useParams<{ agentId: string }>();

  const [panelHidden, setPanelHidden] = useState<boolean>(false);
  const sendMessageRef = useRef<(message: string) => Promise<void>>();

  const navigate = useNavigate();

  const onAgentSelect = useCallback(
    (agentId: string) => navigate(`/agent/${agentId}`),
    [navigate]
  );

  const onAgentClear = useCallback(() => navigate(`/`), [navigate]);

  const onQuestionSelect = useCallback((question: string) => {
    sendMessageRef?.current?.(question);
  }, []);

  const onEmptyChange = useCallback((empty: boolean) => {
    setPanelHidden(!empty);
  }, []);

  return (
    <div className="grid grid-rows-[max-content_1fr] h-full">
      <WelcomePanel
        agentId={agentId}
        hidden={panelHidden}
        onAgentSelect={onAgentSelect}
        onAgentClear={onAgentClear}
        onQuestionSelect={onQuestionSelect}
      />
      <Chat
        projectSlug={agentId}
        sendMessageRef={sendMessageRef}
        onEmptyChange={onEmptyChange}
      />
    </div>
  );
}
