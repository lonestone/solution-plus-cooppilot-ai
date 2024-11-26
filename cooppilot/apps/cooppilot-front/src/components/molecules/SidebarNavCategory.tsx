import { CategoryLink } from "@/hooks/useNavBarCategories";
import { Link, useLocation } from "react-router-dom";

type SidebarNavCategoryProps = {
  categoryName?: string;
  links: CategoryLink[];
};

const SidebarNavCategory = ({
  categoryName,
  links,
}: SidebarNavCategoryProps) => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-2">
      {categoryName && (
        <div className="text-gray text-sm font-semibold">
          {categoryName.toUpperCase()}
        </div>
      )}
      <div className="flex flex-col">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className={
              "flex flex-row items-center gap-2 rounded-lg p-2 hover:bg-stone-800" +
              (pathname === link.href ? " bg-stone-700" : "")
            }
          >
            <div className="text-gray">{link.icon}</div>
            <span className="text-gray-text text-sm">{link.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SidebarNavCategory;
