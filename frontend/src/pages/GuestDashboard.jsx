import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import service1 from "../assets/images/service1.png";
import service2 from "../assets/images/service2.jpg";
import { Link } from "react-router-dom";
import ServiceSection from "../components/ServiceSection";

function GuestDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/guests/dashboard", {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  useEffect(() => {
    if (user.email) {
      setShow(true);
    }
  }, [user]);

  function handleSubmit() {
    navigate("/updateprofile", { state: { user } });
  }

  function handleViewBooking() {
    navigate("/bookinghistory");
  }

  function handleFeedback() {
    navigate("/addfeedback");
  }

  function handleReview() {
    navigate("/addreview");
  }

  function handleMenu() {
    navigate("/menu");
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-10">
      <div className="bg-[#00BFAE] shadow-lg rounded-lg p-6 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Guest Profile
        </h1>

        {show && (
          <div>
            {/* Personal Details Header with View Booking History Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-black">
                Personal Details
              </h2>
              <button
                onClick={handleViewBooking}
                className="bg-[#d9232e] text-white px-4 py-2 rounded-md hover:text-[#FFD700] cursor-pointer transition duration-200 text-sm"
              >
                View Booking History
              </button>
            </div>

            {/* User Details */}
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <h4 className="font-medium text-blue-900">First Name</h4>
                <p>{user.fname}</p>
              </div>
              <div className="flex justify-between">
                <h4 className="font-medium text-blue-900">Last Name</h4>
                <p>{user.lname}</p>
              </div>
              <div className="flex justify-between">
                <h4 className="font-medium text-blue-900">Address</h4>
                <p>{user.address}</p>
              </div>
              <div className="flex justify-between">
                <h4 className="font-medium text-blue-900">Email Address</h4>
                <p>{user.email}</p>
              </div>
              <div className="flex justify-between">
                <h4 className="font-medium text-blue-900">Phone Number</h4>
                <p>{user.phoneNumber}</p>
              </div>
              <div className="flex justify-between">
                <h4 className="font-medium text-blue-900">Gender</h4>
                <p>{user.gender}</p>
              </div>
              <div className="flex justify-between">
                <h4 className="font-medium text-blue-900">Status</h4>
                <p>{user.status}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-4 justify-center">
              
              <button
                onClick={handleSubmit}
                className="w-1/3 bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white py-3 rounded-md hover:from-[#8E44AD] hover:to-[#9B59B6] hover:scale-105 transition duration-300 text-sm font-semibold shadow-lg cursor-pointer"
              >
                Update Profile
              </button>
             
            </div>
          </div>
        )}
      </div>

        <ServiceSection/>
    </div>
  );
}

export default GuestDashboard;
