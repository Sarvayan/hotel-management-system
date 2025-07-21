import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaCircle, FaRegCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import gallery1 from "../assets/images/gallery1.jpg";
import gallery2 from "../assets/images/gallery2.jpg";
import gallery3 from "../assets/images/gallery3.jpg";
import gallery4 from "../assets/images/gallery4.jpg";
import gallery5 from "../assets/images/gallery5.jpg";
import gallery6 from "../assets/images/gallery6.jpg";
import gallery7 from "../assets/images/gallery7.jpg";

const images = [
  { src: gallery1, alt: "Luxury villa exterior" },
  { src: gallery2, alt: "Elegant living room" },
  { src: gallery3, alt: "Modern bedroom suite" },
  { src: gallery4, alt: "Scenic pool area" },
  { src: gallery5, alt: "Gourmet dining space" },
  { src: gallery6, alt: "Spa and wellness center" },
  { src: gallery7, alt: "Panoramic garden view" },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  // Auto-slide effect with pause on hover
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0.5,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0.5,
      transition: { duration: 0.8, ease: "easeInOut" },
    }),
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="relative group h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl shadow-2xl">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0"
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent via-black/20" />
            <div className="absolute bottom-8 left-8 text-white max-w-md">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">
                {images[currentIndex].alt}
              </h3>
              <p className="text-sm md:text-base opacity-90 drop-shadow-md">
                Experience luxury redefined at Anuthama Villa
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Previous slide"
        >
          <FaArrowLeft className="text-xl sm:text-2xl" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Next slide"
        >
          <FaArrowRight className="text-xl sm:text-2xl" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentIndex ? (
                <FaCircle className="text-xs sm:text-sm" />
              ) : (
                <FaRegCircle className="text-xs sm:text-sm" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;