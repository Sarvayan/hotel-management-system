import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      setTimeout(() => {
        const synth = window.speechSynthesis;
        if (synth) {
          const message = new SpeechSynthesisUtterance("Hello boss, Welcome");
          const voices = synth.getVoices();
          const femaleVoice = voices.find(
            (voice) => voice.lang === "en-US" && voice.name.includes("Female")
          );

          message.voice =
            femaleVoice || voices.find((v) => v.name.includes("Female"));
          message.lang = "en-US";
          synth.speak(message);
        }
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

    const fetchData = async () => {
      try {
        const [guestsRes, roomRes, eventRes] = await Promise.all([
          axios.get("http://localhost:4000/api/guests/getguest"),
          axios.get("http://localhost:4000/api/roombookings/getAroombookings"),
          axios.get(
            "http://localhost:4000/api/eventbookings/getAeventbookings"
          ),
        ]);

        setNoOfGuests(guestsRes.data.totalGuests);
        setRoombookings(roomRes.data.retdata);
        setEventbookings(eventRes.data.retdata);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    updateTime();
    fetchData();

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (roombookings.length > 0 || eventbookings.length > 0) {
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
    }
  }, [roombookings, eventbookings]);

  const eventStyleGetter = (event) => {
    const baseStyle = {
      borderRadius: "4px",
      opacity: 0.9,
      color: "white",
      border: "0px",
      display: "block",
      fontSize: "0.75rem",
      padding: "2px 4px",
    };

    if (event.className === "room-booking-event") {
      return { style: { ...baseStyle, backgroundColor: "#3b82f6" } };
    } else if (event.className === "event-booking-event") {
      return { style: { ...baseStyle, backgroundColor: "#10b981" } };
    }
    return { style: baseStyle };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url(${adminBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better readability */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 drop-shadow-lg">
            Admin Dashboard
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-white font-medium">
            Comprehensive overview of hotel operations and bookings
          </p>
          <div className="mt-3 sm:mt-4 h-1 w-16 sm:w-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mx-auto"></div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 sm:mb-10">
          {/* Time Card */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-5 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-3">
              <div className="p-2 sm:p-3 rounded-lg bg-indigo-100 mr-3 sm:mr-4 shadow-inner">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600"
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
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  SRI LANKAN TIME
                </h3>
                <p className="text-xs text-gray-400">Asia/Colombo (GMT+5:30)</p>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 font-mono">
              {currentTime}
            </div>
            <div className="text-sm sm:text-md text-gray-600 font-medium">
              {currentDay}, {currentDate}
            </div>
          </div>

          {/* Guests Card */}
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-5 sm:p-6 rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-0 right-0 -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-white bg-opacity-10"></div>
            <div className="absolute bottom-0 left-0 -ml-8 sm:-ml-10 -mb-8 sm:-mb-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-white bg-opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full mb-3 sm:mb-4 shadow-md">
                <img
                  src={profile}
                  alt="Profile"
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white border-opacity-30"
                />
              </div>
              <h3 className="text-sm sm:text-lg font-medium mb-1">
                Total Guests
              </h3>
              <p className="text-3xl sm:text-4xl font-bold">{noofguests}</p>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-5 sm:p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6 pb-2 border-b border-gray-100">
              Quick Stats
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex justify-between mb-1 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Room Bookings
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 sm:px-2 sm:py-1 rounded">
                    {roombookings.length}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5">
                  <div
                    className="bg-indigo-600 h-2 sm:h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        (roombookings.length / 50) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Event Bookings
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 sm:px-2 sm:py-1 rounded">
                    {eventbookings.length}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5">
                  <div
                    className="bg-emerald-500 h-2 sm:h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        (eventbookings.length / 50) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    Occupancy Rate
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 sm:px-2 sm:py-1 rounded">
                    {Math.round((roombookings.length / 50) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5">
                  <div
                    className="bg-amber-500 h-2 sm:h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        (roombookings.length / 50) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section - Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-8 mb-8 sm:mb-10">
          {/* Monthly Booking Stats Chart */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pb-2 border-b border-gray-100">
              <h2 className="text-md sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                Monthly Booking Statistics
              </h2>
              <div className="flex space-x-2 sm:space-x-3">
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shadow-sm">
                  Rooms
                </span>
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 shadow-sm">
                  Events
                </span>
              </div>
            </div>
            <div className="h-64 sm:h-72 md:h-80">
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
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      border: "none",
                      fontWeight: "500",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#1f2937" }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "10px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="rooms"
                    fill="#6366F1"
                    name="Room Bookings"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="events"
                    fill="#10B981"
                    name="Event Bookings"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pb-2 border-b border-gray-100">
              <h2 className="text-md sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                Booking Calendar
              </h2>
              <div className="flex space-x-2 sm:space-x-3">
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shadow-sm">
                  Rooms
                </span>
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 shadow-sm">
                  Events
                </span>
              </div>
            </div>
            <div className="h-64 sm:h-72 md:h-80">
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
                className="border-0 text-xs sm:text-sm"
                toolbarClassName="flex flex-wrap justify-between items-center p-2"
                headerClassName="flex justify-between items-center mb-2"
                dayPropGetter={() => ({
                  className: "hover:bg-gray-50 transition-colors",
                })}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <h2 className="text-md sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 pb-2 border-b border-gray-100">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[...roombookings, ...eventbookings]
              .sort(
                (a, b) =>
                  new Date(b.createdAt || b.eventDate) -
                  new Date(a.createdAt || a.eventDate)
              )
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`flex-shrink-0 p-2 rounded-full mr-3 ${
                      item.assignedRoomNos
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {item.assignedRoomNos ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.assignedRoomNos
                        ? `Room ${item.assignedRoomNos} Booked`
                        : `Event ${item.eventName} Scheduled`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.assignedRoomNos
                        ? `Check-in: ${moment(item.checkin).format(
                            "MMM D, YYYY"
                          )}`
                        : `Date: ${moment(item.eventDate).format(
                            "MMM D, YYYY"
                          )}`}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {moment(item.createdAt || item.eventDate).fromNow()}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
