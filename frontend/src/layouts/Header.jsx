import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const location = useLocation();

  const handleSearch = () => {
    console.log("Searching for booking with", {
      checkInDate,
      checkOutDate,
      adults,
      children,
    });
  };

  const navigate = useNavigate();

  const handleSearch1 = () => {
    navigate("/guestdashboard");
  };

  return (
    <div className="text-center py-20 bg-white">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl font-bold text-black"
      >
        Welcome to Anuthama Villa
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-2xl text-black mt-3"
      >
        Experience luxury, comfort, and tranquility in the heart of nature.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSearch1}
        className="mt-6 px-6 py-3 bg-[#d9232e] text-white font-semibold rounded-lg shadow-lg cursor-pointer hover:text-[#FFD700]"
      >
        Go To Dashboard
      </motion.button>
    </div>
  );
};

export default Header;
