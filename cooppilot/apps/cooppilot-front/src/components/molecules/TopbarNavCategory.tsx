import { Link, useLocation } from "react-router-dom";

export type CategoryLink = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

type TopBarNavCategoryProps = {
  categoryName?: string;
  links: CategoryLink[];
  onNavigate?: () => void;
};

const TopBarNavCategory = ({
  categoryName,
  links,
  onNavigate,
}: TopBarNavCategoryProps) => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-2">
      {categoryName && (
        <div className="text-gray text-sm font-semibold px-4">
          {categoryName.toUpperCase()}
        </div>
      )}
      <div className="flex flex-col mb-8">
        {links.map((link) => (
          <>
            <Link
              key={link.name}
              to={link.href}
              onClick={() => onNavigate?.()}
              className={
                "flex flex-row items-center gap-2 py-4 px-4 hover:bg-stone-800" +
                (pathname === link.href ? " bg-stone-700" : "")
              }
            >
              <div className="text-gray">{link.icon}</div>
              <span className="text-gray-text text-sm">{link.name}</span>
            </Link>
            <div className="h-[1px] bg-gray opacity-50" />
          </>
        ))}
      </div>
    </div>
  );
};

export default TopBarNavCategory;
