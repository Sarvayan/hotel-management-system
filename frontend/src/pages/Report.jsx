import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import guestDetails from "../assets/images/guestdetails.jpg";

function Report() {
  const [roombookings, setRoombookings] = useState([]);
  const [eventbookings, setEventbookings] = useState([]);
  const [roomguest, setRoomGuest] = useState([]);
  const [eventguest, setEventGuest] = useState([]);
  const [orders, setOrders] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEventType, setSelectedEventType] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("Room Booking");
  const reportRef = useRef(null);

  const colors = {
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    secondary: "bg-blue-500",
    secondaryHover: "hover:bg-blue-600",
    danger: "bg-red-500",
    dangerHover: "hover:bg-red-600",
    warning: "bg-yellow-500",
    warningHover: "hover:bg-yellow-600",
    success: "bg-green-500",
    successHover: "hover:bg-green-600",
    info: "bg-cyan-500",
    infoHover: "hover:bg-cyan-600",
    dark: "bg-gray-800",
    darkHover: "hover:bg-gray-900",
    light: "bg-gray-100",
    lightHover: "hover:bg-gray-200",
    header: "bg-gradient-to-r from-blue-600 to-blue-800",
    tableHeader: {
      room: "bg-blue-50",
      event: "bg-purple-50",
      blacklist: "bg-red-50",
      cancelled: "bg-yellow-50",
      rooms: "bg-green-50",
      events: "bg-orange-50",
      revenue: "bg-teal-50",
    },
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() + i - 5
  );

  const eventTypes = [
    "All Event Types",
    "Wedding",
    "Conference",
    "Birthday",
    "Anniversary",
    "Other",
  ];

  const reportTypes = [
    "Room Booking",
    "Event Booking",
    "Blacklisted Customers",
    "Cancelled Bookings",
    "Rooms",
    "Events",
    "Total Revenue",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchRoomBooking(),
        fetchEventBooking(),
        fetchOrders(),
        fetchBlacklist(),
        fetchCancelledBookings(),
        fetchRoom(),
        fetchEvent(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data");
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomBooking = async () => {
    const response = await axios.get(
      `http://localhost:4000/api/roombookings/getCroombookings`
    );
    setRoomGuest(Array.isArray(response.data.data) ? response.data.data : []);
    setRoombookings(
      Array.isArray(response.data.retdata) ? response.data.retdata : []
    );
  };

  const fetchEventBooking = async () => {
    const response = await axios.get(
      `http://localhost:4000/api/eventbookings/getCeventbookings`
    );
    setEventGuest(Array.isArray(response.data.data) ? response.data.data : []);
    setEventbookings(
      Array.isArray(response.data.retdata) ? response.data.retdata : []
    );
  };

  const fetchOrders = async () => {
    const response = await axios.get(
      `http://localhost:4000/api/order/getorders`
    );
    setOrders(Array.isArray(response.data) ? response.data : []);
  };

  const fetchBlacklist = async () => {
    const response = await axios.get(
      `http://localhost:4000/api/guestblacklist/getblacklist`
    );
    setBlacklist(
      Array.isArray(response.data.guests) ? response.data.guests : []
    );
  };

  const fetchCancelledBookings = async () => {
    const response = await axios.get(
      `http://localhost:4000/api/cancelbookings/getcancelled`
    );
    setCancelledBookings(
      Array.isArray(response.data.cancelbookings)
        ? response.data.cancelbookings
        : []
    );
  };

  const fetchRoom = async () => {
    const response = await axios.get(
      `http://localhost:4000/api/rooms/allrooms`
    );
    setRooms(Array.isArray(response.data.retdata) ? response.data.retdata : []);
  };

  const fetchEvent = async () => {
    const response = await axios.get(
      `http://localhost:4000/api/events/allevents`
    );
    setEvents(
      Array.isArray(response.data.retdata) ? response.data.retdata : []
    );
  };

  const getGuestDetails = (email) => {
    const roomGuest = roomguest.find((guest) => guest.email === email);
    if (roomGuest) return roomGuest;
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

  const filteredRoomBookings = roombookings.filter((item) => {
    const checkinDate = new Date(item.checkin);
    return (
      checkinDate.getMonth() + 1 === selectedMonth &&
      checkinDate.getFullYear() === selectedYear
    );
  });

  const filteredEventBookings = eventbookings.filter((item) => {
    const eventDate = new Date(item.eventDate);
    const matchesMonthYear =
      eventDate.getMonth() + 1 === selectedMonth &&
      eventDate.getFullYear() === selectedYear;
    const matchesEventType =
      selectedEventType === "" ||
      selectedEventType === "All Event Types" ||
      item.eventType === selectedEventType;
    return matchesMonthYear && matchesEventType;
  });

  const getDailyRevenue = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const dailyRevenue = {};

    // Initialize daily revenue object
    for (let day = 1; day <= daysInMonth; day++) {
      dailyRevenue[day] = { room: 0, event: 0, order: 0, total: 0 };
    }

    // Calculate room revenue
    roombookings.forEach((booking) => {
      const checkinDate = new Date(booking.checkin);
      if (
        checkinDate.getMonth() + 1 === selectedMonth &&
        checkinDate.getFullYear() === selectedYear
      ) {
        const day = checkinDate.getDate();
        dailyRevenue[day].room += booking.totalAmount || 0;
        dailyRevenue[day].total += booking.totalAmount || 0;
      }
    });

    // Calculate event revenue
    eventbookings.forEach((booking) => {
      const eventDate = new Date(booking.eventDate);
      if (
        eventDate.getMonth() + 1 === selectedMonth &&
        eventDate.getFullYear() === selectedYear
      ) {
        const day = eventDate.getDate();
        dailyRevenue[day].event += booking.totalAmount || 0;
        dailyRevenue[day].total += booking.totalAmount || 0;
      }
    });

    // Calculate order revenue
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (
        orderDate.getMonth() + 1 === selectedMonth &&
        orderDate.getFullYear() === selectedYear
      ) {
        const day = orderDate.getDate();
        dailyRevenue[day].order += order.totalPrice || 0;
        dailyRevenue[day].total += order.totalPrice || 0;
      }
    });

    return dailyRevenue;
  };

  const generateReport = async () => {
    const input = reportRef.current;
    if (!input) {
      toast.error("Report content not found.");
      return;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Generating PDF...");

      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add title
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0); // Black
      pdf.text(
        `${selectedReportType} Report - ${
          months.find((m) => m.value === selectedMonth)?.label
        } ${selectedYear}`,
        105,
        20,
        { align: "center" }
      );

      // Add report details
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Create a simple table structure based on the report type
      let yPosition = 40; // Starting Y position for content

      // Helper function to add table rows
      const addTableRow = (columns, isHeader = false) => {
        const colWidth = 180 / columns.length;
        let xPosition = 15;

        if (isHeader) {
          pdf.setFillColor(200, 200, 200); // Light gray for header
          pdf.rect(xPosition, yPosition, 180, 10, "F");
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "bold");
        } else {
          pdf.setFont("helvetica", "normal");
        }

        columns.forEach((col) => {
          pdf.text(col, xPosition + 2, yPosition + 7);
          xPosition += colWidth;
        });

        yPosition += 10;
      };

      // Generate content based on report type
      switch (selectedReportType) {
        case "Room Booking":
          addTableRow(
            ["First Name", "Last Name", "Check-in", "Check-out", "Total"],
            true
          );

          filteredRoomBookings.forEach((item) => {
            const guest = getGuestDetails(item.email);
            addTableRow([
              guest?.fname || "N/A",
              guest?.lname || "N/A",
              new Date(item.checkin).toLocaleDateString(),
              new Date(item.checkout).toLocaleDateString(),
              `$${item.totalAmount?.toFixed(2) || "0.00"}`,
            ]);
          });
          break;

        case "Event Booking":
          addTableRow(
            ["First Name", "Last Name", "Event Type", "Event Date", "Total"],
            true
          );

          filteredEventBookings.forEach((item) => {
            const guest = getGuestDetails(item.email);
            addTableRow([
              guest?.fname || "N/A",
              guest?.lname || "N/A",
              item.eventType,
              new Date(item.eventDate).toLocaleDateString(),
              `$${item.totalAmount?.toFixed(2) || "0.00"}`,
            ]);
          });
          break;

        case "Blacklisted Customers":
          addTableRow(["First Name", "Last Name", "Email", "Reason"], true);

          blacklist.forEach((item) => {
            const guest = getGuestDetails(item.email);
            addTableRow([
              guest?.fname || "N/A",
              guest?.lname || "N/A",
              item.email,
              item.reason || "N/A",
            ]);
          });
          break;

        case "Cancelled Bookings":
          addTableRow(
            [
              "First Name",
              "Last Name",
              "Email",
              "Type",
              "Reason",
              "Status",
              "Done By",
            ],
            true
          );

          cancelledBookings.forEach((item) => {
            const guest = getGuestDetails(item.email);
            addTableRow([
              guest?.fname || "N/A",
              guest?.lname || "N/A",
              item.email,
              item.type || "N/A",
              item.reason || "N/A",
              item.status || "N/A",
              item.doneby || "N/A",
            ]);
          });
          break;

        case "Rooms":
          addTableRow(
            ["Room No", "Room Type", "Price Per Night", "Availability"],
            true
          );

          rooms.forEach((item) => {
            addTableRow([
              item.roomNo || "N/A",
              item.roomType || "N/A",
              `$${(item.pricePerNight || 0).toFixed(2)}`,
              item.availabilityStatus || "N/A",
            ]);
          });
          break;

        case "Events":
          addTableRow(
            ["Event No", "Event Type", "Capacity", "Price", "Description"],
            true
          );

          events
            .filter((item) =>
              selectedEventType === "" ||
              selectedEventType === "All Event Types"
                ? true
                : item.eventType === selectedEventType
            )
            .forEach((item) => {
              addTableRow([
                item.eventNo || "N/A",
                item.eventType || "N/A",
                item.capacity || "N/A",
                `$${(item.cost || 0).toFixed(2)}`,
                item.description || "N/A",
              ]);
            });
          break;

        case "Total Revenue":
          addTableRow(
            [
              "Date",
              "Room Revenue",
              "Event Revenue",
              "Order Revenue",
              "Total Revenue",
            ],
            true
          );

          Object.entries(getDailyRevenue()).forEach(([day, revenue]) => {
            addTableRow([
              `${selectedMonth}/${day}/${selectedYear}`,
              `$${revenue.room.toFixed(2)}`,
              `$${revenue.event.toFixed(2)}`,
              `$${revenue.order.toFixed(2)}`,
              `$${revenue.total.toFixed(2)}`,
            ]);
          });

          
          const monthlyTotal = Object.values(getDailyRevenue()).reduce(
            (sum, day) => ({
              room: sum.room + day.room,
              event: sum.event + day.event,
              order: sum.order + day.order,
              total: sum.total + day.total,
            }),
            { room: 0, event: 0, order: 0, total: 0 }
          );

          yPosition += 5; // Add some space
          pdf.setFont("helvetica", "bold");
          addTableRow([
            "Monthly Total",
            `$${monthlyTotal.room.toFixed(2)}`,
            `$${monthlyTotal.event.toFixed(2)}`,
            `$${monthlyTotal.order.toFixed(2)}`,
            `$${monthlyTotal.total.toFixed(2)}`,
          ]);
          break;

        default:
          pdf.text("No data available for this report type", 15, yPosition);
      }

      // Save the PDF
      const monthName =
        months.find((m) => m.value === selectedMonth)?.label || "Unknown";
      pdf.save(`Report_${monthName}_${selectedYear}.pdf`);

      toast.update(toastId, {
        render: "PDF generated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTableHeaderColor = () => {
    switch (selectedReportType) {
      case "Room Booking":
        return colors.tableHeader.room;
      case "Event Booking":
        return colors.tableHeader.event;
      case "Blacklisted Customers":
        return colors.tableHeader.blacklist;
      case "Cancelled Bookings":
        return colors.tableHeader.cancelled;
      case "Rooms":
        return colors.tableHeader.rooms;
      case "Events":
        return colors.tableHeader.events;
      case "Total Revenue":
        return colors.tableHeader.revenue;
      default:
        return colors.tableHeader.room; // Fallback color
    }
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
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div
          className="py-6 px-6 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          style={{ backgroundColor: colors.header }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Booking Report
            </h1>
            <p className="text-indigo-100 mt-1">
              {months.find((m) => m.value === selectedMonth)?.label}{" "}
              {selectedYear}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <select
              value={selectedReportType}
              onChange={(e) => {
                setSelectedReportType(e.target.value);
                setSelectedEventType("");
              }}
              className="bg-white text-gray-800 font-medium px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-white text-gray-800 font-medium px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-white text-gray-800 font-medium px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {(selectedReportType === "Event Booking" ||
              selectedReportType === "Events") && (
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="bg-white text-gray-800 font-medium px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={generateReport}
              className={`${colors.primary} ${colors.primaryHover} text-white font-semibold px-4 py-2 rounded-lg shadow-md transition flex items-center justify-center gap-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Generate PDF
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8" ref={reportRef}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedReportType} Report
                </h2>
                <p className="text-gray-600">
                  {months.find((m) => m.value === selectedMonth)?.label}{" "}
                  {selectedYear}
                  {selectedEventType &&
                    selectedEventType !== "All Event Types" &&
                    ` • ${selectedEventType}`}
                </p>
              </div>
              {selectedReportType === "Room Booking" && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`${getTableHeaderColor()}`}>
                      <tr>
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
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRoomBookings.length > 0 ? (
                        filteredRoomBookings.map((item, index) => {
                          const guest = getGuestDetails(item.email);
                          const orderTotal = getOrderTotalByEmail(item.email);
                          const roomTotal = item.totalAmount || 0;
                          const fullTotal = orderTotal + roomTotal;
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {guest?.fname || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {guest?.lname || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {guest?.nic || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {new Date(item.checkin).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {new Date(item.checkout).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                {item.adult}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                {item.children}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.nationality}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                {item.noofrooms}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                {item.kitchen ? "Yes" : "No"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {roomTotal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {orderTotal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                                {fullTotal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="13"
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            No room bookings found for the selected period
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {selectedReportType === "Event Booking" && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`${getTableHeaderColor()}`}>
                      <tr>
                        {[
                          "First Name",
                          "Last Name",
                          "NIC",
                          "Event Name",
                          "Booking Date",
                          "Guests",
                          "Event Total",
                          "Order Total",
                          "Full Total",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEventBookings.length > 0 ? (
                        filteredEventBookings.map((item, index) => {
                          const guest = getGuestDetails(item.email);
                          const orderTotal = getOrderTotalByEmail(item.email);
                          const eventTotal = item.totalAmount || 0;
                          const fullTotal = orderTotal + eventTotal;
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {guest?.fname || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {guest?.lname || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {guest?.nic || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.eventType}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {new Date(item.eventDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                {item.guests}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {eventTotal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {orderTotal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-purple-600">
                                {fullTotal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="9"
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            No event bookings found for the selected period and
                            event type
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {selectedReportType === "Blacklisted Customers" && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`${getTableHeaderColor()}`}>
                      <tr>
                        {[
                          "First Name",
                          "Last Name",
                          "Email",
                          "Reason",
                          "Status",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {blacklist.length > 0 ? (
                        blacklist.map((item, index) => {
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {item.fname || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.lname || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.email}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {item.reason || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    item.status === "Active"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            No blacklisted customers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {selectedReportType === "Cancelled Bookings" && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`${getTableHeaderColor()}`}>
                      <tr>
                        {[
                          "First Name",
                          "Last Name",
                          "Email",
                          "Type",
                          "Reason",
                          "Status",
                          "Done By",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cancelledBookings.length > 0 ? (
                        cancelledBookings.map((item, index) => {
                          const guest = getGuestDetails(item.email);
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {guest?.fname || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {guest?.lname || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.email}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.type || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {item.reason || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.status || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.doneby || "N/A"}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            No cancelled bookings found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {selectedReportType === "Rooms" && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`${getTableHeaderColor()}`}>
                      <tr>
                        {[
                          "Room No",
                          "Room Type",
                          "Price Per Night",
                          "Availability",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rooms.length > 0 ? (
                        rooms.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.roomNo || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {item.roomType || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {(item.pricePerNight || 0).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.availabilityStatus === "Available"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.availabilityStatus}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            No rooms found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {selectedReportType === "Events" && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`${getTableHeaderColor()}`}>
                      <tr>
                        {[
                          "Event No",
                          "Event Type",
                          "Capacity",
                          "Price",
                          "Description",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.filter((item) =>
                        selectedEventType === "" ||
                        selectedEventType === "All Event Types"
                          ? true
                          : item.eventType === selectedEventType
                      ).length > 0 ? (
                        events
                          .filter((item) =>
                            selectedEventType === "" ||
                            selectedEventType === "All Event Types"
                              ? true
                              : item.eventType === selectedEventType
                          )
                          .map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.eventNo || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.eventType || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.capacity || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {(item.cost || 0).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {item.description || "N/A"}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            No events found for the selected event type
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Total Revenue Report */}
              {selectedReportType === "Total Revenue" && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`${getTableHeaderColor()}`}>
                      <tr>
                        {[
                          "Date",
                          "Room Revenue",
                          "Event Revenue",
                          "Total Revenue",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(getDailyRevenue()).map(
                        ([day, revenue], index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {`${selectedMonth}/${day}/${selectedYear}`}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {revenue.room.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {revenue.event.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-teal-600">
                              {revenue.total.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        )
                      )}

                      <tr className="bg-gray-50 font-medium">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          Monthly Total
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {Object.values(getDailyRevenue())
                            .reduce((sum, day) => sum + day.room, 0)
                            .toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {Object.values(getDailyRevenue())
                            .reduce((sum, day) => sum + day.event, 0)
                            .toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-teal-800">
                          {Object.values(getDailyRevenue())
                            .reduce((sum, day) => sum + day.total, 0)
                            .toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;
