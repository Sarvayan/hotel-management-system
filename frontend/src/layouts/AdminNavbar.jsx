import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

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
  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <div
              key="room"
              className="mb-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <p className="text-sm font-medium text-yellow-800">
                {reservedBookings.length} room booking
                {reservedBookings.length !== 1 ? "s" : ""} awaiting approval
              </p>
              <Link
                to="/bookingrequest"
                className="inline-block mt-2 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded transition duration-200"
              >
                Review Requests
              </Link>
            </div>
          );
        }

        const reservedEventBookings = eventRes.data.retdata;
        if (reservedEventBookings.length > 0) {
          newNotifications.push(
            <div
              key="event"
              className="mb-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <p className="text-sm font-medium text-blue-800">
                {reservedEventBookings.length} event booking
                {reservedEventBookings.length !== 1 ? "s" : ""} pending
              </p>
              <Link
                to="/bookingrequest"
                className="inline-block mt-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded transition duration-200"
              >
                View Details
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
                className="mb-2 p-3 bg-red-50 border-l-4 border-red-400 rounded-r shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <p className="text-sm font-medium text-red-800">
                  Cleaning required: Room {room.roomNo}
                </p>
                <Link
                  to="/cleaningstatus"
                  className="inline-block mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded transition duration-200"
                >
                  Update Status
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
              `You have ${notifications.length} new notification${
                notifications.length !== 1 ? "s" : ""
              }`
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
    setShowMenu(false);
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
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-red-700 to-red-600 shadow-lg z-50 p-2 md:p-3 flex justify-between items-center border-b border-white/10">
        {/* Logo/Brand */}
        <Link to="/adminhome" className="flex items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 md:h-10 md:w-10 text-white mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight hidden sm:inline">
              Anuthama Villa
            </span>
          </div>
        </Link>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Voice Command Button - Hidden on mobile */}
          <button
            onClick={handleVoiceCommand}
            className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none"
            aria-label="Voice command"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleBellClick}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 relative"
              aria-label="Notifications"
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
                <span className="absolute top-0 right-0 h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-800 transform transition-transform hover:scale-110">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="fixed md:absolute top-14 md:top-12 right-2 md:right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 animate-fadeIn">
                <div className="bg-gradient-to-r from-red-700 to-red-600 px-4 py-3 flex justify-between items-center">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Notifications
                  </h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                      >
                        {notification}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-300 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="bg-gray-50 px-4 py-2 text-center text-xs text-gray-500 font-medium">
                    {notifications.length} unread notification
                    {notifications.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none"
              aria-label="Main menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white transform transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {showMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Main Menu Dropdown */}
            {showMenu && (
              <div className="fixed md:absolute top-14 md:top-12 right-2 w-64 md:w-72 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 animate-fadeIn">
                {/* User Info */}
                <div className="bg-gradient-to-r from-red-700 to-red-600 px-4 py-3 flex items-center">
                  <div className="bg-white/20 rounded-full p-2 mr-3">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Admin Dashboard</p>
                    <p className="text-white/80 text-xs">Administrator</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1 divide-y divide-gray-100">
                  {/* Dashboard */}
                  <Link
                    to="/adminhome"
                    className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium flex items-center"
                    onClick={() => setShowMenu(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Dashboard
                  </Link>

                  {/* Guest Management */}
                  <div>
                    <Link
                      to="/guestlist"
                      className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium flex items-center"
                      onClick={() => setShowMenu(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Guest Management
                    </Link>
                  </div>

                  {/* Security Controls */}
                  <div>
                    <Link
                      to="/blacklistaccount"
                      className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium flex items-center"
                      onClick={() => setShowMenu(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
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
                  </div>

                  {/* Reservation System */}
                  <div>
                    <button
                      onClick={() => toggleSubMenu("bookings")}
                      className="w-full flex justify-between items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3 text-gray-500"
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
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                          onClick={() => setShowMenu(false)}
                        >
                          Booking Approvals
                        </Link>
                        <Link
                          to="/checkin"
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                          onClick={() => setShowMenu(false)}
                        >
                          Guest Check-In
                        </Link>
                        <Link
                          to="/checkout"
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                          onClick={() => setShowMenu(false)}
                        >
                          Guest Check-Out
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Room Management */}
                  <div>
                    <button
                      onClick={() => toggleSubMenu("rooms")}
                      className="w-full flex justify-between items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3 text-gray-500"
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
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                          onClick={() => setShowMenu(false)}
                        >
                          Manage Rooms
                        </Link>
                        <Link
                          to="/cleaningstatus"
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                          onClick={() => setShowMenu(false)}
                        >
                          Housekeeping
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Event Management */}
                  <div>
                    <button
                      onClick={() => toggleSubMenu("events")}
                      className="w-full flex justify-between items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-3 text-gray-500"
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
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                          onClick={() => setShowMenu(false)}
                        >
                          Create Event
                        </Link>
                        <Link
                          to="/manageevent"
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                          onClick={() => setShowMenu(false)}
                        >
                          Event Calendar
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Reports */}
                  <div>
                    <Link
                      to="/report"
                      className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium flex items-center"
                      onClick={() => setShowMenu(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Report Generation
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div>
                    <Link
                      to="/logout"
                      className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 font-medium flex items-center"
                      onClick={() => setShowMenu(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
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
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="h-16 md:h-20"></div>

      {/* Animation Styles */}
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
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AdminNavbar;
