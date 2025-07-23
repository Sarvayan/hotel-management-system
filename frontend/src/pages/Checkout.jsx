import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import guestDetails from "../assets/images/guestdetails.jpg";

const Checkout = () => {
  // ... (keep all existing state and functions exactly the same)

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
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl mx-2 sm:mx-4">
        {/* Room Bookings Section */}
        <div className="bg-[#d9232e] py-4 sm:py-6 px-4 sm:px-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
            Room Checked In Guest Details
          </h1>
        </div>

        <div className="p-2 sm:p-4 md:p-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-gray-800 bg-white border-collapse table-auto">
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
                      className="p-2 text-left font-semibold whitespace-nowrap"
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
                      <td className="p-2 whitespace-nowrap">
                        {guest?.fname || "N/A"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {guest?.lname || "N/A"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {guest?.nic || "N/A"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {new Date(item.checkin).toLocaleDateString()}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {new Date(item.checkout).toLocaleDateString()}
                      </td>
                      <td className="p-2">{item.adult}</td>
                      <td className="p-2">{item.children}</td>
                      <td className="p-2 whitespace-nowrap">
                        {item.nationality}
                      </td>
                      <td className="p-2">{item.noofrooms}</td>
                      <td className="p-2">{item.kitchen}</td>
                      <td className="p-2">{roomTotal.toFixed(2)}</td>
                      <td className="p-2">{orderTotal.toFixed(2)}</td>
                      <td className="p-2">{fullTotal.toFixed(2)}</td>
                      <td className="p-2 flex justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleAccept(item._id, "Room")}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
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

        {/* Event Bookings Section */}
        <div className="bg-[#d9232e] py-4 sm:py-6 px-4 sm:px-8 mt-4 sm:mt-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center tracking-wide">
            Event Checked In Guest Details
          </h1>
        </div>

        <div className="p-2 sm:p-4 md:p-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-gray-800 bg-white border-collapse table-auto">
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
                      className="p-2 text-left font-semibold whitespace-nowrap"
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
                      <td className="p-2 whitespace-nowrap">
                        {guest?.fname || "N/A"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {guest?.lname || "N/A"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {guest?.nic || "N/A"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {item.eventType}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {new Date(item.eventDate).toLocaleDateString()}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {new Date(item.checkoutDate).toLocaleDateString()}
                      </td>
                      <td className="p-2">{item.guests}</td>
                      <td className="p-2">{eventTotal.toFixed(2)}</td>
                      <td className="p-2">{orderTotal.toFixed(2)}</td>
                      <td className="p-2">{fullTotal.toFixed(2)}</td>
                      <td className="p-2 flex justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleAccept(item._id, "Event")}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg shadow-md transition cursor-pointer text-xs sm:text-sm"
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
    </div>
  );
};

export default Checkout;
