import React from "react";
import { Link } from "react-router-dom";
import adminBg from "../assets/images/admin-bg3.jpg";

function LandingPage() {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full rounded-md bg-[#d9232e] shadow-xl z-50 p-9 flex justify-between items-center border-b border-white/10">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-bold text-white text-center">
            Welcome to Anuthama Villa !
          </h1>
        </div>
      </div>

      <div
        className="min-h-screen flex flex-col items-center justify-center p-2 my-1 relative"
        style={{
          backgroundImage: `url(${adminBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="z-10 text-center max-w-2xl bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-serif">
            Admin Dashboard
            <br />
            Anuthama Villa
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Welcome back! Take charge of operations, streamline bookings, and
            keep the villa experience exceptional.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/adminlogin" className="w-full sm:w-auto">
              <button className="w-full bg-[#d9232e] text-white py-3 px-4 rounded-lg font-semibold text-lg hover:brightness-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d9232e]/50 focus:ring-offset-2 transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer">
                Admin Portal
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block ml-2"
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
  );
}

export default LandingPage;
