import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import guestDetails from "../assets/images/guestdetails.jpg";

function ManageRoom() {
  const navigate = useNavigate();

  const [roomids, setRoomIds] = useState([]);
  const [roomid, setRoomId] = useState("");
  const [roomdata, setRoomData] = useState({});

  useEffect(() => {
    fetchRoom();
  }, []);

  function fetchRoom() {
    axios
      .get(`http://localhost:4000/api/rooms/roomids`)
      .then((response) => {
        console.log(response.data.success);
        const ids = response.data?.retdata;
        setRoomIds(Array.isArray(ids) ? ids : []);
      })
      .catch((error) => {
        console.error("Error fetching rooms data:", error);
        setRoomIds([]);
      });
  }

  function changeRoomId(event) {
    setRoomId(event.target.value);
  }

  function handleSubmit() {
    axios
      .get(`http://localhost:4000/api/rooms/roomid/${roomid}`)
      .then((response) => {
        const fetchedRoomData = response.data.retdata;
        setRoomData(fetchedRoomData);
        navigate("/updateroom", { state: { roomdata: fetchedRoomData } });
      })
      .catch((error) => {
        console.error("Error fetching room details:", error);
      });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 my-1 relative"
      style={{
        backgroundImage: `url(${guestDetails})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#d9232e] p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-white">
            Manage Room
          </h1>
          <p className="text-center text-white mt-1 text-sm sm:text-base">
            Select a room to update its details
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="roomid"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              Select Room
            </label>
            <div className="relative">
              <select
                id="roomid"
                value={roomid}
                onChange={changeRoomId}
                className="block w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="" disabled className="text-gray-400">
                  Choose a room...
                </option>
                {roomids.map((id) => (
                  <option key={id} value={id} className="text-gray-800">
                    Room {id}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!roomid}
            className={`w-full py-2 px-4 sm:py-3 sm:px-4 rounded-lg shadow-md font-medium text-white transition-all duration-200 ${
              roomid
                ? "bg-[#d9232e] hover:from-red-700 hover:to-red-800 transform hover:-translate-y-0.5 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <span className="flex items-center justify-center text-sm sm:text-base">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Continue to Update
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageRoom;
