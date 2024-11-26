import Card from "@/components/atoms/Card";

type HelpCardProps = {
  title: string;
  desc: string;
};

const HelpCard = ({ title, desc }: HelpCardProps) => {
  return (
    <Card>
      <span className="text-xl font-bold">{title}</span>
      <span>{desc}</span>
    </Card>
  );
};

export default HelpCard;
