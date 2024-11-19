import { useEffect } from "react";
import useAuthStore, { useAppointments } from "../../zustand/store";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";

const DoctorProfile = () => {
  const { dToken, doctor, loadingDoctor, getProfile } = useAuthStore();
  const { currency } = useAppointments();
  const navigate = useNavigate();
  useEffect(() => {
    if (dToken) {
      getProfile(dToken);
    }
  }, [dToken, getProfile]);
  return loadingDoctor ? (
    <Loader />
  ) : (
    doctor && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white ">
            {doctor?.image && (
              <div>
                <img
                  className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
                  src={doctor?.image}
                  alt=""
                />
              </div>
            )}
            {doctor.name && (
              <p className="flex items-center font-medium gap-2 text-3xl text-gray-700 mt-4">
                {doctor.name}
              </p>
            )}
            {doctor.degree ||
              doctor.experience ||
              (doctor.speciality && (
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  {doctor.degree ||
                    (doctor.speciality && (
                      <p>
                        {doctor.degree} - {doctor.speciality}
                      </p>
                    ))}
                  {doctor?.experience && (
                    <button className="py-0.5 px-2 border text-xs rounded-full">
                      {doctor?.experience}
                    </button>
                  )}
                </div>
              ))}
            {doctor.about && (
              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                  About:
                </p>
                <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                  {doctor.about}
                </p>
              </div>
            )}
            {doctor.fees && (
              <p className="text-gray-600 font-medium mt-4">
                Appointment fees:{" "}
                <span className="text-gray-800">
                  {currency}
                  {doctor.fees}
                </span>
              </p>
            )}
            {doctor.address?.line1 && (
              <div className="flex gap-2 py-2">
                <p>Address:</p>
                <p className="text-sm">
                  {doctor.address?.line1}
                  <br />
                  {doctor.address?.line2}
                </p>
              </div>
            )}
            <div className=" pt-2">
              <label>
                {doctor?.available
                  ? "Available for consulting"
                  : "Not Available"}
              </label>
            </div>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => navigate("/update-profile")}
                className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            </div>
          </div>
          {/* Align the button to the right */}
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
