import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import guestDetails from "../assets/images/guestdetails.jpg";

function BookingRequest() {
  const [roombookings, setRoombookings] = useState([]);
  const [eventbookings, setEventbookings] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [totalRoomPages, setTotalRoomPages] = useState(1);
  const [totalEventPages, setTotalEventPages] = useState(1);
  const [totalRoomBookings, setTotalRoomBookings] = useState(0);
  const [totalEventBookings, setTotalEventBookings] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestToUpdate, setGuestToUpdate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [reason, setReason] = useState("");
  const [inputSummary, setInputSummary] = useState("");
  const [roomguest, setRoomGuest] = useState([]);
  const [eventguest, setEventGuest] = useState([]);

  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endRoomIndex = Math.min(page * itemsPerPage, totalRoomBookings);
  const endEventIndex = Math.min(page * itemsPerPage, totalEventBookings);

  useEffect(() => {
    fetchRoomBooking();
    fetchEventBooking();
  }, [page]);

  function fetchRoomBooking() {
    axios
      .get(`http://localhost:4000/api/roombookings/getroombookings`, {
        params: { page, itemsPerPage },
      })
      .then((response) => {
        console.log("Room Booking API Response:", response.data);
        if (response.data.success) {
          setRoomGuest(
            Array.isArray(response.data.data) ? response.data.data : []
          );
          setRoombookings(
            Array.isArray(response.data.retdata) ? response.data.retdata : []
          );
          setTotalRoomPages(response.data.totalPages || 1);
          setTotalRoomBookings(
            response.data.totalBookings || response.data.retdata?.length || 0
          );
        } else {
          toast.error(response.data.message || "Failed to fetch room bookings");
          setRoombookings([]);
          setRoomGuest([]);
          setTotalRoomBookings(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching room bookings:", error);
        toast.error("Error fetching room bookings");
        setRoombookings([]);
        setRoomGuest([]);
        setTotalRoomBookings(0);
      });
  }

  function fetchEventBooking() {
    axios
      .get(`http://localhost:4000/api/eventbookings/geteventbookings`, {
        params: { page, itemsPerPage },
      })
      .then((response) => {
        console.log("Event Booking API Response:", response.data);
        if (response.data.success) {
          setEventGuest(
            Array.isArray(response.data.data) ? response.data.data : []
          );
          setEventbookings(
            Array.isArray(response.data.retdata) ? response.data.retdata : []
          );
          setTotalEventPages(response.data.totalPages || 1);
          setTotalEventBookings(
            response.data.totalBookings || response.data.retdata?.length || 0
          );
        } else {
          toast.error(
            response.data.message || "Failed to fetch event bookings"
          );
          setEventbookings([]);
          setEventGuest([]);
          setTotalEventBookings(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching event bookings:", error);
        toast.error("Error fetching event bookings");
        setEventbookings([]);
        setEventGuest([]);
        setTotalEventBookings(0);
      });
  }

  function getRoomGuestDetails(email) {
    const guest = roomguest.find((guest) => guest.email === email);
    return guest || null;
  }

  function getEventGuestDetails(email) {
    const guest = eventguest.find((guest) => guest.email === email);
    return guest || null;
  }

  const generateDescription = async () => {
    if (!inputSummary.trim()) {
      toast.error("Please enter a short reason summary first.");
      setErrorMessage("Please enter a short reason summary first.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/ai/generatedenydescription",
        {
          summary: inputSummary,
        }
      );
      setReason(res.data.description || "");
      setErrorMessage("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error("AI Error: " + errorMsg);
      setErrorMessage("Failed to generate description: " + errorMsg);
    }
  };

  const approveActivity = async () => {
    if (!guestToUpdate) return;

    const bookingType = guestToUpdate.type;
    const guestDetails =
      bookingType === "Room"
        ? getRoomGuestDetails(guestToUpdate.email)
        : getEventGuestDetails(guestToUpdate.email);
    const phone = guestDetails?.phoneNumber;
    console.log(phone);

    const endpoint =
      bookingType === "Room"
        ? `http://localhost:4000/api/roombookings/updateroomstatus/${guestToUpdate._id}`
        : `http://localhost:4000/api/eventbookings/updateeventstatus/${guestToUpdate._id}`;

    try {
      const response = await axios.put(endpoint, { status: "Accepted" });
      if (response.data) {
        toast.success(`${bookingType} booking request accepted successfully!`);
        /* if (phone && typeof phone === "string" && phone.trim()) {
          try {
            await axios.post(
              "http://localhost:4000/api/notification/send-sms",
              {
                phoneNumber: phone,
                message: "Your booking has been accepted from our service",
              }
            );
          } catch (smsError) {
            console.error("Error sending SMS:", smsError);
            toast.warn("Booking accepted, but failed to send SMS notification");
          }
        } else {
          toast.warn(
            "Booking accepted, but no valid phone number found for SMS"
          );
        } */
        bookingType === "Room" ? fetchRoomBooking() : fetchEventBooking();
      } else {
        toast.error(response.data.message || "Failed to approve booking");
      }
      setIsModalOpen(false);
      setGuestToUpdate(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error approving booking");
      setIsModalOpen(false);
      setGuestToUpdate(null);
    }
  };

  const denyActivity = async () => {
    if (!guestToUpdate) return;
    if (reason.trim() === "") {
      setErrorMessage("Please provide a reason for denying the booking.");
      return;
    }

    const bookingType = guestToUpdate.type;
    const guestDetails =
      bookingType === "Room"
        ? getRoomGuestDetails(guestToUpdate.email)
        : getEventGuestDetails(guestToUpdate.email);
    const phone = guestDetails?.phoneNumber;
    console.log(phone);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/cancelbookings/cancelbookingadmin",
        {
          email: guestToUpdate.email,
          bookingid: guestToUpdate._id,
          type: bookingType,
          reason,
        }
      );
      if (response.data) {
        toast.success("Booking cancelled successfully.");
        /* if (phone && typeof phone === "string" && phone.trim()) {
          try {
            await axios.post(
              "http://localhost:4000/api/notification/send-sms",
              {
                phoneNumber: phone,
                message: `Your booking has been denied. Reason: ${reason}`,
              }
            );
          } catch (smsError) {
            console.error("Error sending SMS:", smsError);
            toast.warn("Booking denied, but failed to send SMS notification");
          }
        } else {
          toast.warn("Booking denied, but no valid phone number found for SMS");
        } */
        bookingType === "Room" ? fetchRoomBooking() : fetchEventBooking();
      } else {
        toast.error(response.data.message || "Failed to cancel booking");
      }
      setIsModalOpen(false);
      setGuestToUpdate(null);
      setReason("");
      setInputSummary("");
      setErrorMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling booking");
      setIsModalOpen(false);
      setGuestToUpdate(null);
      setReason("");
      setInputSummary("");
      setErrorMessage("");
    }
  };

  const cancelActivity = () => {
    setIsModalOpen(false);
    setGuestToUpdate(null);
    setErrorMessage("");
    setReason("");
    setInputSummary("");
  };

  function handleAccept(id, type, email) {
    setStatus("Accepted");
    setGuestToUpdate({ _id: id, type, email });
    setIsModalOpen(true);
    setErrorMessage("");
    setReason("");
    setInputSummary("");
  }

  function handleDeny(id, type, email) {
    setStatus("Denied");
    setGuestToUpdate({ _id: id, type, email });
    setIsModalOpen(true);
    setErrorMessage("");
    setReason("");
    setInputSummary("");
  }

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spokenReason = event.results[0][0].transcript;
      setReason(spokenReason);
      setErrorMessage("");
    };

    recognition.onerror = (event) => {
      toast.error("Voice input error: " + event.error);
    };

    recognition.start();
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
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Room Bookings Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-[#d9232e] py-4 sm:py-6 px-4 sm:px-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
              Room Bookings
            </h1>
          </div>

          <div className="p-2 sm:p-4 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    {[
                      "No",
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
                        className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roombookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan="12"
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        No room bookings found
                      </td>
                    </tr>
                  ) : (
                    roombookings.map((item, index) => {
                      const guest = getRoomGuestDetails(item.email);
                      return (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                            {startIndex + index}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {guest?.fname || "N/A"}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {guest?.lname || "N/A"}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {guest?.nic || "N/A"}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(item.checkin).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(item.checkout).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {item.adult}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {item.children}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {item.nationality || "N/A"}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {item.noofrooms}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {item.kitchen}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row justify-center gap-1 sm:gap-2">
                            <button
                              onClick={() =>
                                handleAccept(item._id, "Room", item.email)
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleDeny(item._id, "Room", item.email)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
                            >
                              Deny
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination for Room Bookings */}
          <div className="flex items-center justify-between mt-4 sm:mt-6 bg-white rounded-xl shadow-md p-2 sm:p-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`relative inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md ${
                  page === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <span className="text-xs text-gray-700 mx-2 my-auto">
                Page {page} of {totalRoomPages}
              </span>
              <button
                disabled={page >= totalRoomPages}
                onClick={() => setPage(page + 1)}
                className={`relative inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md ${
                  page >= totalRoomPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex}</span> to{" "}
                  <span className="font-medium">{endRoomIndex}</span> of{" "}
                  <span className="font-medium">{totalRoomBookings}</span> room
                  bookings
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                      page === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {Array.from({ length: totalRoomPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-xs sm:text-sm font-medium ${
                          page === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                  <button
                    disabled={page >= totalRoomPages}
                    onClick={() => setPage(page + 1)}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                      page >= totalRoomPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Event Bookings Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#d9232e] py-4 sm:py-6 px-4 sm:px-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
              Event Bookings
            </h1>
          </div>

          <div className="p-2 sm:p-4 md:p-8 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-100">
                  <tr>
                    {[
                      "No",
                      "First Name",
                      "Last Name",
                      "NIC",
                      "Event Name",
                      "Booking Date",
                      "Guests",
                      "Budget",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eventbookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        No event bookings found
                      </td>
                    </tr>
                  ) : (
                    eventbookings.map((item, index) => {
                      const guest = getEventGuestDetails(item.email);
                      return (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                            {startIndex + index}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {guest?.fname || "N/A"}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {guest?.lname || "N/A"}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {guest?.nic || "N/A"}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {item.eventType}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(item.eventDate).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {item.guests}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {item.totalAmount}
                          </td>
                          <td className="px-2 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row justify-center gap-1 sm:gap-2">
                            <button
                              onClick={() =>
                                handleAccept(item._id, "Event", item.email)
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleDeny(item._id, "Event", item.email)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
                            >
                              Deny
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination for Event Bookings */}
          <div className="flex items-center justify-between mt-4 sm:mt-6 bg-white rounded-xl shadow-md p-2 sm:p-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`relative inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md ${
                  page === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <span className="text-xs text-gray-700 mx-2 my-auto">
                Page {page} of {totalEventPages}
              </span>
              <button
                disabled={page >= totalEventPages}
                onClick={() => setPage(page + 1)}
                className={`relative inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md ${
                  page >= totalEventPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex}</span> to{" "}
                  <span className="font-medium">{endEventIndex}</span> of{" "}
                  <span className="font-medium">{totalEventBookings}</span>{" "}
                  event bookings
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                      page === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {Array.from({ length: totalEventPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-xs sm:text-sm font-medium ${
                          page === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                  <button
                    disabled={page >= totalEventPages}
                    onClick={() => setPage(page + 1)}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border bordernbr-gray-300 bg-white text-xs sm:text-sm font-medium ${
                      page >= totalEventPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-md sm:max-w-lg shadow-2xl">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
                {status === "Denied" ? "Deny Booking" : "Approve Booking"}
              </h3>
              {guestToUpdate && (
                <div className="mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base text-gray-600">
                    <strong>Guest:</strong>{" "}
                    {(guestToUpdate.type === "Room"
                      ? getRoomGuestDetails(guestToUpdate.email)
                      : getEventGuestDetails(guestToUpdate.email)
                    )?.fname || "N/A"}{" "}
                    {(guestToUpdate.type === "Room"
                      ? getRoomGuestDetails(guestToUpdate.email)
                      : getEventGuestDetails(guestToUpdate.email)
                    )?.lname || "N/A"}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    <strong>Email:</strong> {guestToUpdate.email || "N/A"}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    <strong>Type:</strong> {guestToUpdate.type}
                  </p>
                </div>
              )}
              {status === "Denied" && (
                <div className="mb-4 sm:mb-6">
                  <label className="text-sm sm:text-base text-gray-600 block mb-1 sm:mb-2">
                    Reason Summary
                  </label>
                  <input
                    type="text"
                    value={inputSummary}
                    onChange={(e) => setInputSummary(e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                    placeholder="Enter a short summary for AI generation"
                  />
                  <button
                    onClick={generateDescription}
                    className="mt-2 sm:mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white py-1 sm:py-2 rounded-xl transition cursor-pointer text-sm sm:text-base"
                  >
                    Generate Description
                  </button>
                  <label className="text-sm sm:text-base text-gray-600 block mt-2 sm:mt-4 mb-1 sm:mb-2">
                    Reason for Denial
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none text-sm sm:text-base"
                    rows="4"
                    placeholder="Enter or edit reason for denying the booking"
                  />

                  {errorMessage && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 sm:mt-3 text-center">
                      {errorMessage}
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-between gap-2 sm:gap-4">
                <button
                  onClick={cancelActivity}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 sm:px-6 sm:py-2 rounded-xl transition cursor-pointer text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={status === "Denied" ? denyActivity : approveActivity}
                  className={`${
                    status === "Denied"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-3 py-1 sm:px-6 sm:py-2 rounded-xl transition cursor-pointer text-sm sm:text-base`}
                >
                  {status === "Denied" ? "Deny" : "Approve"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingRequest;
