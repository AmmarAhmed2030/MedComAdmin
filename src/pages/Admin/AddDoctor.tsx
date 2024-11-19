import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { assets } from "../../assets/assets";
import axios from "axios";
import useAuthStore from "../../zustand/store";
import { toast } from "react-toastify";

type Address = {
  line1: string;
  line2?: string;
};

type FormValues = {
  image?: FileList;
  name: string;
  email: string;
  password: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  available: boolean;
  fees: number;
  address: Address;
};

const AddDoctor = () => {
  const [docImg, setDocImg] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  // Yup validation schema
  const addDoctorSchema = yup.object().shape({
    image: yup.mixed(),
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
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\/])[A-Za-z\d@$!%*?&\/]{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    speciality: yup.string().required("Speciality is required"),
    degree: yup.string().required("Degree is required"),
    experience: yup
      .string()
      .required("Experience is required")
      .matches(/^(1|2|3|4|5|6|7|8|9|10) Year$/, "Invalid experience format"),
    about: yup
      .string()
      .required("About is required")
      .min(3, "About must be at least 3 characters"),
    available: yup.boolean().required("Availability status is required"),
    fees: yup
      .number()
      .required("Fees is required")
      .min(0, "Fees cannot be negative"),
    address: yup.object().shape({
      line1: yup.string().required("Address Line 1 is required"),
      line2: yup.string(),
    }),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(addDoctorSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("speciality", data.speciality);
      formData.append("degree", data.degree);
      formData.append("experience", data.experience);
      formData.append("about", data.about);
      formData.append("available", data.available.toString());
      formData.append("fees", data.fees.toString());
      formData.append("address", JSON.stringify(data.address));

      if (docImg) {
        formData.append("image", docImg);
      }

      const backendURL = import.meta.env.VITE_BACKEND_URL;
      setLoading(true);
      const response = await axios.post(
        `${backendURL}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Doctor added successfully");
      setLoading(false);
      console.log("Doctor added successfully:", response.data);
      reset();
      setDocImg(null);
    } catch (error: unknown) {
      setLoading(false);

      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          // Check for specific error status codes
          if (status === 400) {
            toast.error("Bad Request: " + error.response.data.message);
          } else if (status === 401) {
            toast.error("Unauthorized: Please check your authentication.");
          } else if (status === 500) {
            toast.error("Server Error: Please try again later.");
          } else {
            toast.error("Error: " + error.response.data.message);
          }
        } else if (error.request) {
          // Handle network errors with no response from server
          toast.error("No response from server. Please check your network.");
        } else {
          // Errors triggered during request setup
          toast.error("Request Error: " + error.message);
        }
      } else if (error instanceof Error) {
        // Handle other non-Axios errors
        toast.error("An unexpected error occurred: " + error.message);
      } else {
        // Fallback for unexpected error types
        toast.error("An unknown error occurred.");
      }

      console.error("Error: ", error);
    }
  };

  return (
    <form className="m-5 w-full" onSubmit={handleSubmit(onSubmit)}>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded-lg w-full  max-h-[80vh] overflow-y-scroll scrollbar-thin scrollbar-corner-rounded-* shadow-lg">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              src={docImg ? URL.createObjectURL(docImg) : assets.addImage}
              alt=""
              className="w-16 h-16 bg-green-300 rounded-full cursor-pointer"
            />
          </label>
          <input
            type="file"
            id="doc-img"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setDocImg(file);
            }}
          />
          <p>
            Upload doctor
            <br />
            picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex flex-col gap-4">
            <input
              {...register("name")}
              placeholder="Doctor Name"
              className="border border-zinc-300 rounded w-full p-2 mt-4"
            />
            {errors.name && (
              <small className="text-red-600">{errors.name.message}</small>
            )}

            <input
              {...register("email")}
              placeholder="Email"
              className="border border-zinc-300 rounded w-full p-2 mt-4"
            />
            {errors.email && (
              <small className="text-red-600">{errors.email.message}</small>
            )}

            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="border border-zinc-300 rounded w-full p-2 mt-4"
            />
            {errors.password && (
              <small className="text-red-600">{errors.password.message}</small>
            )}

            <input
              {...register("degree")}
              placeholder="Degree"
              className="border border-zinc-300 rounded w-full p-2 mt-4"
            />
            {errors.degree && (
              <small className="text-red-600">{errors.degree.message}</small>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <select
              {...register("speciality")}
              className="border border-zinc-300 rounded w-full p-2 mt-4"
            >
              <option value="General physician">General physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>

            <select
              {...register("experience")}
              className="border border-zinc-300 rounded w-full p-2 mt-4"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={`${i + 1} Year`}>{`${
                  i + 1
                } Year`}</option>
              ))}
            </select>

            <input
              {...register("fees")}
              type="number"
              placeholder="Fees"
              className="border border-zinc-300 rounded w-full p-2 mt-4"
            />
            {errors.fees && (
              <small className="text-red-600">{errors.fees.message}</small>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <input
            {...register("address.line1")}
            placeholder="Address Line 1"
            className="border border-zinc-300 rounded w-full p-2 mt-4"
          />
          <input
            {...register("address.line2")}
            placeholder="Address Line 2 (Optional)"
            className="border border-zinc-300 rounded w-full p-2 mt-4"
          />
          <textarea
            {...register("about")}
            placeholder="About"
            rows={5}
            className="border border-zinc-300 rounded w-full p-2 mt-4"
          ></textarea>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input type="checkbox" {...register("available")} />
          <label>Available</label>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-10 py-2 rounded-full w-full my-4"
        >
          {loading ? "Adding doctor please wait..." : "Add Doctor"}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
