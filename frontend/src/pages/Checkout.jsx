import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import guestDetails from "../assets/images/guestdetails.jpg";

const Checkout = () => {
  const [roombookings, setRoombookings] = useState([]);
  const [eventbookings, setEventbookings] = useState([]);
  const [page, setPage] = useState(1);
  const [roomTotalPages, setRoomTotalPages] = useState(1);
  const [eventTotalPages, setEventTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestToUpdate, setGuestToUpdate] = useState(null);
  const [roomguest, setRoomGuest] = useState([]);
  const [eventguest, setEventGuest] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    fetchRoomBooking();
    fetchEventBooking();
  }, [page]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4000/api/order/getorders"
        );
        console.log(response.data);
        setOrders(response.data || []);
      } catch (err) {
        setError("Error fetching order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  const fetchRoomBooking = () => {
    axios
      .get(`http://localhost:4000/api/roombookings/getCroombookings`, {
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
      .get(`http://localhost:4000/api/eventbookings/getCeventbookings`, {
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

  const getOrderTotalByEmail = (email) => {
    if (!Array.isArray(orders)) return 0;
    const guestOrders = orders.filter((order) => order.email === email);
    return guestOrders.reduce(
      (total, order) => total + (order.totalPrice || 0),
      0
    );
  };


  const approveActivity = async () => {
    if (!guestToUpdate) return;

    const bookingType = guestToUpdate.type;
    const bookingEndpoint =
      bookingType === "Room"
        ? `http://localhost:4000/api/roombookings/getbooking/${guestToUpdate._id}`
        : `http://localhost:4000/api/eventbookings/getbooking/${guestToUpdate._id}`;

    try {
      
      const bookingResponse = await axios.get(bookingEndpoint);
      const bookingData = bookingResponse.data;

      
      const guestOrders = orders.filter(
        (order) => order.email === bookingData.email
      );

      
      const checkoutResponse = await axios.post(
        `http://localhost:4000/api/checkout/create`,
        {
          bookingType,
          bookingData,
          guestOrders,
        }
      );

      
      if (checkoutResponse.status === 201 || checkoutResponse.status === 200) {
        if (bookingType === "Room") {
          await axios.delete(
            `http://localhost:4000/api/roombookings/delete/${guestToUpdate._id}`
          );
        } else {
          await axios.delete(
            `http://localhost:4000/api/eventbookings/delete/${guestToUpdate._id}`
          );
        }

        await axios.delete(
          `http://localhost:4000/api/order/deletebyemail/${bookingData.email}`
        );

        setIsModalOpen(false);
        toast.success("Checked out and archived successfully!");
        bookingType === "Room" ? fetchRoomBooking() : fetchEventBooking();
      } else {
        throw new Error("Checkout record creation failed");
      }
    } catch (error) {
      setIsModalOpen(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error("Error: " + errorMessage);
    }
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
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl">
          <div className="bg-[#d9232e] py-6 px-8">
            <h1 className="text-3xl font-bold text-white text-center tracking-wide">
              Room Checked In Guest Details
            </h1>
          </div>

          <div className="p-8 max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm text-gray-800 bg-white border-collapse table-auto">
              <thead className="sticky top-0 bg-blue-100">
                <tr className="rounded-md">
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
                    "Room Total",
                    "Order Total",
                    "Full Total",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-2 sm:p-2 text-left font-semibold text-xs sm:text-sm"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roombookings.map((item, index) => {
                  const guest = getRoomGuestDetails(item.email);
                  const orderTotal = getOrderTotalByEmail(item.email);
                  const roomTotal = item.totalAmount || 0;
                  const fullTotal = orderTotal + roomTotal;

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 rounded-md transition"
                    >
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {guest?.fname || "N/A"}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {guest?.lname || "N/A"}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {guest?.nic || "N/A"}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {new Date(item.checkin).toLocaleDateString()}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {new Date(item.checkout).toLocaleDateString()}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {item.adult}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {item.children}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {item.nationality}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {item.noofrooms}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {item.kitchen}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {roomTotal.toFixed(2)}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {orderTotal.toFixed(2)}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {fullTotal.toFixed(2)}
                      </td>
                      <td className="p-2 sm:p-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleAccept(item._id, "Room")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
                        >
                          Check Out
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-[#d9232e] py-6 px-8 mt-8">
            <h1 className="text-3xl font-bold text-white text-center tracking-wide">
              Event Checked In Guest Details
            </h1>
          </div>

          <div className="p-8 max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm text-gray-800 bg-white border-collapse table-auto">
              <thead className="sticky top-0 bg-purple-100">
                <tr className="rounded-md">
                  {[
                    "First Name",
                    "Last Name",
                    "NIC",
                    "Event Name",
                    "Booking Date",
                    "Check-out Date",
                    "Guests",
                    "Event Total",
                    "Order Total",
                    "Full Total",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-2 sm:p-2 text-left font-semibold text-xs sm:text-sm"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eventbookings.map((item, index) => {
                  const guest = getEventGuestDetails(item.email);
                  const orderTotal = getOrderTotalByEmail(item.email);
                  const eventTotal = item.totalAmount || 0;
                  const fullTotal = orderTotal + eventTotal;

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 rounded-md transition"
                    >
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {guest?.fname || "N/A"}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {guest?.lname || "N/A"}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {guest?.nic || "N/A"}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {item.eventType}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm whitespace-nowrap">
                        {new Date(item.eventDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {new Date(item.checkoutDate).toLocaleDateString()}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {item.guests}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {eventTotal.toFixed(2)}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {orderTotal.toFixed(2)}
                      </td>
                      <td className="p-2 sm:p-2 text-xs sm:text-sm">
                        {fullTotal.toFixed(2)}
                      </td>
                      <td className="p-2 sm:p-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleAccept(item._id, "Event")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
                        >
                          Check Out
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
    );
  };
  
  export default Checkout;