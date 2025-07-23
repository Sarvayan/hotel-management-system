import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Room() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/rooms/getrooms")
      .then((data) => {
        if (data.data.success === true) {
          setRooms(data.data.rooms);
        } else {
          toast.error("❌ Error fetching room details.");
        }
      })
      .catch(() => {
        toast.error("❌ Fetching room details failed! Try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex justify-center items-center p-4 sm:p-6 md:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-3xl lg:max-w-4xl xl:max-w-6xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4 sm:mb-6">
          Available Rooms
        </h1>

        {rooms.length === 0 ? (
          <p className="text-center text-gray-600 text-base sm:text-lg">
            No available rooms at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {rooms.map((room) => (
              <div
                key={room.roomNo}
                className="bg-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-sm sm:shadow-md transition-transform transform hover:scale-[1.02] sm:hover:scale-105"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
                  Room {room.roomNo}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  <strong>Type:</strong> {room.roomType}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  <strong>Price:</strong> Rs{room.pricePerNight} per night
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  <strong>Status:</strong> {room.availabilityStatus}
                </p>
                <button className="mt-3 sm:mt-4 w-full bg-blue-600 text-white py-1 sm:py-2 rounded-md hover:bg-blue-700 transition-all text-sm sm:text-base">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Room;