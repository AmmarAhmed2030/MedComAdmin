import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../zustand/store";
type FormValues = {
  email: string;
  password: string;
};
const Login = () => {
  const [state, setState] = useState("admin");
  const { login, token, dToken, loading } = useAuthStore();
  console.log(token);
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password maximum 30 characters"),
  });
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });
  const onSubmitHandler = async (data: FormValues) => {
    //console.log(data);
    const { email, password } = data;
    if (state === "admin") {
      await login(email, password, "admin");
    } else if (state === "doctor") {
      await login(email, password, "doctor");
    }
  };
  useEffect(() => {
    if (token) {
      console.log("token from useEffect", token);
      navigate("/admin-dashboard");
    } else if (dToken) {
      console.log("token from useEffect", dToken);
      navigate("/doctor-dashboard");
    }
  }, [token, navigate, dToken]);
  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shaow-lg">
        <p className="text-2xl font-semibold">
          {state === "admin" ? "Admin" : "Doctor"} Login
        </p>

        <div className="w-full flex flex-col gap-3">
          <label htmlFor="email">Email</label>
          <input
            {...register("email")}
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            id="email"
            type="email"
            required
          />
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}
        </div>
        <div className="w-full flex flex-col gap-3">
          <label htmlFor="password">Password</label>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            id="password"
            {...register("password")}
            type="password"
            required
          />
          {errors.password && (
            <small className="text-red-500">{errors.password.message}</small>
          )}
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          {loading ? "Please wait..." : "Login"}
        </button>
        {state === "admin" ? (
          <p>
            Are you doctor ?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("doctor")}
            >
              login here
            </span>
          </p>
        ) : (
          <p>
            Are you admin ?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("admin")}
            >
              login here
            </span>
          </p>
        )}
        {state === "doctor" && (
          <p className="text-right">
            Don't have an account?
            <Link to={"/register"} className="underline text-primary">
              Register
            </Link>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
