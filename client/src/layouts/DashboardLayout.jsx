import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slateBg xl:flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-7">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
