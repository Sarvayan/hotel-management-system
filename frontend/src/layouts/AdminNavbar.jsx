import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBell, FaUser, FaClipboardList, FaLock, FaCalendarAlt, 
         FaHome, FaSignOutAlt, FaChevronDown, FaChevronUp, 
         FaTimes, FaBars, FaHotel, FaConciergeBell } from "react-icons/fa";

function AdminNavbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState({
    bookings: false,
    rooms: false,
    events: false,
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
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
            <div key="room" className="mb-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r shadow-sm">
              <p className="text-sm text-gray-800">There are {reservedBookings.length} room bookings pending approval.</p>
              <Link
                to="/bookingrequest"
                className="inline-block mt-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition duration-200"
              >
                Review Requests
              </Link>
            </div>
          );
        }

        const reservedEventBookings = eventRes.data.retdata;
        if (reservedEventBookings.length > 0) {
          newNotifications.push(
            <div key="event" className="mb-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r shadow-sm">
              <p className="text-sm text-gray-800">There are {reservedEventBookings.length} event bookings pending approval.</p>
              <Link
                to="/bookingrequest"
                className="inline-block mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200"
              >
                Review Requests
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
                className="mb-2 p-3 bg-red-50 border-l-4 border-red-400 rounded-r shadow-sm"
              >
                <p className="text-sm text-gray-800">Room {room.roomNo} requires cleaning.</p>
                <Link
                  to="/cleaningstatus"
                  className="inline-block mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200"
                >
                  Update Status
                </Link>
              </div>
            );
          });
        }

        const newText = extractNotificationText(newNotifications);
        if (newText !== prevNotificationsText.current) {
          setNotifications(newNotifications);
          prevNotificationsText.current = newText;
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    setShowMenu(false);
  };

  const toggleSubMenu = (menu) => {
    setShowSubMenu({
      ...showSubMenu,
      [menu]: !showSubMenu[menu],
    });
  };

  const closeAllMenus = () => {
    setShowMenu(false);
    setShowNotifications(false);
    setShowSubMenu({
      bookings: false,
      rooms: false,
      events: false,
    });
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-red-700 to-red-600 shadow-lg z-50 px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/adminhome" className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-lg shadow">
            <FaHotel className="text-red-600 text-xl" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">WeAre Villa</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleBellClick}
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 relative"
              aria-label="Notifications"
            >
              <FaBell className="text-white text-lg" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-800">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && notifications.length > 0 && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 animate-fadeIn">
                <div className="bg-red-600 px-4 py-3 flex justify-between items-center">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
                    Notifications ({notifications.length})
                  </h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                    >
                      {notification}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-4 py-2 text-center text-xs text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <span className="text-white font-medium hidden md:inline">Admin</span>
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-red-600 font-bold">
                <FaUser className="text-sm" />
              </div>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-14 w-56 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 animate-fadeIn">
                <div className="py-1">
                  <Link
                    to="/adminhome"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                    onClick={closeAllMenus}
                  >
                    <FaHome className="mr-3 text-gray-500" />
                    Dashboard
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <Link
                    to="/logout"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                    onClick={closeAllMenus}
                  >
                    <FaSignOutAlt className="mr-3 text-gray-500" />
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          <button
            onClick={handleBellClick}
            className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 relative"
            aria-label="Notifications"
          >
            <FaBell className="text-white text-lg" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-800">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
            aria-label="Menu"
          >
            {showMenu ? (
              <FaTimes className="text-white text-lg" />
            ) : (
              <FaBars className="text-white text-lg" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/30" onClick={closeAllMenus}></div>
        <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Admin Menu</h3>
            <button onClick={closeAllMenus} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <div className="p-4">
            <Link
              to="/adminhome"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 mb-1"
              onClick={closeAllMenus}
            >
              <FaHome className="mr-3 text-gray-500" />
              Dashboard
            </Link>

            <Link
              to="/guestlist"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 mb-1"
              onClick={closeAllMenus}
            >
              <FaUser className="mr-3 text-gray-500" />
              Guest Management
            </Link>

            <Link
              to="/blacklistaccount"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 mb-1"
              onClick={closeAllMenus}
            >
              <FaLock className="mr-3 text-gray-500" />
              Security Controls
            </Link>

            <div className="mb-1">
              <button
                onClick={() => toggleSubMenu("bookings")}
                className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700"
              >
                <div className="flex items-center">
                  <FaClipboardList className="mr-3 text-gray-500" />
                  Reservation System
                </div>
                {showSubMenu.bookings ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
              </button>
              {showSubMenu.bookings && (
                <div className="pl-8 mt-1 space-y-1">
                  <Link
                    to="/bookingrequest"
                    className="block px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700"
                    onClick={closeAllMenus}
                  >
                    Booking Approvals
                  </Link>
                  <Link
                    to="/checkin"
                    className="block px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700"
                    onClick={closeAllMenus}
                  >
                    Guest Check-In
                  </Link>
                  <Link
                    to="/checkout"
                    className="block px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700"
                    onClick={closeAllMenus}
                  >
                    Guest Check-Out
                  </Link>
                </div>
              )}
            </div>

            <div className="mb-1">
              <button
                onClick={() => toggleSubMenu("rooms")}
                className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700"
              >
                <div className="flex items-center">
                  <FaHotel className="mr-3 text-gray-500" />
                  Room Management
                </div>
                {showSubMenu.rooms ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
              </button>
              {showSubMenu.rooms && (
                <div className="pl-8 mt-1 space-y-1">
                  <Link
                    to="/manageroom"
                    className="block px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700"
                    onClick={closeAllMenus}
                  >
                    Manage Rooms
                  </Link>
                  <Link
                    to="/cleaningstatus"
                    className="block px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700"
                    onClick={closeAllMenus}
                  >
                    Housekeeping
                  </Link>
                </div>
              )}
            </div>

            <div className="mb-1">
              <button
                onClick={() => toggleSubMenu("events")}
                className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700"
              >
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3 text-gray-500" />
                  Event Management
                </div>
                {showSubMenu.events ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
              </button>
              {showSubMenu.events && (
                <div className="pl-8 mt-1 space-y-1">
                  <Link
                    to="/addevent"
                    className="block px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700"
                    onClick={closeAllMenus}
                  >
                    Create Event
                  </Link>
                  <Link
                    to="/manageevent"
                    className="block px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700"
                    onClick={closeAllMenus}
                  >
                    Event Calendar
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/report"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 mb-1"
              onClick={closeAllMenus}
            >
              <FaClipboardList className="mr-3 text-gray-500" />
              Report Generation
            </Link>

            <div className="border-t border-gray-200 mt-2 pt-2">
              <Link
                to="/logout"
                className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700"
                onClick={closeAllMenus}
              >
                <FaSignOutAlt className="mr-3 text-gray-500" />
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Notifications */}
      {showNotifications && notifications.length > 0 && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30 flex justify-end pt-16" onClick={handleBellClick}>
          <div className="w-full max-w-sm bg-white h-full shadow-xl animate-slideIn" onClick={e => e.stopPropagation()}>
            <div className="bg-red-600 px-4 py-3 flex justify-between items-center">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
                Notifications ({notifications.length})
              </h4>
              <button
                onClick={handleBellClick}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-56px)]">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                >
                  {notification}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
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
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AdminNavbar;