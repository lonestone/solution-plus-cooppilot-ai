import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export const LoadingSpinner = ({
  className,
  size,
}: {
  className?: string;
  size?: string | number;
}) => {
  return <LoaderCircle size={size} className={cn("animate-spin", className)} />;
};
