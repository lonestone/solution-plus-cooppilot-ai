import { Button } from "@/components/ui/button";
import { Flame, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type InspireMeProps = {
  onClick: () => void;
  type: "active" | "inactive";
};

const InspireMe = ({ onClick, type = "active" }: InspireMeProps) => {
  const { t } = useTranslation();
  return (
    <Button
      onClick={onClick}
      className={`rounded-2xl ${
        type === "active" ? "bg-primary" : "bg-primary/20"
      } ${
        type === "inactive" ? "hover:bg-primary/15" : ""
      } flex flex-row px-4 py-1.5 gap-2 items-center justify-center`}
    >
      {type === "active" ? (
        <Flame className="size-4" />
      ) : (
        <X className="size-4" />
      )}
      <span className=" text-sm text-stone-50">{t("Chat.inspireMe")}</span>
    </Button>
  );
};

export default InspireMe;
