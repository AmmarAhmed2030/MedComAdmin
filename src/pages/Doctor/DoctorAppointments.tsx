import { useEffect } from "react";
import useAuthStore, { useAppointments } from "../../zustand/store";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader";
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
const DoctorAppointments = () => {
  const { dToken } = useAuthStore();
  const {
    getDoctorAppointments,
    doctorAppointments,
    loading,
    currency,
    markDoctorAppointment,
    cancelDoctorAppointment,
  } = useAppointments();
  useEffect(() => {
    getDoctorAppointments(dToken);
  }, [dToken, getDoctorAppointments]);
  return loading ? (
    <Loader />
  ) : (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">My Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll scrollbar-thin scrollbar-corner-rounded-*">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b ">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className="text-center">Action</p>
        </div>
        {doctorAppointments.map((appt, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={appt._id}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full"
                src={appt.userData.image}
                alt=""
              />
              <p>{appt.userData.name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {appt.payment ? "Online" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(appt.userData.dob)}</p>
            <p>
              {slotDateFormat(appt.slotDate)}, {appt.slotTime}
            </p>
            <p>
              {currency}
              {appt.amount}
            </p>
            <div className="flex items-center justify-end gap-2">
              {appt.cancelled ? (
                appt.isCompleted ? null : (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                )
              ) : appt.isCompleted ? null : (
                <img
                  onClick={() => cancelDoctorAppointment(dToken, appt._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
              )}
              {appt.isCompleted ? (
                appt.cancelled ? null : (
                  <p className="text-primary text-xs font-medium">Completed</p>
                )
              ) : appt.cancelled ? null : (
                <img
                  onClick={() => markDoctorAppointment(dToken, appt._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt=""
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
