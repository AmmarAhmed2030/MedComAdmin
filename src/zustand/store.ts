import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

// Define the type for the state
interface AuthState {
  token: string | null;
  dToken: string | null;
  user: { name: string } | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  loadingDoctor: boolean;
  doctor: Doctor | null;
  getProfile: (dToken: string | null) => Promise<void>;
  setDoctor: (doctor: Doctor) => void;
}
export type Address = {
  line1: string;
  line2?: string;
};
export type User = {
  name: string;
  email?: string;
  image: string;
  address: Address;
  gender: string;
  dob: string;
  phone: string;
};
type DoctorData = {
  _id: string;
  name: string;
  image: string;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: Address;
  date: number;
  available: boolean;
};
type Appointment = {
  _id: string;
  userId: string;
  docId: string;
  slotDate: string;
  slotTime: string;
  userData: User;
  docData: DoctorData;
  amount: number;
  date: number;
  cancelled: boolean;
  payment: boolean;
  isCompleted: boolean;
};

interface DoctorsState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  getAllDoctors: (token: string | null) => Promise<void>;
  changeAvailability: (
    token: string | null,
    docId: string | null
  ) => Promise<void>;
}
type AppoitmentState = {
  loading: boolean;
  appointments: Appointment[];
  doctorAppointments: Appointment[];
  currency: string;
  getAllAppointments: (token: string | null) => Promise<void>;
  getDoctorAppointments: (dToken: string | null) => Promise<void>;
  cancelAppointment: (
    token: string | null,
    appointmentId: string | null
  ) => Promise<void>;
  cancelDoctorAppointment: (
    dToken: string | null,
    appointmentId: string | null
  ) => Promise<void>;
  markDoctorAppointment: (
    dToken: string | null,
    appointmentId: string | null
  ) => Promise<void>;
  statusLoading: boolean;
};
type DashData = {
  doctors: number | null;
  appointments: number | null;
  patients: number | null;
  latestAppointments: Appointment[];
};
type DocDashData = {
  earnings: number | null;
  appointments: number | null;
  patients: number | null;
  latestAppointments: Appointment[];
};
type DashboardDataState = {
  dashboardData: DashData | null;
  loading: boolean;
  getDashboardData: (token: string | null) => Promise<void>;
};
type DoctorDashboardDataState = {
  doctorDashboardData: DocDashData | null;
  loading: boolean;
  getDoctorDashboardData: (dToken: string | null) => Promise<void>;
};
type SlotDateFormatted = {
  slotDateFormatted: string | null;
  formatSlotDate: (slotDate: string) => void;
};
export const useFormattedDate = create<SlotDateFormatted>((set) => ({
  slotDateFormatted: null,
  formatSlotDate: (slotDate) => {
    const months = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dateArray = slotDate.split("_");

    set({
      slotDateFormatted:
        dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2],
    });
  },
}));
export const useDashboardData = create<DashboardDataState>((set) => ({
  dashboardData: null,
  loading: false,
  getDashboardData: async (token) => {
    try {
      set({ loading: true });

      const response = await axios.get(
        `${backendURL}/api/admin/admin-dashboard`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.data) {
        const { data } = response.data;
        console.log(data);
        set({ dashboardData: data, loading: false });
      } else {
        set({ loading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Error: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },
}));
export const useDoctorDashboardData = create<DoctorDashboardDataState>(
  (set) => ({
    doctorDashboardData: null,
    loading: false,
    getDoctorDashboardData: async (dToken) => {
      try {
        set({ loading: true });

        const response = await axios.get(
          `${backendURL}/api/doctor/doctor-dashboard`,

          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${dToken}`,
            },
          }
        );
        if (response && response.data) {
          const { data } = response.data;
          console.log(data);
          set({ doctorDashboardData: data, loading: false });
        } else {
          set({ loading: false });
          toast.dismiss();
          toast.error("Something went wrong");
        }
      } catch (error: unknown) {
        set({ loading: false });

        if (axios.isAxiosError(error)) {
          toast.dismiss();
          toast.error(
            "Error: " + (error.response?.data.message || error.message)
          );
        } else {
          toast.dismiss();
          toast.error("An unexpected error occurred");
        }
      }
    },
  })
);
export type Doctor = {
  _id?: string;
  name: string;
  email?: string;
  image?: string;
  speciality?: string;
  degree?: string;
  experience?: string;
  about?: string;
  fees?: number;
  address?: Address;
  date?: number;
  available?: boolean;
  slots_booked?: Record<string, string[]>; // Updated this line
};

const backendURL = import.meta.env.VITE_BACKEND_URL;

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token") || null,
  user: null,
  dToken: localStorage.getItem("dToken") || null,
  isAuthenticated:
    !!localStorage.getItem("token") || !!localStorage.getItem("dToken"),
  loading: false,
  loadingDoctor: false,
  doctor: null,
  error: null,
  setDoctor: (doctor) => set({ doctor }), // This updates the user state
  getProfile: async (dToken) => {
    try {
      set({ loadingDoctor: true });
      const response = await axios.get(
        `${backendURL}/api/doctor/doctor-profile`,

        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
      if (response && response.data) {
        const { data } = response.data;
        console.log(data);
        set({ loadingDoctor: false, doctor: data });
      }
    } catch (error: unknown) {
      set({ loadingDoctor: false });
      console.log("getting profile error", error);
      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Get Profile failed: " +
            (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },
  login: async (email: string, password: string, role: string) => {
    set({ loading: true, error: null });
    try {
      let response;
      if (role === "admin") {
        response = await axios.post(`${backendURL}/api/admin/login`, {
          email,
          password,
        });
        if (response && response.data) {
          const { token } = response.data;
          set({ token, loading: false, dToken: null });
          localStorage.setItem("token", token);
          localStorage.removeItem("dToken");

          toast.dismiss();
          toast.success("Login successful!");
        } else {
          set({ loading: false });
          toast.dismiss();
          toast.error("Something went wrong");
        }
      } else {
        response = await axios.post(`${backendURL}/api/doctor/login`, {
          email,
          password,
        });
        if (response && response.data) {
          const { token } = response.data;
          set({ dToken: token, loading: false, token: null });
          localStorage.removeItem("token");

          localStorage.setItem("dToken", token);
          toast.dismiss();
          toast.success("Login successful!");
        } else {
          set({ loading: false });
          toast.dismiss();
          toast.error("Something went wrong");
        }
      }
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Login failed: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },

  logout: () => {
    set({ token: null, dToken: null, user: null, error: null });
    localStorage.removeItem("token");
    localStorage.removeItem("dToken");
    toast.dismiss();
    toast.info("Logged out successfully");
  },
}));

export const useDoctors = create<DoctorsState>((set) => ({
  loading: false,
  error: null,
  doctors: [],
  getAllDoctors: async (token) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/admin/all-doctors`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.data) {
        const { data } = response.data;
        set({ doctors: data, loading: false });
      } else {
        set({ loading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Error: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },

  changeAvailability: async (token, docId) => {
    try {
      await axios.post(
        `${backendURL}/api/admin/change-availability/${docId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      set((state) => ({
        doctors: state.doctors.map((doctor) =>
          doctor._id === docId
            ? { ...doctor, available: !doctor.available }
            : doctor
        ),
      }));
      toast.dismiss();
      toast.success("Availability status updated successfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Error: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },
}));

export const useAppointments = create<AppoitmentState>((set) => ({
  loading: false,
  statusLoading: false,
  appointments: [],
  doctorAppointments: [],
  currency: "$",
  getAllAppointments: async (token) => {
    try {
      set({ loading: true });
      const response = await axios.get(
        `${backendURL}/api/admin/get-appointments`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.data) {
        const { data } = response.data;
        set({ appointments: data, loading: false });
      } else {
        set({ loading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Error: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },
  cancelAppointment: async (token, appointmentId) => {
    try {
      console.log("Token from cancel appointment : ", token);
      set({ loading: true });

      // Make the API request to cancel the appointment
      const response = await axios.post(
        `${backendURL}/api/admin/cancel-appointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        // If the cancellation was successful, update the local state
        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, cancelled: true } // Mark the appointment as cancelled
              : appointment
          ),
        }));

        set({ loading: false });

        toast.dismiss();
        toast.success("Appointment cancelled");
      } else {
        set({ loading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Error: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },
  cancelDoctorAppointment: async (dToken, appointmentId) => {
    try {
      console.log("Token from cancel appointment : ", dToken);
      set({ statusLoading: true });

      // Make the API request to cancel the appointment
      const response = await axios.post(
        `${backendURL}/api/doctor/cancel-appointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );

      if (response && response.data) {
        // If the cancellation was successful, update the local state
        set((state) => ({
          doctorAppointments: state.doctorAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, cancelled: true } // Mark the appointment as cancelled
              : appointment
          ),
        }));

        set({ statusLoading: false });

        toast.dismiss();
        toast.success("Appointment cancelled");
      } else {
        set({ statusLoading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ statusLoading: false });

      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Error: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },
  markDoctorAppointment: async (dToken, appointmentId) => {
    try {
      console.log("Token from mark appointment : ", dToken);
      set({ statusLoading: true });

      // Make the API request to cancel the appointment
      const response = await axios.post(
        `${backendURL}/api/doctor/mark-appointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );

      if (response && response.data) {
        // If the cancellation was successful, update the local state
        set((state) => ({
          doctorAppointments: state.doctorAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, isCompleted: true } // Mark the appointment as cancelled
              : appointment
          ),
        }));

        set({ statusLoading: false });

        toast.dismiss();
        toast.success("Appointment marked");
      } else {
        set({ statusLoading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Error: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },
  getDoctorAppointments: async (dToken) => {
    try {
      set({ loading: true });
      const response = await axios.get(
        `${backendURL}/api/doctor/doctor-appointments`,

        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
      if (response && response.data) {
        const { data } = response.data;
        set({ doctorAppointments: data, loading: false });
      } else {
        set({ loading: false });
        toast.dismiss();
        toast.error("Something went wrong");
      }
    } catch (error: unknown) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Error: " + (error.response?.data.message || error.message)
        );
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  },
}));

export default useAuthStore;
