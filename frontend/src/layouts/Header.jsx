import { motion } from "framer-motion";
import gallery2 from "../assets/images/gallery2.jpg";

const Header = () => {
  return (
    <header className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10"></div>

      {/* Background Image */}
      <div
        style={{
          backgroundImage: `url(${gallery2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(75%)",
          zIndex: 0,
          inset: 0,
          position: "absolute",
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-4xl px-6 py-12 text-center backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl shadow-2xl">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight"
        >
          Welcome to{" "}
          <span className="text-[#ff444f] drop-shadow-lg">WeAre Villa</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-white/80 text-lg sm:text-xl max-w-2xl mx-auto"
        >
          Experience luxury, comfort, and tranquility in the heart of nature.
        </motion.p>
      </div>
    </header>
  );
};

export default Header;
