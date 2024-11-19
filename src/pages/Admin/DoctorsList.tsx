import { useEffect } from "react";
import useAuthStore, { useDoctors } from "../../zustand/store";

const DoctorsList = () => {
  const { token } = useAuthStore();
  const { doctors, getAllDoctors, changeAvailability } = useDoctors();
  useEffect(() => {
    getAllDoctors(token);
  }, [getAllDoctors, token]);
  console.log(doctors);
  return (
    <div className="m-5 max-h-[90vh] overflow-y-auto">
      <h1 className="text-lg font-medium mx-auto">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 justify-center gap-y-6">
        {doctors.map((doc) => (
          <div
            className="border border-green-200 rounded-xl max-w-64  overflow-hidden cursor-pointer group"
            key={doc._id}
          >
            <img
              className="bg-green-50 w-64 h-72 group-hover:bg-primary transition-all duration-500 "
              src={doc.image}
              alt=""
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">{doc.name}</p>
              <p className="text-zinc-600 text-sm">{doc.speciality}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  onChange={() => changeAvailability(token, doc._id || "")}
                  checked={doc.available}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
