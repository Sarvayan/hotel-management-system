import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function BookingHistory() {
  const [roomBookings, setRoomBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelTarget, setCancelTarget] = useState({ type: "", id: "" });

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/roombookings/checkroombookings", {
        withCredentials: true,
      })
      .then((data) => {
        if (data.data.success === true) {
          setRoomBookings(data.data.retdata || []);
          console.log(data.data.retdata);
        } else {
          toast.error("Error Fetching Room Booking Details.");
        }
      })
      .catch(() => {
        toast.error("Fetching Room Booking Details Failed! Try Again.");
      });

    axios
      .get("http://localhost:4000/api/eventbookings/checkeventbookings", {
        withCredentials: true,
      })
      .then((data) => {
        if (data.data.success === true) {
          setEventBookings(data.data.retdata || []);
        } else {
          toast.error("Error Fetching Event Booking Details.");
        }
      })
      .catch(() => {
        toast.error("Fetching Event Booking Details Failed! Try Again.");
      });
  }, []);

  const handleCancel = (type, id) => {
    setCancelTarget({ type, id });
    setCancelReason("");
    setShowCancelPrompt(true);
  };

  const submitCancellation = () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason.");
      return;
    }

    axios
      .post(
        "http://localhost:4000/api/cancelbookings/cancelbooking",
        {
          type: cancelTarget.type,
          bookingid: cancelTarget.id,
          reason: cancelReason,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data) {
          setRoomBookings((prevBookings) =>
            prevBookings.filter((booking) => booking._id !== cancelTarget.id)
          );
          setEventBookings((prevBookings) =>
            prevBookings.filter((booking) => booking._id !== cancelTarget.id)
          );
          toast.success("Booking Cancelled Successfully.");
          setShowCancelPrompt(false);
        } else {
          toast.error(res.data);
        }
      })
      .catch(() => {
        toast.error("Error Cancelling Booking.");
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Booking History</h1>

      
      {showCancelPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-2">Cancellation Reason</h3>
            <textarea
              className="w-full border border-gray-300 p-2 rounded mb-4"
              rows={4}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason for cancellation..."
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelPrompt(false)}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitCancellation}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

     
      <div className="bg-white p-4 shadow-md rounded-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Room Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                    <th className="p-3">Check-In</th>
                    <th className="p-3">Check-Out</th>
                    <th className="p-3">Adult</th>
                    <th className="p-3">Children</th>
                    <th className="p-3">No Of Rooms</th>
                    <th className="p-3">Kitchen Access</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Assigned Room Nos</th> {/* New column for assigned room numbers */}
                    <th className="p-3">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                    {roomBookings.map((booking) => (
                      <tr key={booking._id} className="text-center border-t">
                        <td className="p-2">{booking.checkin}</td>
                        <td className="p-2">{booking.checkout}</td>
                        <td className="p-2">{booking.adult}</td>
                        <td className="p-2">{booking.children}</td>
                        <td className="p-2">{booking.noofrooms}</td>
                        <td className="p-2">{booking.kitchenAccess ? "Yes" : "No"}</td>
                        <td className="p-2">{booking.totalAmount}</td>
                        <td className="p-2">{booking.status}</td>
                        <td className="p-2">
                          
                          {booking.assignedRoomNos.join(", ")}
                        </td>
                  <td className="p-2">
                    {booking.status === "Reserved" && (
                      <button
                        onClick={() => handleCancel("Room", booking._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

     
      <div className="bg-white p-4 shadow-md rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Event Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">Check-In</th>
                <th className="p-3">Check-Out</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">No Of Guests</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {eventBookings.map((booking) => (
                <tr key={booking._id} className="text-center border-t">
                  <td className="p-2">{booking.eventDate}</td>
                  <td className="p-2">{booking.checkoutDate}</td>
                  <td className="p-2">{booking.eventType}</td>
                  <td className="p-2">{booking.guests}</td>
                  <td className="p-2">{booking.totalAmount}</td>
                  <td className="p-2">{booking.status}</td>
                  <td className="p-2">
                    {booking.status === "Reserved" && (
                      <button
                        onClick={() => handleCancel("Event", booking._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;
