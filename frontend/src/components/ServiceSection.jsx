import React from "react";
import { motion } from "framer-motion";
import service1 from "../assets/images/service1.jpg";
import service2 from "../assets/images/service2.jpg";
import { Link } from "react-router-dom";

const ServiceSection = () => {
  return (
    <div className="p-10 bg-white">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-2xl font-bold text-center mb-10 text-black"
      >
        Our Services
      </motion.h2>
      <div className="flex justify-center gap-10">
        {/* Service 1 */}
        <motion.div
          className="relative w-150 h-80 overflow-hidden rounded-lg shadow-lg"
          initial={{ x: -500 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={service1}
            alt="Room Booking"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-[#d9232e] text-white font-semibold px-4 py-2 rounded-lg transition duration-300 cursor-pointer hover:text-[#FFD700]"
            >
              <Link
                to="/roombooking"
                className="block w-full h-full text-center"
              >
                Book Your Room/s Now
              </Link>
            </motion.button>
          </div>
        </motion.div>

        {/* Service 2 */}
        <motion.div
          className="relative w-150 h-80 overflow-hidden rounded-lg shadow-lg"
          initial={{ x: 500 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={service2}
            alt="Events Planning"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-[#d9232e] text-white font-semibold px-4 py-2 rounded-lg transition duration-300 cursor-pointer hover:text-[#FFD700]"
            >
              <Link
                to="/eventbooking"
                className="block w-full h-full text-center"
              >
                Book Your Event Now
              </Link>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceSection;
