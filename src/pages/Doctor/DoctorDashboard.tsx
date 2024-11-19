import { useEffect } from "react";
import useAuthStore, {
  useAppointments,
  useDoctorDashboardData,
} from "../../zustand/store";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader";
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
const DoctorDashboard = () => {
  const { dToken } = useAuthStore();
  const {
    getDoctorAppointments,
    doctorAppointments,
    loading: appointmentLoading,
    currency,
    markDoctorAppointment,
    cancelDoctorAppointment,
  } = useAppointments();
  useEffect(() => {
    getDoctorAppointments(dToken);
  }, [dToken, getDoctorAppointments]);
  const { doctorDashboardData, getDoctorDashboardData, loading } =
    useDoctorDashboardData();
  useEffect(() => {
    getDoctorDashboardData(dToken);
  }, [dToken, getDoctorDashboardData]);
  return loading ? (
    <Loader />
  ) : (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52  rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.earning_icon} alt="" />
          <div>
            <p className="tetx-xl font-semibold text-gray-600">
              {currency} {doctorDashboardData?.earnings}
            </p>
            <p className="text-gray-400">Earnings</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointments_icon} alt="" />
          <div>
            <p className="tetx-xl font-semibold text-gray-600">
              {doctorDashboardData?.appointments}
            </p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4  min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="tetx-xl font-semibold text-gray-600">
              {doctorDashboardData?.patients}
            </p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>
      {appointmentLoading ? (
        <Loader />
      ) : (
        <div className="bg-white ">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="pt-4 border border-t-0">
            {doctorAppointments.slice(0, 5).map((appointment) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={appointment._id}
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src={appointment.docData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {appointment.docData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(appointment.slotDate)}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  {appointment.cancelled ? (
                    appointment.isCompleted ? null : (
                      <p className="text-red-400 text-xs font-medium">
                        Cancelled
                      </p>
                    )
                  ) : appointment.isCompleted ? null : (
                    <img
                      onClick={() =>
                        cancelDoctorAppointment(dToken, appointment._id)
                      }
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                  )}
                  {appointment.isCompleted ? (
                    appointment.cancelled ? null : (
                      <p className="text-primary text-xs font-medium">
                        Completed
                      </p>
                    )
                  ) : appointment.cancelled ? null : (
                    <img
                      onClick={() =>
                        markDoctorAppointment(dToken, appointment._id)
                      }
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
      )}
    </div>
  );
};

export default DoctorDashboard;
