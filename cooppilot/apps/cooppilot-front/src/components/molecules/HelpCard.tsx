import Card from "@/components/atoms/Card";

type HelpCardProps = {
  title: string;
  desc: string;
};

const HelpCard = ({ title, desc }: HelpCardProps) => {
  return (
    <Card>
      <span className="text-xl font-bold">{title}</span>
      <span className="text-stone-400">{desc}</span>
    </Card>
  );
};

export default HelpCard;
