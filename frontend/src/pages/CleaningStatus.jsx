import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import guestDetails from "../assets/images/guestdetails.jpg";

function CleaningStatus() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    axios
      .get("http://localhost:4000/api/rooms/not-cleaned")
      .then((res) => setRooms(res.data))
      .catch((err) => toast.error(err));
  };

  const markAsCleaned = (roomId, roomNumber) => {
    axios
      .put(`http://localhost:4000/api/rooms/mark-cleaned/${roomId}`)
      .then(() => {
        fetchRooms();
        toast.success(`Room ${roomNumber} cleaned successfully`);
      })
      .catch((err) => console.error(err));
  };

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
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl overflow-hidden mx-2 sm:mx-4">
        <div className="bg-[#d9232e] py-4 sm:py-5 px-4 sm:px-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white text-center">
            Room Cleaning Status
          </h1>
        </div>

        {rooms.length === 0 ? (
          <p className="text-center text-gray-600 p-4 sm:p-6 text-sm sm:text-base">
            All rooms are cleaned ✅
          </p>
        ) : (
          <ul className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            {rooms.map((room) => (
              <li
                key={room._id}
                className="flex flex-col xs:flex-row justify-between items-center bg-gray-50 p-3 sm:p-4 rounded shadow gap-2 sm:gap-0"
              >
                <span className="text-base sm:text-lg font-medium whitespace-nowrap">
                  Room No: {room.roomNo}
                </span>
                <button
                  onClick={() => markAsCleaned(room._id, room.roomNo)}
                  className="bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-green-700 transition cursor-pointer text-sm sm:text-base w-full xs:w-auto"
                >
                  Mark as Cleaned
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CleaningStatus;
