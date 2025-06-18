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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex justify-center items-center p-5">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Available Rooms
        </h1>

        {rooms.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No available rooms at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.roomNo}
                className="bg-gray-100 rounded-xl p-6 shadow-md transition-transform transform hover:scale-105"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Room {room.roomNo}
                </h2>
                <p className="text-gray-600 text-sm">
                  <strong>Type:</strong> {room.roomType}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Price:</strong> Rs{room.pricePerNight} per night
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Status:</strong> {room.availabilityStatus}
                </p>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all">
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
