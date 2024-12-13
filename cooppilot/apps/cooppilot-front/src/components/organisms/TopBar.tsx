import logo from '@/assets/logo.png'
import { Link } from 'react-router-dom'

const TopBar = () => {
  // const [drawerOpen, setDrawerOpen] = useState(false);
  // const { t } = useTranslation("translation", {
  //   keyPrefix: "Sidebar",
  // });
  // const { unnamedCategories } = useNavBarCategories();

  // const onNavigate = useCallback(() => {
  //   setDrawerOpen(false);
  // }, []);

  return (
    <div className="px-4 py-2 flex flex-row justify-between items-center z-10">
      <div className="flex flex-row items-center justify-center">
        <Link to="/" reloadDocument={false} unstable_viewTransition={true}>
          <div className="flex flex-row items-center justify-center">
            <img src={logo} alt="Logo" width={35} className="xl:w-[35px]" />
            <span className="text-black text-2xl">hat Coop</span>
          </div>
        </Link>
      </div>
      <div />
      {/* <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button className="rounded-full" size="icon">
            {!drawerOpen && <Menu className="size-5" />}
            {drawerOpen && <Cross2Icon className="size-5" />}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[calc(100%-64px)] bg-background max-w-full overflow-hidden">
          <div className="h-full w-full overflow-y-auto">
            <div className="p-4 w-full">
              <Link
                to="/"
                onClick={onNavigate}
                className="rounded-full justify-center items-center flex flex-row py-[.7rem] bg-gradient-to-r from-gradient-from to-gradient-to p-2 text-gray-text text-sm"
              >
                <Bot className="size-5" />
                <span className="ml-2">{t("talkWith")}</span>
              </Link>
            </div>
            {unnamedCategories.map((category, index) => (
              <TopBarNavCategory
                key={index.toString()}
                categoryName={t("Categories.more")}
                onNavigate={onNavigate}
                links={category.links}
              />
            ))}
          </div>
        </DrawerContent>
      </Drawer> */}
    </div>
  )
}

export default TopBar
