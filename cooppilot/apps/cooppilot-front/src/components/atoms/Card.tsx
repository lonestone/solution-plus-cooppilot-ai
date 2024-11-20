const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 p-6 rounded-lg bg-stone-800 text-stone-200">
      {children}
    </div>
  );
};

export default Card;
