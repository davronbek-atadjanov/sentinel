import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[hsl(222,65%,5%)]">
      <Sidebar />
      <TopBar />
      <main className="ml-[260px] pt-16 min-h-screen">
        <div className="p-8 max-w-[1600px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
