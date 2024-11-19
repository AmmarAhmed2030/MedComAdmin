import { useEffect } from "react";
import useAuthStore, {
  useAppointments,
  useDashboardData,
} from "../../zustand/store";
import Loader from "../../components/Loader";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const { token } = useAuthStore();
  const { dashboardData, getDashboardData, loading } = useDashboardData();
  const { cancelAppointment } = useAppointments();
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
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  useEffect(() => {
    getDashboardData(token);
  }, [getDashboardData, token]);
  return loading ? (
    <Loader />
  ) : (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52  rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.doctor_icon} alt="" />
          <div>
            <p className="tetx-xl font-semibold text-gray-600">
              {dashboardData?.doctors}
            </p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointments_icon} alt="" />
          <div>
            <p className="tetx-xl font-semibold text-gray-600">
              {dashboardData?.appointments}
            </p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4  min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="tetx-xl font-semibold text-gray-600">
              {dashboardData?.patients}
            </p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>
      <div className="bg-white ">
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>
        <div className="pt-4 border border-t-0">
          {dashboardData?.latestAppointments.map((appointment) => (
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
              {appointment.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : (
                <img
                  onClick={() => {
                    cancelAppointment(token, appointment._id);
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
    </div>
  );
};

export default Dashboard;
