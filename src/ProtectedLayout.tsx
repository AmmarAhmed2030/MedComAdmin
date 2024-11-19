import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import useAuthStore from "./zustand/store";

const ProtectedLayout = () => {
  const { isAuthenticated, token, dToken } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="bg-[#F8F9FD]">
      <Navbar />
      {token ? (
        <div className="flex items-start">
          <Sidebar />
          <Outlet />
        </div>
      ) : dToken ? (
        <div className="flex items-start">
          <Sidebar />
          <Outlet />
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};

export default ProtectedLayout;
