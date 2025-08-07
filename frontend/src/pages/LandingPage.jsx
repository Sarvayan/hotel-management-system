import React from "react";
import { Link } from "react-router-dom";
import adminBg from "../assets/images/admin-bg3.jpg";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 w-full bg-[#d9232e] shadow-lg z-50 py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b border-white/20">
        <div className="mx-auto w-full max-w-7xl flex justify-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center tracking-tight">
            Welcome to WeAre Villa
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden pt-16">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${adminBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden max-w-3xl mx-auto">
            {/* Decorative Elements */}
            <div className="bg-[#d9232e] h-2 w-full"></div>

            <div className="p-8 sm:p-10 md:p-12">
              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 font-serif tracking-tight">
                  WeAre Villa
                </h1>
                <div className="w-24 h-1 bg-[#d9232e] mx-auto mb-6"></div>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  Welcome back! Take charge of operations, streamline bookings,
                  and keep the villa experience exceptional.
                </p>
              </div>

              {/* Buttons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {/* Admin Portal Button */}
                <Link to="/adminlogin" className="group">
                  <button className="w-full flex items-center justify-between bg-[#d9232e] hover:bg-[#c11e28] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer">
                    <span>Admin Portal</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Link>

                {/* Client Portal Button */}
                <Link to="/login" className="group">
                  <button className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer">
                    <span>Client Portal</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#d9232e] text-white py-4 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Anuthama Villa. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
