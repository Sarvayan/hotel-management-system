import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import gallery1 from "../assets/images/gallery1.jpg";
import gallery2 from "../assets/images/gallery2.jpg";
import gallery3 from "../assets/images/gallery3.jpg";
import gallery4 from "../assets/images/gallery4.jpg";
import gallery5 from "../assets/images/gallery5.jpg";
import gallery6 from "../assets/images/gallery6.jpg";
import gallery7 from "../assets/images/gallery7.jpg";

// Corrected images array
const images = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-[100%] md:w-[80%] lg:w-[75%] h-[400px] overflow-hidden mx-auto bg-white">
      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        alt="Banner"
        className="w-full h-full object-cover"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.8 }}
      />

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 p-4 shadow-lg rounded-md hover:bg-gray-100 transition"
      >
        <FaArrowLeft className="text-2xl text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 p-4 shadow-lg rounded-md hover:bg-gray-100 transition"
      >
        <FaArrowRight className="text-2xl text-gray-700" />
      </button>
    </div>
  );
};

export default Slider;
