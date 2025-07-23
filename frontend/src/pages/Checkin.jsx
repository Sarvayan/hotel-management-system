import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import guestDetails from "../assets/images/guestdetails.jpg";

const Checkin = () => {
  const [roombookings, setRoombookings] = useState([]);
  const [eventbookings, setEventbookings] = useState([]);
  const [page, setPage] = useState(1);
  const [roomTotalPages, setRoomTotalPages] = useState(1);
  const [eventTotalPages, setEventTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestToUpdate, setGuestToUpdate] = useState(null);
  const [roomguest, setRoomGuest] = useState([]);
  const [eventguest, setEventGuest] = useState([]);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    fetchRoomBooking();
    fetchEventBooking();
  }, [page]);

  const fetchRoomBooking = () => {
    axios
      .get(`http://localhost:4000/api/roombookings/getAroombookings`, {
        params: { page },
      })
      .then((response) => {
        setRoomGuest(response.data.data);
        setRoombookings(response.data.retdata);
        setRoomTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching room bookings:", error);
      });
  };

  const fetchEventBooking = () => {
    axios
      .get(`http://localhost:4000/api/eventbookings/getAeventbookings`, {
        params: { page },
      })
      .then((response) => {
        setEventGuest(response.data.data);
        setEventbookings(response.data.retdata);
        setEventTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching event bookings:", error);
      });
  };

  const getRoomGuestDetails = (email) => {
    return roomguest.find((guest) => guest.email === email);
  };

  const getEventGuestDetails = (email) => {
    return eventguest.find((guest) => guest.email === email);
  };

  const approveActivity = () => {
    if (!guestToUpdate) return;

    const bookingType = guestToUpdate.type;

    const endpoint =
      bookingType === "Room"
        ? `http://localhost:4000/api/roombookings/updateroomstatus/${guestToUpdate._id}`
        : `http://localhost:4000/api/eventbookings/updateeventstatus/${guestToUpdate._id}`;

    axios
      .put(endpoint, { status: "CheckedIn" })
      .then((response) => {
        if (response.data) {
          setIsModalOpen(false);
          toast.success("Checked in successfully!");
          bookingType === "Room" ? fetchRoomBooking() : fetchEventBooking();
        }
      })
      .catch((error) => {
        setIsModalOpen(false);
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        toast.error("Error: " + errorMessage);
      });
  };

  const handleAccept = (id, type) => {
    setGuestToUpdate({ _id: id, type });
    approveActivity();
  };

  const handleVoiceInput = () => {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const spokenReason = event.results[0][0].transcript;
      console.log("Spoken Reason:", spokenReason);
    };

    recognition.onerror = (event) => {
      toast.error("Voice input error: " + event.error);
    };
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
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden mx-2 sm:mx-4 md:mx-8">
        {/* Room Bookings Section */}
        <div className="bg-[#d9232e] py-4 sm:py-6 px-4 sm:px-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
            Room Booked Guest Details
          </h1>
        </div>

        <div className="p-2 sm:p-4 md:p-8 overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm md:text-base text-gray-800 bg-white border-separate border-spacing-y-2 sm:border-spacing-y-3">
              <thead>
                <tr className="bg-blue-100 rounded-md">
                  {[
                    "First Name",
                    "Last Name",
                    "NIC",
                    "Check-in",
                    "Check-out",
                    "Adults",
                    "Children",
                    "Nationality",
                    "Rooms",
                    "Kitchen",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-2 sm:p-3 text-left font-semibold whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roombookings.map((item, index) => {
                  const guest = getRoomGuestDetails(item.email);
                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 rounded-md transition"
                    >
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {guest?.fname || "N/A"}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {guest?.lname || "N/A"}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {guest?.nic || "N/A"}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {new Date(item.checkin).toLocaleDateString()}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {new Date(item.checkout).toLocaleDateString()}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {item.adult}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {item.children}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {item.nationality}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {item.noofrooms}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {item.kitchen}
                      </td>
                      <td className="p-2 sm:p-3 flex justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleAccept(item._id, "Room")}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
                        >
                          Check In
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Bookings Section */}
        <div className="bg-[#d9232e] py-4 sm:py-6 px-4 sm:px-8 mt-4 sm:mt-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
            Event Booked Guest Details
          </h1>
        </div>

        <div className="p-2 sm:p-4 md:p-8 overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm md:text-base text-gray-800 bg-white border-separate border-spacing-y-2 sm:border-spacing-y-3">
              <thead>
                <tr className="bg-purple-100 rounded-md">
                  {[
                    "First Name",
                    "Last Name",
                    "NIC",
                    "Event Name",
                    "Booking Date",
                    "Check-out Date",
                    "Guests",
                    "Budget",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-2 sm:p-3 text-left font-semibold whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eventbookings.map((item, index) => {
                  const guest = getEventGuestDetails(item.email);
                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 rounded-md transition"
                    >
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {guest?.fname || "N/A"}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {guest?.lname || "N/A"}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {guest?.nic || "N/A"}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {item.eventType}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {new Date(item.eventDate).toLocaleDateString()}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {new Date(item.checkoutDate).toLocaleDateString()}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {item.guests}
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {item.totalAmount}
                      </td>
                      <td className="p-2 sm:p-3 flex justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleAccept(item._id, "Event")}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
                        >
                          Check In
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkin;
