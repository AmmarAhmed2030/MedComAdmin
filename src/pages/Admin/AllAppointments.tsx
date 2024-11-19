import { useEffect } from "react";
import useAuthStore, { useAppointments } from "../../zustand/store";
import { assets } from "../../assets/assets";
const calculateAge = (dob: string) => {
  const today = new Date();
  const birthDate = new Date(dob);
  const age = today.getFullYear() - birthDate.getFullYear();
  return age;
};
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
const slotDateFormat = (slotDate: string) => {
  const dateArray = slotDate.split("_");
  return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
};
const AllAppointments = () => {
  const { token } = useAuthStore();
  const { appointments, getAllAppointments, currency, cancelAppointment } =
    useAppointments();
  useEffect(() => {
    getAllAppointments(token);
  }, [getAllAppointments, token]);
  console.log("All Appointments ", appointments);
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll scrollbar-thin scrollbar-corner-rounded-* shadow-lg">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((appointment, index) => (
          <div
            key={appointment._id}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                src={appointment.userData.image}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <p>{appointment.userData.name}</p>
            </div>
            <p className="max-sm:hidden">
              {calculateAge(appointment.userData.dob)}
            </p>
            <p>
              {slotDateFormat(appointment.slotDate)}, {appointment.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                src={appointment.docData.image}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <p>{appointment.docData.name}</p>
            </div>
            <p>
              {currency}
              {appointment.amount}
            </p>
            {appointment.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : (
              <img
                onClick={() => {
                  cancelAppointment(token, appointment._id);
                  getAllAppointments(token);
                }}
                src={assets.cancel_icon}
                alt=""
                className="w-10 cursor-pointer "
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
