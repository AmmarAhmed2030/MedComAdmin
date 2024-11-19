import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/store";

type Address = {
  line1: string;
  line2?: string;
};

type UpdateProfileForm = {
  name: string;
  image?: FileList;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: Address;
  available: boolean;
};

const DoctorUpdateProfile = () => {
  const navigate = useNavigate();
  const [docImg, setDocImg] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { doctor, dToken, setDoctor, getProfile } = useAuthStore();

  useEffect(() => {
    if (dToken) {
      getProfile(dToken);
    }
  }, [dToken, getProfile]);

  const updateProfileSchema = yup.object().shape({
    image: yup.mixed(),
    name: yup
      .string()
      .required("Full Name is required")
      .min(3, "Name must be at least 3 characters"),
    speciality: yup
      .string()
      .required("Speciality is required")
      .min(3, "Speciality must be at least 3 characters"),
    degree: yup
      .string()
      .required("Degree is required")
      .min(3, "Degree must be at least 3 characters"),
    experience: yup
      .string()
      .required("Experience is required")
      .min(3, "Experience must be at least 3 characters"),
    about: yup
      .string()
      .required("About is required")
      .min(3, "About must be at least 3 characters"),
    fees: yup.number().required("Fees is required"),
    available: yup.boolean().default(false),
    address: yup.object().shape({
      line1: yup.string().required("Address Line 1 is required"),
      line2: yup.string(),
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileForm>({
    resolver: yupResolver(updateProfileSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UpdateProfileForm) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("address", JSON.stringify(data.address));
      formData.append("speciality", data.speciality);
      formData.append("degree", data.degree);
      formData.append("experience", data.experience);
      formData.append("about", data.about);
      formData.append("available", data.available ? "true" : "false");
      formData.append("fees", data.fees.toString());

      if (docImg) {
        formData.append("image", docImg);
      }

      const backendURL = import.meta.env.VITE_BACKEND_URL;
      setLoading(true);
      const response = await axios.post(
        `${backendURL}/api/doctor/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${dToken}`,
          },
        }
      );

      setDoctor({
        ...doctor,
        name: data.name || doctor?.name || "",
        speciality: data.speciality || doctor?.speciality || "",
        address: data.address || doctor?.address || "",
        about: data.about || doctor?.about || "",
        experience: data.experience || doctor?.experience,
        fees:
          typeof data.fees === "string"
            ? parseFloat(data.fees)
            : data.fees ?? doctor?.fees,
        degree: data.degree || doctor?.degree || "",
        available: data.available ?? doctor?.available ?? false,
        image: response.data.image || doctor?.image || "",
      });

      toast.success("Profile Updated successfully");
      setLoading(false);

      navigate("/doctor-profile");
    } catch (error: unknown) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error("Error: " + error.response.data.message);
        } else if (error.request) {
          toast.error("No response from server. Please check your network.");
        } else {
          toast.error("Request Error: " + error.message);
        }
      } else if (error instanceof Error) {
        toast.error("An unexpected error occurred: " + error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-5 w-full bg-white rounded-lg py-3 px-6 border shadow-lg"
    >
      <div className="flex items-center gap-4 mb-8 text-gray-500">
        <label htmlFor="doc-img">
          <img
            src={docImg ? URL.createObjectURL(docImg) : doctor?.image}
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
            if (file) setDocImg(file); // Update the selected image
          }}
        />
        <p>
          Upload profile
          <br />
          picture
        </p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">
          Name
        </label>
        <input
          type="text"
          defaultValue={doctor?.name || ""}
          {...register("name")}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">
          Speciality
        </label>
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
        {errors.speciality && (
          <small className="text-red-500 block">
            {errors.speciality?.message}
          </small>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">
          Degree
        </label>
        <input
          type="text"
          defaultValue={doctor?.degree || ""}
          {...register("degree")}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
        {errors.degree && (
          <p className="text-red-500 text-xs">{errors.degree.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">
          Experience
        </label>
        <select
          {...register("experience")}
          className="border border-zinc-300 rounded w-full p-2 mt-4"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i} value={`${i + 1} Year`}>
              {`${i + 1} Year`}
            </option>
          ))}
        </select>
        {errors.experience && (
          <p className="text-red-500 text-xs">{errors.experience.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">
          About
        </label>
        <textarea
          defaultValue={doctor?.about || ""}
          rows={4}
          {...register("about")}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
        {errors.about && (
          <p className="text-red-500 text-xs">{errors.about.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">
          Fees
        </label>
        <input
          type="number"
          defaultValue={doctor?.fees || ""}
          {...register("fees")}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
        {errors.fees && (
          <p className="text-red-500 text-xs">{errors.fees.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">
          Address Line 1
        </label>
        <input
          type="text"
          defaultValue={doctor?.address?.line1 || ""}
          {...register("address.line1")}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
        {errors.address?.line1 && (
          <p className="text-red-500 text-xs">
            {errors.address?.line1?.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          defaultValue={doctor?.address?.line2 || ""}
          {...register("address.line2")}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4 flex gap-2 items-center">
        <input
          type="checkbox"
          {...register("available")}
          defaultChecked={doctor?.available || false}
          className="mt-1"
        />
        <label className="block text-sm font-semibold text-gray-700">
          Available for Consultations
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2  hover:bg-primary hover:text-white text-primary border border-primary rounded-md transition-all duration-500"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

export default DoctorUpdateProfile;
