import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedLayout from "./ProtectedLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AddDoctor from "./pages/Admin/AddDoctor";
import AllAppointments from "./pages/Admin/AllAppointments";
import DoctorsList from "./pages/Admin/DoctorsList";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorUpdateProfile from "./pages/Doctor/DoctorUpdateProfile";
import Register from "./pages/Doctor/Register";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedLayout />,
      children: [
        {
          path: "/admin-dashboard",
          element: <Dashboard />,
        },
        {
          path: "/add-doctor",
          element: <AddDoctor />,
        },
        {
          path: "/appointments",
          element: <AllAppointments />,
        },
        {
          path: "/doctors",
          element: <DoctorsList />,
        },
        //Doctor  Routes
        {
          path: "/doctor-dashboard",
          element: <DoctorDashboard />,
        },
        {
          path: "/doctor-appointments",
          element: <DoctorAppointments />,
        },
        {
          path: "/doctor-profile",
          element: <DoctorProfile />,
        },
        {
          path: "/update-profile",
          element: <DoctorUpdateProfile />,
        },
      ],
    },

    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
    <div className="scrollbar-thumb-primary scrollbar-track-green-200">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
};

export default App;
