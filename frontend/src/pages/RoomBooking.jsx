import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminBg from "../assets/images/admin-bg3.jpg";
import image6 from "../assets/images/gallery6.jpg";

function RoomBooking() {
  const [formData, setFormData] = useState({
    checkin: "",
    checkout: "",
    roomType: "",
    adult: 1,
    children: 0,
    nationality: "",
    noofrooms: 1,
    kitchen: "No",
  });
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [errors, setErrors] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/rooms/getrooms")
      .then((data) => {
        if (data.data.success === true) {
          setRooms(data.data.rooms);
        } else {
          toast.error("Error fetching room details.");
        }
      })
      .catch(() => {
        toast.error("Failed to fetch room details. Please try again.");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/guests/checkguest", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data !== true) {
          toast.error("Please complete guest registration before booking.");
          setTimeout(() => navigate("/guestregistration"), 2000);
        }
      })
      .catch(() => {
        toast.error("Server error. Please try again.");
      });
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "checkin") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(10, 0, 0, 0);
      if (selectedDate < today) {
        error = "Check-in date cannot be in the past";
      }
    } else if (name === "checkout" && formData.checkin) {
      const selectedDate = new Date(value);
      const checkinDate = new Date(formData.checkin);
      if (selectedDate <= checkinDate) {
        error = "Checkout must be after check-in";
      }
    } else if (name === "noofrooms") {
      if (parseInt(value) > availableRooms.length) {
        error = "Not enough available rooms";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [
    formData.checkin,
    formData.checkout,
    formData.roomType,
    formData.noofrooms,
    rooms,
  ]);

  const calculateTotalAmount = () => {
    if (formData.checkin && formData.checkout && formData.roomType) {
      const checkinDate = new Date(formData.checkin);
      const checkoutDate = new Date(formData.checkout);
      const timeDiff = checkoutDate - checkinDate;
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const roomDetails = rooms.find((r) => r.roomType === formData.roomType);
      if (roomDetails) {
        const total = days * roomDetails.pricePerNight * formData.noofrooms;
        setTotalAmount(total);
      }
    }
  };

  useEffect(() => {
    if (formData.roomType) {
      const filteredRooms = rooms
        .filter((room) => room.roomType === formData.roomType)
        .sort((a, b) =>
          a.roomNo.localeCompare(b.roomNo, undefined, { numeric: true })
        );
      setAvailableRooms(filteredRooms);
    } else {
      setAvailableRooms([]);
    }
  }, [formData.roomType, rooms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
    const isValid = Object.keys(formData).every((key) => {
      if (key === "children" || key === "kitchen") return true;
      if (!formData[key]) {
        setErrors((prev) => ({ ...prev, [key]: "This field is required" }));
        return false;
      }
      return true;
    });

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    if (formData.noofrooms >= 3) {
      setFormData((prev) => ({ ...prev, kitchen: "Yes" }));
    }

    const assignedRoomNos = availableRooms
      .slice(0, formData.noofrooms)
      .map((room) => room.roomNo);

    try {
      const availabilityResponse = await axios.post(
        "http://localhost:4000/api/roombookings/checkroomavailability",
        {
          checkin: formData.checkin,
          checkout: formData.checkout,
          roomType: formData.roomType,
          noofrooms: formData.noofrooms,
        }
      );

      if (!availabilityResponse.data.success) {
        setIsAvailable(false);
        toast.error("Selected rooms are not available for these dates");
        setIsLoading(false);
        return;
      }

      const bookingResponse = await axios.post(
        "http://localhost:4000/api/roombookings/roombooking",
        {
          ...formData,
          totalAmount,
          assignedRoomNos,
        },
        { withCredentials: true }
      );

      if (bookingResponse.data.success) {
        toast.success("Booking successful!");
        setTimeout(() => navigate("/bookinghistory"), 2000);
      } else {
        toast.error(bookingResponse.data.message || "Booking failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background with subtle overlay */}
      <div className="absolute inset-0 bg-black opacity-5 z-0"></div>
      <div
        className="absolute inset-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `url(${adminBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main card container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-red-700 to-red-600 py-8 px-6 sm:px-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Luxury Room Reservation
            </h1>
            <p className="text-white text-opacity-90 text-lg">
              Book your perfect stay with us
            </p>
          </div>

          {/* Form and content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left side - Image and info (hidden on mobile) */}
            <div className="hidden lg:block bg-gray-50 p-8 border-r border-gray-200">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="rounded-lg overflow-hidden mb-6 shadow-md">
                    <img
                      src={image6}
                      alt="Luxury Room"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Why Book With Us?
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">
                        Best price guarantee
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">No booking fees</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">
                        24/7 customer service
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">Free cancellation</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100">
                  <h4 className="font-medium text-red-700 mb-2">Need help?</h4>
                  <p className="text-sm text-gray-600">
                    Contact our reservation team at{" "}
                    <span className="text-red-600">+94 76 123 4567</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="lg:col-span-2 p-6 sm:p-8 lg:p-10">
              {isAvailable ? (
                <>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-in Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="checkin"
                            value={formData.checkin}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:border-transparent transition ${
                              errors.checkin
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            required
                          />
                          {errors.checkin && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.checkin}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-out Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="checkout"
                            value={formData.checkout}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:border-transparent transition ${
                              errors.checkout
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            required
                            disabled={!formData.checkin}
                          />
                          {errors.checkout && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.checkout}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Guest Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adults
                        </label>
                        <select
                          name="adult"
                          value={formData.adult}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg f focus:border-transparent transition"
                          required
                        >
                          {[1, 2, 3, 4].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "Adult" : "Adults"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Children
                        </label>
                        <select
                          name="children"
                          value={formData.children}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition"
                        >
                          {[0, 1, 2, 3].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "Child" : "Children"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nationality
                        </label>
                        <select
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:border-transparent transition ${
                            errors.nationality
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        >
                          <option value="">Select Nationality</option>
                          <option value="Resident">Resident</option>
                          <option value="Non-Resident">Non-Resident</option>
                        </select>
                        {errors.nationality && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.nationality}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Room Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Room Type
                        </label>
                        <select
                          name="roomType"
                          value={formData.roomType}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:border-transparent transition ${
                            errors.roomType
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        >
                          <option value="">Select Room Type</option>
                          <option value="Single">Single Room</option>
                          <option value="Double">Double Room</option>
                          <option value="Deluxe">Deluxe Suite</option>
                          <option value="Executive">Executive Suite</option>
                        </select>
                        {errors.roomType && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.roomType}
                          </p>
                        )}
                      </div>
                      {formData.roomType && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Rooms
                          </label>
                          <select
                            name="noofrooms"
                            value={formData.noofrooms}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg  focus:border-transparent transition ${
                              errors.noofrooms
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            required
                          >
                            {availableRooms.length > 0 ? (
                              Array.from(
                                { length: Math.min(availableRooms.length, 5) },
                                (_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1} {i === 0 ? "Room" : "Rooms"}
                                  </option>
                                )
                              )
                            ) : (
                              <option value="">No rooms available</option>
                            )}
                          </select>
                          {errors.noofrooms && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.noofrooms}
                            </p>
                          )}
                          {formData.roomType && availableRooms.length > 0 && (
                            <p className="mt-2 text-xs text-gray-500">
                              Available rooms:{" "}
                              {availableRooms.map((r) => r.roomNo).join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Kitchen Notice */}
                    {formData.noofrooms >= 3 && (
                      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-yellow-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              A shared kitchen will be automatically provided
                              for bookings of 3 or more rooms.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Total Amount */}
                    {totalAmount > 0 && (
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              Estimated Total
                            </h4>
                            {formData.checkin && formData.checkout && (
                              <p className="text-sm text-gray-500 mt-1">
                                {Math.ceil(
                                  (new Date(formData.checkout) -
                                    new Date(formData.checkin)) /
                                    (1000 * 3600 * 24)
                                )}{" "}
                                night stay
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600">
                              Rs {totalAmount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Including all taxes
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer ${
                          isLoading ? "opacity-90 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing Booking...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5 mr-2 -ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            Confirm Reservation
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                    <svg
                      className="h-10 w-10 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-gray-900">
                    Room Not Available
                  </h3>
                  <p className="mt-3 text-gray-500">
                    The selected room(s) are not available for your chosen
                    dates. Please try different dates or room types.
                  </p>
                  <div className="mt-8">
                    <button
                      onClick={() => setIsAvailable(true)}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                    >
                      Try Different Dates
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomBooking;
