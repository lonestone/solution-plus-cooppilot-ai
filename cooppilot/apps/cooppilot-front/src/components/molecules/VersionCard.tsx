import Card from "@/components/atoms/Card";

type VersionCardProps = {
  title: string;
  categories: {
    title: string;
    items: string[];
  }[];
};

const VersionCard = ({ title, categories }: VersionCardProps) => {
  return (
    <Card>
      <span className="text-xl font-bold mb-2">{title}</span>
      <div className="flex flex-col gap-6">
        {categories.map((category) => (
          <div className="flex flex-col gap-2" key={category.title}>
            <span className="font-semibold">{category.title}</span>
            <div className="flex flex-col">
              {category.items.map((item) => (
                <span key={item}>- {item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default VersionCard;
