import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import guestDetails from "../assets/images/guestdetails.jpg";

function UpdateRoom() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const roomdata = state?.roomdata || {};

  const [roomid, setRoomId] = useState(roomdata.roomNo || "");
  const [roomtype, setRoomType] = useState(roomdata.roomType || "");
  const [pricePerNight, setPricePerNight] = useState(
    roomdata.pricePerNight || ""
  );
  const [availabilityStatus, setAvailabilityStatus] = useState(
    roomdata.availabilityStatus || ""
  );
  const [cleaningStatus, setCleaningStatus] = useState(
    roomdata.cleaningStatus || ""
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [priceErrorMessage, setPriceErrorMessage] = useState("");
  const [availabilityErrorMessage, setAvailabilityErrorMessage] = useState("");
  const [cleaningErrorMessage, setCleaningErrorMessage] = useState("");

  const costRegex = /^(1000|[1-9][0-9]{3,})(\.[0-9]{1,2})?$/;

  function changePricePerNight(event) {
    setPricePerNight(event.target.value);
  }

  function changeAvailabilityStatus(event) {
    setAvailabilityStatus(event.target.value);
  }

  function changeCleaningStatus(event) {
    setCleaningStatus(event.target.value);
  }

  function handleSubmitUpdate(event) {
    event.preventDefault();

    let validationSuccess = 0;

    if (
      !String(pricePerNight).trim() ||
      availabilityStatus === "Default" ||
      cleaningStatus === "Default"
    ) {
      setErrorMessage("One of the fields is missing");
      toast.error("❌ Please fill in all fields!");
      return;
    } else {
      setErrorMessage("");
    }

    if (!costRegex.test(pricePerNight)) {
      setPriceErrorMessage(
        "❌ Invalid price. Enter a positive number greater than 1000"
      );
    } else {
      setPriceErrorMessage("");
      validationSuccess++;
    }

    if (availabilityStatus != "Default") {
      setAvailabilityErrorMessage("");
      validationSuccess++;
    } else {
      setAvailabilityErrorMessage("❌ Please select an availability status");
    }

    if (cleaningStatus != "Default") {
      setCleaningErrorMessage("");
      validationSuccess++;
    } else {
      setCleaningErrorMessage("❌ Please select a cleaning status");
    }

    if (validationSuccess === 3) {
      axios
        .put(`http://localhost:4000/api/rooms/updateroom/${roomid}`, {
          roomid,
          roomtype,
          pricePerNight,
          availabilityStatus,
          cleaningStatus,
        })
        .then((data) => {
          if (data.data) {
            toast.success("Room updated successfully!");
            setTimeout(() => navigate("/manageroom"), 2000);
          } else {
            toast.error("Room updation was unsuccessfull!");
          }
        })
        .catch((err) => {
          toast.error("Update failed!");
          console.error("Update error:", err);
        });
    }
  }

  function deleteRoom() {
    axios
      .delete(`http://localhost:4000/api/rooms/deleteroom/${roomid}`)
      .then((data) => {
        if (data.data) {
          toast.success("Room deleted successfully!");
          setTimeout(() => navigate("/manageroom"), 2000);
        } else {
          toast.error("Room deletion was unsuccessful!");
        }
      })
      .catch((err) => {
        toast.error("Delete failed!");
        console.error("Delete error:", err);
      });
  }

  function handleSubmitDelete() {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold text-gray-800">
            Are you sure you want to delete this room?
          </p>
          <div className="flex justify-end mt-2 gap-2">
            <button
              onClick={() => {
                deleteRoom();
                closeToast();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        position: "top-center",
      }
    );
  }

  return (
    <div
          className="min-h-screen flex flex-col items-center justify-center p-2 my-1 relative"
          style={{
            backgroundImage: `url(${guestDetails})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
          }}
        >
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
      />

      {roomdata && Object.keys(roomdata).length > 0 ? (
        <form
          onSubmit={handleSubmitUpdate}
          className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="bg-[#d9232e] p-6 text-white">
            <h1 className="text-2xl font-bold text-center">
              Update Room Details
            </h1>
            <p className="text-center text-white mt-1">
              Modify the room information as needed
            </p>
          </div>

          <div className="p-6 space-y-5">
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Room ID
              </label>
              <input
                type="text"
                value={roomdata.roomNo}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Room Type
              </label>
              <input
                type="text"
                value={roomdata.roomType}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Price Per Night
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">Rs</span>
                </div>
                <input
                  type="number"
                  placeholder="Enter price"
                  onChange={changePricePerNight}
                  value={pricePerNight}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {priceErrorMessage && (
                <p className="text-sm text-red-600">{priceErrorMessage}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Availability Status
              </label>
              <select
                onChange={changeAvailabilityStatus}
                value={availabilityStatus}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Default" disabled>
                  Select Availability
                </option>
                <option value="Yes">Available</option>
                <option value="No">Not Available</option>
              </select>
              {availabilityErrorMessage && (
                <p className="text-sm text-red-600">
                  {availabilityErrorMessage}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Cleaning Status
              </label>
              <select
                onChange={changeCleaningStatus}
                value={cleaningStatus}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Default" disabled>
                  Select Cleaning Status
                </option>
                <option value="Cleaned">Cleaned</option>
                <option value="Not Cleaned">Not Cleaned</option>
              </select>
              {cleaningErrorMessage && (
                <p className="text-sm text-red-600">{cleaningErrorMessage}</p>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-sm hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
              >
                Update Room
              </button>
              <button
                type="button"
                onClick={handleSubmitDelete}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-sm hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all cursor-pointer"
              >
                Delete Room
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
            <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading room details...</p>
        </div>
      )}
    </div>
  );
}

export default UpdateRoom;
