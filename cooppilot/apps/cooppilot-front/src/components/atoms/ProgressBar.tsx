import { motion } from "framer-motion";

const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  return (
    <div className="relative h-2 w-full rounded-full bg-stone-700">
      <motion.div
        className="absolute h-full rounded-full bg-gradient-to-r from-gradient-from to-gradient-to"
        style={{
          width: `${(value / max) * 100}%`,
          boxShadow:
            "0 0 10px var(--gradient-from), 0 0 5px var(--gradient-to)",
        }}
        initial={{
          width: "0%",
        }}
        animate={{
          width: `${(value / max) * 100}%`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
