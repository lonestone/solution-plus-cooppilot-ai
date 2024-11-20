type UsageExamplesProps = {
  examples: string[];
  title: string;
  icon: React.ReactNode;
  onExampleClick: (example: string) => void;
};

const UsageExamples = ({
  examples,
  title,
  icon,
  onExampleClick,
}: UsageExamplesProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <div className="flex justify-center items-center rounded-sm w-10 h-10 bg-gradient-to-r from-gradient-from to-gradient-to">
          {icon}
        </div>
        <div className="text-lg font-semibold">{title}</div>
      </div>
      <div className="flex flex-col gap-2 justify-start">
        {examples.map((example) => (
          <div
            className="rounded-3xl rounded-bl-none bg-stone-800 py-3 px-6 w-fit cursor-pointer hover:bg-stone-700"
            key={example}
            onClick={() => onExampleClick(example)}
          >
            <span>{example}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageExamples;
