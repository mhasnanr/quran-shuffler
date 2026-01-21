import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav, { TabType } from "@/components/BottomNav";

const routeToTab: Record<string, TabType> = {
  "/": "schedule",
  "/guide": "guide",
  "/stats": "stats",
  "/review": "review",
  "/settings": "config",
};

const tabToRoute: Record<TabType, string> = {
  schedule: "/",
  guide: "/guide",
  stats: "/stats",
  review: "/review",
  config: "/settings",
};

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = routeToTab[location.pathname] || "schedule";

  const handleTabChange = (tab: TabType) => {
    navigate(tabToRoute[tab]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background geometric-pattern">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-6">
        <div className="mx-auto max-w-lg">
          <Outlet />
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Layout;
