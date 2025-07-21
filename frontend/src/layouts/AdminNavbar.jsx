import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DarkModeToggle from "../components/DarkModeToggle";

function AdminNavbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState({
    events: false,
    rooms: false,
    bookings: false,
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [roomFetched, setRoomFetched] = useState(false);
  const [eventFetched, setEventFetched] = useState(false);
  const [cleaningFetched, setCleaningFetched] = useState(false);
  const prevNotificationsText = useRef("");

  const extractNotificationText = (elements) =>
    elements.map((el) => el.props.children[0].props.children).join(" | ");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [roomRes, eventRes, cleaningRes] = await Promise.all([
          axios.get("http://localhost:4000/api/roombookings/getroombookings"),
          axios.get("http://localhost:4000/api/eventbookings/geteventbookings"),
          axios.get("http://localhost:4000/api/rooms/not-cleaned"),
        ]);

        const newNotifications = [];

        const reservedBookings = roomRes.data.retdata;
        if (reservedBookings.length > 0) {
          newNotifications.push(
            <div key="room" className="mb-2 p-3 bg-yellow-100 text-yellow-800 rounded shadow">
              <p>There are {reservedBookings.length} room bookings waiting for acceptance.</p>
              <Link
                to="/bookingrequest"
                className="inline-block mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-300"
              >
                Go to Booking Requests
              </Link>
            </div>
          );
        }

        const reservedEventBookings = eventRes.data.retdata;
        if (reservedEventBookings.length > 0) {
          newNotifications.push(
            <div key="event" className="mb-2 p-3 bg-blue-100 text-blue-800 rounded shadow">
              <p>There are {reservedEventBookings.length} event bookings waiting for acceptance.</p>
              <Link
                to="/bookingrequest"
                className="inline-block mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-300"
              >
                Go to Booking Requests
              </Link>
            </div>
          );
        }

        const roomsNotCleaned = cleaningRes.data;
        if (roomsNotCleaned.length > 0) {
          roomsNotCleaned.forEach((room, index) => {
            newNotifications.push(
              <div
                key={`clean-${room.roomNo}-${index}`}
                className="mb-2 p-3 bg-red-100 text-red-800 rounded shadow"
              >
                <p>Room needs cleaning: Room {room.roomNo}</p>
                <Link
                  to="/cleaningstatus"
                  className="inline-block mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-300"
                >
                  Check Cleaning Status
                </Link>
              </div>
            );
          });
        }

        // Compare notifications to previous text
        const newText = extractNotificationText(newNotifications);
        if (newText !== prevNotificationsText.current) {
          setNotifications(newNotifications);
          prevNotificationsText.current = newText;
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setRoomFetched(true);
        setEventFetched(true);
        setCleaningFetched(true);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const role = localStorage.getItem("role");
      if (role === "Admin") {
        const speakNotification = () => {
          const synth = window.speechSynthesis;
          let voices = synth.getVoices();

          const speak = () => {
            const message = new SpeechSynthesisUtterance(
              `Hello boss, you have ${notifications.length} notifications`
            );
            const femaleVoice = voices.find(
              (voice) => voice.lang === "en-US" && voice.name.includes("Female")
            );
            message.voice =
              femaleVoice || voices.find((v) => v.name.includes("Female"));
            message.lang = "en-US";
            synth.speak(message);
          };

          if (voices.length === 0) {
            synth.onvoiceschanged = () => {
              voices = synth.getVoices();
              speak();
            };
          } else {
            speak();
          }
        };

        setTimeout(speakNotification, 500);
      }
    }
  }, [notifications]);

  const handleBellClick = () => {
    setShowNotifications((prevState) => !prevState);
  };

  const handleVoiceCommand = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log("Heard:", command);

      if (command.includes("view")) navigate("/viewdetails/1");
      else if (command.includes("guest")) navigate("/guestlist");
      else if (command.includes("blacklist")) navigate("/blacklistaccount");
      else if (command.includes("booking")) navigate("/bookingrequest");
      else if (command.includes("update room")) navigate("/updateroom");
      else if (command.includes("manage room")) navigate("/manageroom");
      else if (command.includes("add event")) navigate("/addevent");
      else if (command.includes("event list")) navigate("/eventlist");
      else if (command.includes("manage event")) navigate("/manageevent");
      else alert("Sorry, I couldn't recognize the page.");
    };

    recognition.onerror = (e) => {
      alert("Voice recognition error: " + e.error);
    };

    recognition.start();
  };

  const toggleSubMenu = (menu) => {
    setShowSubMenu({
      ...showSubMenu,
      [menu]: !showSubMenu[menu],
    });
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 w-full rounded-md bg-[#d9232e] shadow-xl z-50 p-3 flex justify-between items-center border-b border-white/10">
        <Link to="/adminhome">
          <div className="text-2xl font-bold text-white tracking-tight flex items-center cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                clipRule="evenodd"
              />
            </svg>
            WeAre Villa
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          

          <div className="relative group">
            <button
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 relative"
              onMouseEnter={() => setShowNotifications(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-800 transform group-hover:scale-110 transition-transform">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && notifications.length > 0 && (
              <div
                className="fixed top-16 right-4 w-80 bg-white rounded-lg shadow-2xl z-50 overflow-hidden animate-fadeIn border border-gray-200"
                onMouseEnter={() => setShowNotifications(true)}
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="bg-[#d9232e] px-4 py-3 flex justify-between items-center">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
                    Notifications
                  </h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                    >
                      {notification}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-4 py-2 text-center text-xs text-gray-500 font-medium">
                  {notifications.length} unread notification
                  {notifications.length !== 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>

          <div className="relative group">
            <button
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none"
              onMouseEnter={() => setShowMenu(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white transform group-hover:rotate-90 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {showMenu && (
              <div
                className="fixed top-16 right-4 w-64 bg-white rounded-lg shadow-2xl z-50 overflow-hidden animate-fadeIn border border-gray-200"
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              >
                <div className="py-1">
                  <Link
                    to="/adminhome"
                    className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium flex items-center"
                    onClick={() => setShowMenu(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Dashboard
                  </Link>

                  <Link
                    to="/guestlist"
                    className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium flex items-center"
                    onClick={() => setShowMenu(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Guest Management
                  </Link>

                  <Link
                    to="/blacklistaccount"
                    className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium flex items-center"
                    onClick={() => setShowMenu(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Security Controls
                  </Link>
                  <div className="border-t border-gray-100 mx-3"></div>
                  {/* Bookings Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleSubMenu("bookings")}
                      className="w-full flex justify-between items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Reservation System
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform transition-transform duration-200 ${
                          showSubMenu.bookings ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {showSubMenu.bookings && (
                      <div className="bg-gray-50 pl-12">
                        <Link
                          to="/bookingrequest"
                          className="px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 text-sm flex items-center"
                          onClick={() => setShowMenu(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Booking Approvals
                        </Link>
                        <Link
                          to="/checkin"
                          className="px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 text-sm flex items-center"
                          onClick={() => setShowMenu(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Guest Check-In
                        </Link>
                        <Link
                          to="/checkout"
                          className="px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 text-sm flex items-center"
                          onClick={() => setShowMenu(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Guest Check-Out
                        </Link>
                      </div>
                    )}
                  </div>
                  {/* Rooms Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleSubMenu("rooms")}
                      className="w-full flex justify-between items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Room Management
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform transition-transform duration-200 ${
                          showSubMenu.rooms ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {showSubMenu.rooms && (
                      <div className="bg-gray-50 pl-12">
                        <Link
                          to="/manageroom"
                          className="px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 text-sm flex items-center"
                          onClick={() => setShowMenu(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Manage Room
                        </Link>
                        <Link
                          to="/cleaningstatus"
                          className="px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 text-sm flex items-center"
                          onClick={() => setShowMenu(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Housekeeping
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <button
                      onClick={() => toggleSubMenu("events")}
                      className="w-full flex justify-between items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Event Management
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform transition-transform duration-200 ${
                          showSubMenu.events ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {showSubMenu.events && (
                      <div className="bg-gray-50 pl-12">
                        <Link
                          to="/addevent"
                          className="px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 text-sm flex items-center"
                          onClick={() => setShowMenu(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Create Event
                        </Link>
                        <Link
                          to="/manageevent"
                          className="px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 text-sm flex items-center"
                          onClick={() => setShowMenu(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Event Calendar
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/report"
                    className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium flex items-center"
                    onClick={() => setShowMenu(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Report Generation
                  </Link>
                  <div className="border-t border-gray-100 mx-3"></div>
                  <Link
                    to="/logout"
                    className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium flex items-center"
                    onClick={() => setShowMenu(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AdminNavbar;
