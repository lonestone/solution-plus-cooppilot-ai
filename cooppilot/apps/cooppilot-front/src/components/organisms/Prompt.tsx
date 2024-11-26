import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SendIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 1000;

export default function Prompt({
  initialValue,
  onValueChange,
  onSubmit,
  className,
}: {
  initialValue?: string | undefined;
  onValueChange?: (value: string) => void;
  onSubmit: (query: string) => void;
  className?: string;
}) {
  const [query, setQuery] = useState(initialValue ?? "");
  useEffect(() => {
    if (initialValue != null) setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onValueChange?.(query);
  }, [onValueChange, query]);

  const canSend = useMemo(
    () => query.trim().length >= MIN_QUERY_LENGTH,
    [query]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSend) return;
    onSubmit(query.trim());
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      onSubmit(query);
      setQuery("");
    }
  };

  return (
    <div className={cn("flex flex-col flex-1", className)}>
      <form
        className={cn(
          "relative flex gap-4 overflow-hidden focus-within:ring-1 focus-within:ring-ring",
          "rounded-3xl pl-2 pr-1 py-1",
          "bg-[#f7f5f5]",
          "relative"
        )}
        x-chunk="dashboard-03-chunk-1"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 flex items-center gap-2">
          <Label htmlFor="message" className="sr-only">
            Message
          </Label>
          <AutosizeTextarea
            id="message"
            placeholder="Taper votre message pour discuter avec l'agent IA"
            className={cn(
              "h-12 max-h-16 resize-none",
              "border-0 shadow-none bg-transparent text-md text-black focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-gray-400 disabled:placeholder:text-white",
              // NOTE: vertical alignement fix
              "-mb-[6px]"
            )}
            minHeight={42}
            maxHeight={114}
            onChange={(e) => setQuery(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            value={query}
            minLength={MIN_QUERY_LENGTH}
            maxLength={MAX_QUERY_LENGTH}
          />
        </div>
        <div className="flex-0 flex items-end">
          <Button
            type="submit"
            size="icon"
            className="rounded-full size-12 bg-primary"
            disabled={!canSend}
          >
            <SendIcon className="size-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
