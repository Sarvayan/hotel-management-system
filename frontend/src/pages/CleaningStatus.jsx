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
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-[#d9232e] py-5 px-6">
        <h1 className="text-2xl font-bold text-white text-center">
          Room Cleaning Status
        </h1>
      </div>

      {rooms.length === 0 ? (
        <p className="text-center text-gray-600 p-6">
          All rooms are cleaned ✅
        </p>
      ) : (
        <ul className="space-y-4 p-6">
          {rooms.map((room) => (
            <li
              key={room._id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded shadow"
            >
              <span className="text-lg font-medium">
                Room No: {room.roomNo}
              </span>
              <button
                onClick={() => markAsCleaned(room._id, room.roomNo)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
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
