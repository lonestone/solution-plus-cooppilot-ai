const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 p-6 rounded-lg bg-[#e8e8e8]">
      {children}
    </div>
  );
};

export default Card;
