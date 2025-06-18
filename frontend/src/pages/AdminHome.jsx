import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import adminBg from "../assets/images/admin-bg4.jpg";
import profile from "../assets/images/profile1.png";

const localizer = momentLocalizer(moment);

const AdminHome = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [noofguests, setNoOfGuests] = useState(0);
  const [roombookings, setRoombookings] = useState([]);
  const [eventbookings, setEventbookings] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "Admin") {
      setTimeout(() => {
        const synth = window.speechSynthesis;
        const message = new SpeechSynthesisUtterance("Hello boss, Welcome");

        const voices = synth.getVoices();
        const femaleVoice = voices.find(
          (voice) => voice.lang === "en-US" && voice.name.includes("Female")
        );

        message.voice =
          femaleVoice || voices.find((v) => v.name.includes("Female"));
        message.lang = "en-US";
        synth.speak(message);
      }, 500);
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = moment().tz("Asia/Colombo");
      setCurrentTime(now.format("h:mm:ss A"));
      setCurrentDate(now.format("MMMM D, YYYY"));
      setCurrentDay(now.format("dddd"));
    };

    const fetchGuests = () => {
      axios.get("http://localhost:4000/api/guests/getguest").then((res) => {
        setNoOfGuests(res.data.totalGuests);
      });
    };

    const fetchRoomBooking = () => {
      axios
        .get("http://localhost:4000/api/roombookings/getAroombookings")
        .then((res) => setRoombookings(res.data.retdata));
    };

    const fetchEventBooking = () => {
      axios
        .get("http://localhost:4000/api/eventbookings/getAeventbookings")
        .then((res) => setEventbookings(res.data.retdata));
    };

    updateTime();
    fetchGuests();
    fetchRoomBooking();
    fetchEventBooking();

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const roomEvents = roombookings.map((booking) => ({
      title: `Room ${booking.assignedRoomNos} Booked`,
      start: new Date(booking.checkin),
      end: new Date(booking.checkout),
      className: "room-booking-event",
    }));

    const eventEvents = eventbookings.map((booking) => ({
      title: `Event: ${booking.eventName}`,
      start: new Date(booking.eventDate),
      end: new Date(booking.checkoutDate),
      className: "event-booking-event",
    }));

    setCalendarEvents([...roomEvents, ...eventEvents]);

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: moment().month(i).format("MMM"),
      rooms: 0,
      events: 0,
    }));

    roombookings.forEach((booking) => {
      const monthIndex = moment(booking.checkin).month();
      months[monthIndex].rooms += 1;
    });

    eventbookings.forEach((booking) => {
      const monthIndex = moment(booking.eventDate).month();
      months[monthIndex].events += 1;
    });

    setMonthlyStats(months);
  }, [roombookings, eventbookings]);

  const eventStyleGetter = (event) => {
    const baseStyle = {
      borderRadius: "4px",
      opacity: 0.9,
      color: "white",
      border: "0px",
      display: "block",
    };

    if (event.className === "room-booking-event") {
      return { style: { ...baseStyle, backgroundColor: "#3b82f6" } };
    } else if (event.className === "event-booking-event") {
      return { style: { ...baseStyle, backgroundColor: "#10b981" } };
    }
    return { style: baseStyle };
  };

  return (
    <div
      style={{
        backgroundImage: `url(${adminBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-black bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-900 font-medium">
            Comprehensive overview of hotel operations and bookings
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Time Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-indigo-100 mr-4 shadow-inner">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  SRI LANKAN TIME
                </h3>
                <p className="text-xs text-gray-400">Asia/Colombo (GMT+5:30)</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1 font-mono">
              {currentTime}
            </div>
            <div className="text-md text-gray-600 font-medium">
              {currentDay}, {currentDate}
            </div>
          </div>

          {/* Guests Card */}
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-white bg-opacity-10"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-white bg-opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4 shadow-md">
                <img
                  src={profile}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white border-opacity-30"
                />
              </div>
              <h3 className="text-lg font-medium mb-1">Total Guests</h3>
              <p className="text-4xl font-bold">{noofguests}</p>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-100">
              Quick Stats
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Room Bookings
                  </span>
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {roombookings.length}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${(roombookings.length / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Event Bookings
                  </span>
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {eventbookings.length}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full"
                    style={{ width: `${(eventbookings.length / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Monthly Booking Stats Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Monthly Booking Statistics
              </h2>
              <div className="flex space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shadow-sm">
                  Rooms
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 shadow-sm">
                  Events
                </span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyStats}
                  margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      border: "none",
                      fontWeight: "500",
                    }}
                    itemStyle={{ color: "#1f2937" }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                    }}
                  />
                  <Bar
                    dataKey="rooms"
                    fill="#6366F1"
                    name="Room Bookings"
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                  <Bar
                    dataKey="events"
                    fill="#10B981"
                    name="Event Bookings"
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Booking Calendar
              </h2>
              <div className="flex space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shadow-sm">
                  Rooms
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 shadow-sm">
                  Events
                </span>
              </div>
            </div>
            <div className="h-80">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                eventPropGetter={eventStyleGetter}
                views={["month", "week", "day"]}
                defaultView="month"
                popup
                className="border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
