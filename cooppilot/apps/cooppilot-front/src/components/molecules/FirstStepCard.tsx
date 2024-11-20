import { Button } from "@/components/ui/button";

type FirstStepCardProps = {
  desc: string;
  icon: React.ReactNode;
  onDiscoverClick?: () => void;
};

const FirstStepCard = ({ desc, icon, onDiscoverClick }: FirstStepCardProps) => {
  return (
    <div className="p-6 bg-stone-800 rounded-xl">
      <div className="w-10 h-10 rounded-sm bg-stone-600 p-2 flex justify-center items-center">
        {icon}
      </div>
      <div className="text-stone-50 mt-3">{desc}</div>
      {onDiscoverClick && (
        <div className="mt-6 text-stone-50 text-center w-full flex justify-end">
          <Button onClick={onDiscoverClick}>Discover</Button>
        </div>
      )}
    </div>
  );
};

export default FirstStepCard;
