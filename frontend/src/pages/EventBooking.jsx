import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import guestDetails from "../assets/images/guestdetails.jpg";

function EventBooking() {
  const navigate = useNavigate();
  const [eventDate, setEventDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState(0);
  const [eventTypes, setEventTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [checkguest, setCheckGuest] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/events/geteventtypes")
      .then((response) => {
        if (response.data.success === true) {
          console.log(response.data.eventTypes);
          setEventTypes(response.data.eventTypes || []);
        }
      })
      .catch(() => {
        toast.error("❌ Failed to fetch event types!");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/guests/checkguest", {
        withCredentials: true,
      })
      .then((response) => {
        const isGuest = response.data === true;
        console.log(isGuest);

        if (!isGuest) {
          toast.error("You need to register before room booking.", {
            autoClose: 2000,
            position: "top-right",
          });
          setTimeout(() => navigate("/guestregistration"), 2000);
        } else {
          console.log("✅ Guest verified");
          setCheckGuest(true);
        }
      })
      .catch((error) => {
        console.error("Error checking guest:", error);
        toast.error("Server error. Try again.", {
          autoClose: 2000,
          position: "top-right",
        });
      });
  }, [location.state, navigate]);

  function changeEventDate(event) {
    const selectedDate = new Date(event.target.value);
    const selectedCheckoutDate = new Date(checkoutDate);
    const today = new Date();
    today.setHours(10, 0, 0, 0);
    if (selectedDate < today) {
      setDateErrorMessage("❌ Event date cannot be in the past!");
      setEventDate("");
    } else if (checkoutDate && selectedDate > selectedCheckoutDate) {
      setDateErrorMessage("❌ Check-in date must be before the checkout date!");
      setEventDate("");
    } else {
      setDateErrorMessage("");
      setEventDate(event.target.value);
    }
  }

  function changeCheckoutDate(event) {
    const selectedDate = new Date(event.target.value);
    const eventSelectedDate = new Date(eventDate);
    if (!eventDate) {
      setCheckoutErrorMessage("❌ Please select an event date first!");
      setCheckoutDate("");
    } else if (selectedDate <= eventSelectedDate) {
      setCheckoutErrorMessage("❌ Checkout date must be after the event date!");
      setCheckoutDate("");
    } else {
      setCheckoutErrorMessage("");
      setCheckoutDate(event.target.value);
    }
  }

  function changeGuestCount(event) {
    const guestCount = parseInt(event.target.value, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 200) {
      setErrorMessage("❌ Number of guests must be between 1 and 200!");
      setGuests("");
    } else {
      setErrorMessage("");
      setGuests(guestCount);
    }
  }

  const calculateTotalAmount = () => {
    if (eventDate && checkoutDate && eventType && guests > 0) {
      const checkin = new Date(eventDate);
      const checkout = new Date(checkoutDate);
      const timeDiff = checkout - checkin;
      const days = timeDiff / (1000 * 3600 * 24);
      const eventDetails = eventTypes.find((e) => e.eventType === eventType);

      if (eventDetails) {
        const total = days * eventDetails.cost;
        setTotalAmount(total);
      }
    }
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [eventDate, checkoutDate, eventType, guests]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!eventDate || !checkoutDate || !eventType || guests <= 0) {
      setErrorMessage("❌ Please fill in all required fields correctly.");
      return;
    }

    axios
      .post("http://localhost:4000/api/eventbookings/checkeventavailability", {
        eventDate,
        checkoutDate,
      })
      .then((response) => {
        console.log("Response Status:", response.status); // Log the status code
        console.log("Backend Response:", response.data); // Log the data as well

        if (response.data.success === false) {
          setIsAvailable(false);
          toast.error("The hall is not available for the selected dates.");
        } else {
          setIsAvailable(true);

          axios
            .post(
              "http://localhost:4000/api/eventbookings/eventbooking",
              { eventDate, checkoutDate, eventType, guests, totalAmount },
              { withCredentials: true }
            )
            .then((response) => {
              if (response.data === true) {
                toast.success("Event Booking successful!");
                setTimeout(() => navigate("/home"), 2000); // Redirect after success
              } else {
                toast.error(response.data.message || "Booking failed.");
              }
            })
            .catch((error) => {
              console.error("Booking Error:", error); // Log the full error
              toast.error("Booking failed! Try again.", {
                position: "top-right",
                autoClose: 2000,
              });
            });
        }
      })
      .catch((error) => {
        console.error("Availability Check Error:", error); // Log the error details
        toast.error("Failed to check event availability!");
      });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-2 my-1 relative"
      style={{
        backgroundImage: `url(${guestDetails})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#d9232e] py-5 px-6">
          <h1 className="text-2xl font-bold text-white text-center">
            Event Booking
          </h1>
        </div>

        <div className="p-6 sm:p-8">
          {isAvailable ? (
            <>
              <p className="text-gray-600 text-center mb-6">
                Plan your special event with us! Choose your event date and
                provide the required details.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={changeEventDate}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
                    />
                    {dateErrorMessage && (
                      <p className="text-red-500 text-sm mt-1">
                        {dateErrorMessage}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Checkout Date
                    </label>
                    <input
                      type="date"
                      value={checkoutDate}
                      onChange={changeCheckoutDate}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
                    />
                    {checkoutErrorMessage && (
                      <p className="text-red-500 text-sm mt-1">
                        {checkoutErrorMessage}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select
                      onChange={(e) => setEventType(e.target.value)}
                      value={eventType}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
                    >
                      <option value="" disabled>
                        Select Event Type
                      </option>
                      {eventTypes.map((type) => (
                        <option key={type._id} value={type.eventType}>
                          {type.eventType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      onChange={changeGuestCount}
                      placeholder="Enter guest count (1-200)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="text-red-500 text-sm text-center">
                      {errorMessage}
                    </p>
                  </div>
                )}

                {totalAmount > 0 && (
                  <div className="text-lg font-bold text-center mt-4">
                    Total Amount: Rs {totalAmount}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#d9232e] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#9e1e25] transition duration-200 cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center text-red-500">
              <p>The event hall is not available for the selected dates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventBooking;
