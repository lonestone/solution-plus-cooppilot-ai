import { forwardRef } from "react";

type NewChatFragmentProps = {
  title: string;
  desc?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  children: React.ReactNode;
};

const ContentSection = (
  { title, children, desc, size = "4xl" }: NewChatFragmentProps,
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <div className="flex flex-col gap-8" ref={ref}>
      <div className="flex flex-col gap-1">
        <span className={`text-${size}`}>{title}</span>
        {desc && <span className="text-gray">{desc}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
};

ContentSection.displayName = "ContentSection";

export default forwardRef(ContentSection);
