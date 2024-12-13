import logo from '@/assets/logo.png'
import ChatEntryFeedback from '@/components/molecules/ChatEntryFeedback'
import ChatReasoningLoader from '@/components/molecules/ChatReasoningLoader'
import ChatAnswerDetails from '@/components/organisms/ChatAnswerDetails'
import { useChatEntryPolling } from '@/hooks/useChatEntry'
import { ChatEntry } from '@common/types/back/chat'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type ChatAnswerProps = {
  projectId: string
  chatEntryId: number
  onChatEntryUpdated: () => void
  onLoaded: () => void
  isActive: boolean
}

const ChatAnswer = ({
  projectId,
  chatEntryId,
  onChatEntryUpdated,
  onLoaded,
  isActive,
}: ChatAnswerProps) => {
  const { chatEntry } = useChatEntryPolling({
    active: true,
    cachedChatEntry: {} as ChatEntry,
    projectId,
    chatId: chatEntryId,
  })
  const { t } = useTranslation()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (chatEntry?.queryStatus !== undefined && !isLoaded) {
      setIsLoaded(true)
      onLoaded()
    }
  }, [chatEntry, chatEntry?.queryStatus, isLoaded, onLoaded])

  useEffect(() => {
    onChatEntryUpdated()
  }, [chatEntry?.queryStatus, onChatEntryUpdated])

  const Comp = useMemo(() => {
    if (chatEntry?.queryStatus === 'DONE') {
      return (
        <Markdown remarkPlugins={[remarkGfm]}>
          {chatEntry.response.answer}
        </Markdown>
      )
    } else if (chatEntry?.queryStatus === 'ERROR') {
      return <div className="text-red-400">{t('Chat.answerError')}</div>
    } else if (
      chatEntry?.queryStatus === 'PENDING' ||
      chatEntry?.queryStatus === 'RUNNING' ||
      chatEntry?.queryStatus === 'CREATING'
    ) {
      return <ChatReasoningLoader entry={chatEntry} />
    } else {
      // return <ChatEntrySkeleton isLeft={false} displayUser={false} />;
      return null
    }
  }, [chatEntry, t])

  return (
    <div className="flex flex-col items-start" id="list-view-item">
      <div className="flex flex-row items-start gap-2 w-full">
        <div className="rounded-full bg-background p-2 text-xs text-white">
          {/* <User /> */}
          <img src={logo} alt="Logo" width={25} />
        </div>
        <div
          className="w-full md:max-w-[calc(100%-120px)] py-2 px-4 markdown-content overflow-hidden"
          style={{ wordBreak: 'break-word' }}
        >
          {Comp}
        </div>
      </div>
      {/* {chatEntry?.queryStatus === "DONE" && isActive && (
        <ChatAnswerDetails chatEntry={chatEntry} />
      )} */}
      {chatEntry?.queryStatus === 'DONE' && isActive && (
        <ChatEntryFeedback
          projectSlug={projectId}
          chatEntryId={chatEntryId}
          userFeedback={chatEntry?.answerUserFeedbacks?.[0]}
        />
      )}
    </div>
  )
}

export default ChatAnswer
