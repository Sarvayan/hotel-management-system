import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="navbar fixed top-0 left-0 w-full shadow-md bg-[#d9232e] z-50 p-4 flex justify-between items-center border-b-2 border-gray-300">
      {/* Logo */}
      <div className="text-2xl font-bold text-white">Anuthama Villa</div>

      {/* Main Nav Buttons */}
      <div className="hidden lg:flex gap-4 items-center">
        {/* Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("account")}
            className={`px-4 py-2 rounded-xl font-medium hover:bg-blue-200 transition cursor-pointer ${
              activeMenu === "account" ? "bg-blue-300" : "bg-white"
            }`}
          >
            Account
          </button>
          {activeMenu === "account" && (
            <div className="absolute top-12 right-0 bg-white shadow-md rounded-xl p-3 w-48 border border-gray-200 z-10">
              <Link
                to="/home"
                onClick={() => setActiveMenu(null)}
                className="block py-2 px-3 hover:bg-blue-100 rounded cursor-pointer"
              >
                Home
              </Link>
              <Link
                to="/guestdashboard"
                onClick={() => setActiveMenu(null)}
                className="block py-2 px-3 hover:bg-blue-100 rounded cursor-pointer"
              >
                Dashboard
              </Link>
              <Link
                to="/logout"
                onClick={() => setActiveMenu(null)}
                className="block py-2 px-3 text-red-500 hover:bg-red-100 rounded cursor-pointer"
              >
                Logout
              </Link>
            </div>
          )}
        </div>

        {/* Reviews Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("reviews")}
            className={`px-4 py-2 rounded-xl font-medium hover:bg-green-200 transition cursor-pointer ${
              activeMenu === "reviews" ? "bg-green-300" : "bg-white"
            }`}
          >
            Reviews
          </button>
          {activeMenu === "reviews" && (
            <div className="absolute top-12 right-0 bg-white shadow-md rounded-xl p-3 w-48 border border-gray-200 z-10">
              <Link
                to="/addreview"
                onClick={() => setActiveMenu(null)}
                className="block py-2 px-3 hover:bg-green-100 rounded cursor-pointer"
              >
                Give Review
              </Link>
              <Link
                to="/showreview"
                onClick={() => setActiveMenu(null)}
                className="block py-2 px-3 hover:bg-green-100 rounded cursor-pointer"
              >
                View Reviews
              </Link>
            </div>
          )}
        </div>

        {/* Feedback Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("feedback")}
            className={`px-4 py-2 rounded-xl font-medium hover:bg-yellow-200 transition cursor-pointer ${
              activeMenu === "feedback" ? "bg-yellow-300" : "bg-white"
            }`}
          >
            Feedback
          </button>
          {activeMenu === "feedback" && (
            <div className="absolute top-12 right-0 bg-white shadow-md rounded-xl p-3 w-48 border border-gray-200 z-10">
              <Link
                to="/addfeedback"
                onClick={() => setActiveMenu(null)}
                className="block py-2 px-3 hover:bg-yellow-100 rounded cursor-pointer"
              >
                Give Feedback
              </Link>
            </div>
          )}
        </div>

        {/* Orders Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("orders")}
            className={`px-4 py-2 rounded-xl font-medium hover:bg-purple-200 transition cursor-pointer ${
              activeMenu === "orders" ? "bg-purple-300" : "bg-white"
            }`}
          >
            Orders
          </button>
          {activeMenu === "orders" && (
            <div className="absolute top-12 right-0 bg-white shadow-md rounded-xl p-3 w-48 border border-gray-200 z-10">
              <Link
                to="/menu"
                onClick={() => setActiveMenu(null)}
                className="block py-2 px-3 hover:bg-purple-100 rounded cursor-pointer"
              >
                Order Food
              </Link>
              <Link
                to="/orderhistory"
                onClick={() => setActiveMenu(null)}
                className="block py-2 px-3 hover:bg-purple-100 rounded cursor-pointer"
              >
                Food Order History
              </Link>
              <Link
                to="/bookinghistory"
                onClick={() => setActiveMenu(null)}
                className="block py-2 px-3 hover:bg-purple-100 rounded cursor-pointer"
              >
                Booking History
              </Link>
            </div>
          )}
        </div>

        {/* Static Links */}
        <Link
          to="/about"
          className="text-white font-medium hover:text-[#FFD700] px-4 py-2 rounded-xl transition cursor-pointer"
        >
          About Us
        </Link>
        <Link
          to="/contactus"
          className="text-white font-medium hover:text-[#FFD700] px-4 py-2 rounded-xl transition cursor-pointer"
        >
          Contact Us
        </Link>
      </div>

      {/* Mobile Menu Icon (optional future use) */}
      <div className="lg:hidden">
        <FaBars size={24} />
      </div>
    </div>
  );
};

export default Navbar;
