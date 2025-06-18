import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const ContactUs = () => {
  return (
    <div className="bg-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}
        <motion.h1
          className="text-4xl font-bold text-blue-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Get in Touch with Us
        </motion.h1>

        {/* Contact Information Section */}
        <div className="flex flex-wrap justify-center gap-16 mb-12">
          <motion.div
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <FaPhoneAlt size={40} className="text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold text-blue-600">Call Us</h3>
            <p className="text-gray-700 mt-2">+123 456 789</p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <FaEnvelope size={40} className="text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold text-blue-600">Email Us</h3>
            <p className="text-gray-700 mt-2">info@hotel.com</p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <FaMapMarkerAlt size={40} className="text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold text-blue-600">
              Our Location
            </h3>
            <p className="text-gray-700 mt-2">
              123 Business Ave, City, Country
            </p>
          </motion.div>
        </div>

        {/* Contact Form Section */}
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Send Us a Message
          </h2>
          <form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-700 mb-2" htmlFor="name">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="border border-gray-300 p-3 rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 mb-2" htmlFor="email">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="border border-gray-300 p-3 rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col mt-6">
              <label className="text-gray-700 mb-2" htmlFor="message">
                Your Message
              </label>
              <textarea
                id="message"
                placeholder="Write your message"
                className="border border-gray-300 p-3 rounded-lg h-32"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-lg mt-6 hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Our Beautiful Hotel
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="w-full sm:w-1/2 md:w-1/3">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Hotel Image 1"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Hotel Image 2"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
