import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const registerSchema = yup.object().shape({
    name: yup
      .string()
      .required("Full Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password maximum 30 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\/])[A-Za-z\d@$!%*?&\/]{8,}$/,
        "Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    mode: "onChange", // Trigger validation on every input change
  });
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const onSubmitHandler = async (data: RegisterFormValues) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendURL}/api/doctor/register`, {
        ...data,
      });
      if (response) {
        setLoading(false);
        toast.dismiss();
        toast.success("registered successfully");
        navigate("/login");
      }
    } catch (error: unknown) {
      setLoading(false);
      console.log("register error", error);
      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Register failed: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">Create Account</p>
        <p>Please sign up</p>

        <div className="w-full flex flex-col gap-3">
          <label htmlFor="fullName">Full Name</label>
          <input
            {...register("name")}
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            id="fullName"
            type="text"
          />
          {errors.name && (
            <small className="text-red-500">{errors.name.message}</small>
          )}
        </div>

        <div className="w-full flex flex-col gap-3">
          <label htmlFor="email">Email</label>
          <input
            {...register("email")}
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            id="email"
            type="email"
          />
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}
        </div>

        <div className="w-full flex flex-col gap-3">
          <label htmlFor="password">Password</label>
          <input
            {...register("password")}
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            id="password"
            type="password"
          />
          {errors.password && (
            <small className="text-red-500">{errors.password.message}</small>
          )}
        </div>

        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-primary underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </form>
  );
};

export default Register;
