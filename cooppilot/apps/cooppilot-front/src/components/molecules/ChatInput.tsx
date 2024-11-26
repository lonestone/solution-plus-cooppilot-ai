import { TextareaProps } from "@/components/ui/textarea";
import { AutosizeTextarea } from "../ui/autosize-textarea";

type ChatInputProps = {
  value: string;
} & TextareaProps;

const ChatInput = ({ ...props }: ChatInputProps) => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.(e);
  };

  return (
        <div className="w-full">
          <AutosizeTextarea
            {...props}
            onChange={onChange}
            minHeight={20}
            autoComplete="off"
            maxHeight={200}
          />
        </div>
  );
};

export default ChatInput;
