import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ServiceSection from "../components/ServiceSection";
import adminBg from "../assets/images/admin-bg3.jpg";

function GuestDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/guests/dashboard",
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data", {
          position: "top-center",
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const navigateTo = (path) => {
    navigate(path, { state: { user } });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Decorative background */}
      <div
        className="absolute inset-0 w-full h-full opacity-10 z-0"
        style={{
          backgroundImage: `url(${adminBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome,{" "}
            <span className="text-[#00BFAE]">{user.fname || "Guest"}</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-xl text-gray-600">
            Your personalized dashboard
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Profile header */}
              <div className="bg-[#d9232e] py-6 px-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-white">
                    Profile Details
                  </h1>
                  <span className="bg-white text-[#00BFAE] text-xs font-semibold px-3 py-1 rounded-full">
                    {user.status || "Guest"}
                  </span>
                </div>
              </div>

              {/* Profile content */}
              {loading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00BFAE]"></div>
                </div>
              ) : (
                <div className="p-6">
                  {/* User details */}
                  <div className="space-y-4">
                    {[
                      { label: "First Name", value: user.fname },
                      { label: "Last Name", value: user.lname },
                      { label: "Email", value: user.email },
                      { label: "Phone", value: user.phoneNumber },
                      { label: "Address", value: user.address },
                      { label: "Gender", value: user.gender },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-100 pb-3"
                      >
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {item.label}
                        </p>
                        <p className="text-gray-800 font-medium mt-1">
                          {item.value || "-"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigateTo("/updateprofile")}
                      className="bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white py-2 px-4 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      Update Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/bookinghistory")}
                      className="bg-gradient-to-r from-[#d9232e] to-[#a51c24] text-white py-2 px-4 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      Booking History
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-[#d9232e] py-6 px-6">
                <h1 className="text-2xl font-bold text-white">Quick Actions</h1>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Menu Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    onClick={() => navigate("/menu")}
                    className="bg-gradient-to-br from-[#FF9A9E] to-[#FAD0C4] rounded-xl p-6 shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-30 rounded-full p-3 mr-4">
                        <svg
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Food Menu
                        </h3>
                        <p className="text-white text-opacity-80 text-sm">
                          Browse our delicious offerings
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Feedback Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    onClick={() => navigate("/addfeedback")}
                    className="bg-gradient-to-br from-[#A1C4FD] to-[#C2E9FB] rounded-xl p-6 shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-30 rounded-full p-3 mr-4">
                        <svg
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Give Feedback
                        </h3>
                        <p className="text-white text-opacity-80 text-sm">
                          Share your experience with us
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Review Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    onClick={() => navigate("/addreview")}
                    className="bg-gradient-to-br from-[#FFC3A0] to-[#FFAFBD] rounded-xl p-6 shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-30 rounded-full p-3 mr-4">
                        <svg
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Write a Review
                        </h3>
                        <p className="text-white text-opacity-80 text-sm">
                          Rate your stay with us
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Services Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-[#84FAB0] to-[#8FD3F4] rounded-xl p-6 shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-30 rounded-full p-3 mr-4">
                        <svg
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Our Services
                        </h3>
                        <p className="text-white text-opacity-80 text-sm">
                          Explore what we offer
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Services section */}
            <div className="mt-8">
              <ServiceSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestDashboard;
