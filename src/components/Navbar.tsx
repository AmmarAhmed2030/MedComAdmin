import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import useAuthStore from "../zustand/store";
const Navbar = () => {
  const { token, dToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const frontendURL = import.meta.env.VITE_FRONTEND_URL;
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 border-b bg-white">
      <div className="flex items-center gap-2 text-xs ">
        <img src={assets.logo} alt="" className="w-16 sm:w-20 cursor-pointer" />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {token ? "Admin" : "Doctor"}
        </p>
      </div>
      {token || dToken ? (
        <div className="flex gap-2">
          {" "}
          <Link
            to={`${frontendURL}/login`}
            className="bg-primary text-white  text-sm px-10 py-2 rounded-full"
          >
            Login as User
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-primary text-white  text-sm px-10 py-2 rounded-full"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-primary text-white  text-sm px-10 py-2 rounded-full"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
