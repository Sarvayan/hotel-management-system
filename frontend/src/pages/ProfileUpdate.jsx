import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminBg from "../assets/images/admin-bg3.jpg";

function ProfileUpdate() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user || {};

  const [formData, setFormData] = useState({
    fname: user.fname || "",
    lname: user.lname || "",
    address: user.address || "",
    phonenum: user.phoneNumber || "",
    gender: user.gender || "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const nameRegex = /^[A-Za-z]{2,50}$/;
  const phoneRegex = /^\+94[1-9][0-9]{8}$/;
  const addressRegex = /^\d+\s[A-Za-z0-9\s,.#-]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    // Validation checks
    if (Object.values(formData).some((field) => field.trim() === "")) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!nameRegex.test(formData.fname)) {
      setErrorMessage("Invalid First Name (2-50 letters only)");
      return;
    }

    if (!nameRegex.test(formData.lname)) {
      setErrorMessage("Invalid Last Name (2-50 letters only)");
      return;
    }

    if (!addressRegex.test(address)) {
      setAddressErrorMessage("❌ Invalid Address format!");
      return;
    }

    if (!phoneRegex.test(formData.phonenum)) {
      setErrorMessage("Phone number must start with +94 and have 9 digits");
      return;
    }

    if (!["Male", "Female", "Other"].includes(formData.gender)) {
      setErrorMessage("Please select a valid gender");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:4000/api/guests/updateguest",
        formData,
        { withCredentials: true }
      );

      if (response.data === true) {
        toast.success("Profile Updated Successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => navigate("/guestdashboard"), 2000);
      } else {
        toast.error(response.data || "Update failed. Please try again.");
      }
    } catch (error) {
      toast.error("Error updating profile. Please try again later.");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-gray-100 opacity-95"></div>
      <div
        className="absolute inset-0 w-full h-full opacity-5"
        style={{
          backgroundImage: `url(${adminBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden relative z-10 transform transition-all duration-300 hover:shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 py-6 px-6 sm:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center tracking-wide">
            Update Your Profile
          </h1>
          <p className="text-red-100 text-center mt-2 text-sm sm:text-base">
            Keep your information up to date
          </p>
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200"
                  onChange={handleChange}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  placeholder="123 Main St, City"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200"
                  onChange={handleChange}
                />
              </div>

              {/* Phone Number */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phonenum"
                    value={formData.phonenum}
                    placeholder="+94123456789"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200 pl-12"
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: +94XXXXXXXXX
                </p>
              </div>

              {/* Gender */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjQgdjR2NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_1rem_center]"
                >
                  <option value="" disabled>
                    Select your gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdate;
