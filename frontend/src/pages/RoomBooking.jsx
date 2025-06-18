import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import guestDetails from "../assets/images/guestdetails.jpg";

function RoomBooking() {
  const [checkin, setcheckin] = useState("");
  const [checkout, setcheckout] = useState("");
  const [roomType, setroomType] = useState("");
  const [adult, setadult] = useState(0);
  const [children, setchildren] = useState(0);
  const [nationality, setnationality] = useState("");
  const [noofrooms, setnoofrooms] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [kitchen, setkitchen] = useState("No");
  const [errorMessage, seterrorMessage] = useState("");
  const [checkinErrorMessage, setCheckinErrorMessage] = useState("");
  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/rooms/getrooms")
      .then((data) => {
        if (data.data.success === true) {
          setRooms(data.data.rooms);
        } else {
          toast.error("❌ Error fetching room details.");
        }
      })
      .catch(() => {
        toast.error("❌ Fetching room details failed! Try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/guests/checkguest", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data !== true) {
          toast.error("❌ You need to register before room booking.", {
            autoClose: 2000,
            position: "top-right",
          });
          setTimeout(() => navigate("/guestregistration"), 2000);
        }
      })
      .catch(() => {
        toast.error("❌ Server error. Try again.", {
          autoClose: 2000,
          position: "top-right",
        });
      });
  }, [location.state, navigate]);

  function changeCheckin(event) {
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    today.setHours(10, 0, 0, 0);
    if (selectedDate < today) {
      setCheckinErrorMessage("❌ Check-in date cannot be in the past!");
      setcheckin("");
    } else {
      setCheckinErrorMessage("");
      setcheckin(event.target.value);
    }
  }

  function changeCheckout(event) {
    const selectedDate = new Date(event.target.value);
    const eventSelectedDate = new Date(checkin);
    if (!checkin) {
      setCheckoutErrorMessage("❌ Please select check-in date first!");
      setcheckout("");
    } else if (selectedDate <= eventSelectedDate) {
      setCheckoutErrorMessage("❌ Checkout must be after check-in!");
      setcheckout("");
    } else {
      setCheckoutErrorMessage("");
      setcheckout(event.target.value);
    }
  }

  const calculateTotalAmount = () => {
    if (checkin && checkout && roomType) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      const timeDiff = checkoutDate - checkinDate;
      const days = timeDiff / (1000 * 3600 * 24);
      const roomDetails = rooms.find((r) => r.roomType === roomType);
      if (roomDetails) {
        const total = days * roomDetails.pricePerNight * noofrooms;
        setTotalAmount(total);
      }
    }
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [checkin, checkout, roomType, noofrooms, rooms]);

  useEffect(() => {
    if (roomType) {
      const filteredRooms = rooms
        .filter((room) => room.roomType === roomType)
        .sort((a, b) =>
          a.roomNo.localeCompare(b.roomNo, undefined, { numeric: true })
        );
      setAvailableRooms(filteredRooms);
    } else {
      setAvailableRooms([]);
    }
  }, [roomType, rooms]);

  function handleSubmit(event) {
    event.preventDefault();
    seterrorMessage("");

    if (
      !checkin ||
      !checkout ||
      noofrooms < 1 ||
      adult < 1 ||
      nationality === "" ||
      roomType === ""
    ) {
      seterrorMessage("❌ Please fill all required fields.");
      return;
    }

    if (noofrooms > availableRooms.length) {
      seterrorMessage("❌ Not enough available rooms for the selected type.");
      return;
    }

    if (noofrooms >= 3) {
      setkitchen("Yes");
    }

    const assignedRoomNos = availableRooms
      .slice(0, noofrooms)
      .map((room) => room.roomNo);

    axios
      .post("http://localhost:4000/api/roombookings/checkroomavailability", {
        checkin,
        checkout,
        roomType,
        noofrooms,
      })
      .then((response) => {
        if (response.data.success === false) {
          setIsAvailable(false);
          toast.error("Room(s) not available for the selected dates.");
        } else {
          setIsAvailable(true);
          axios
            .post(
              "http://localhost:4000/api/roombookings/roombooking",
              {
                checkin,
                checkout,
                noofrooms,
                roomType,
                adult,
                children,
                nationality,
                kitchen,
                totalAmount,
                assignedRoomNos,
              },
              { withCredentials: true }
            )
            .then((response) => {
              if (response.data.success === true) {
                toast.success("Room Booking Was Successful!");
                setTimeout(() => navigate("/bookinghistory"), 2000);
              } else {
                toast.error(response.data.message || "Booking failed.");
              }
            })
            .catch(() => {
              toast.error("Booking failed! Try again.", {
                position: "top-right",
                autoClose: 2000,
              });
            });
        }
      })
      .catch(() => {
        toast.error("❌ Failed to check room availability!");
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
            Room Booking
          </h1>
        </div>
        <div className="p-6 sm:p-8">
          {isAvailable ? (
            <>
              <p className="text-gray-600 text-center mb-6">
                Book your stay with us! Choose your check-in and check-out
                dates, and provide the necessary details.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <input
                      type="date"
                      value={checkin}
                      onChange={changeCheckin}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {checkinErrorMessage && (
                      <div className="text-red-500 text-sm mt-1">
                        {checkinErrorMessage}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="date"
                      value={checkout}
                      onChange={changeCheckout}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {checkoutErrorMessage && (
                      <div className="text-red-500 text-sm mt-1">
                        {checkoutErrorMessage}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <select
                    value={adult}
                    onChange={(e) => setadult(parseInt(e.target.value))}
                    className="border p-2 rounded-md"
                    required
                  >
                    <option disabled value="0">
                      Adults
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>

                  <select
                    value={children}
                    onChange={(e) => setchildren(parseInt(e.target.value))}
                    className="border p-2 rounded-md"
                  >
                    <option disabled value="">
                      Children
                    </option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    
                  </select>
                </div>

                <select
                  value={roomType}
                  onChange={(e) => setroomType(e.target.value)}
                  className="w-full border p-2 rounded-md"
                  required
                >
                  <option disabled value="">
                    Select Room Type
                  </option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                </select>

                {roomType && (
                  <div>
                    <label className="block mb-1 font-medium">
                      Select number of rooms
                    </label>
                    <select
                      value={noofrooms}
                      onChange={(e) => setnoofrooms(parseInt(e.target.value))}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option disabled value="0">
                        Rooms
                      </option>
                      {Array.from({ length: availableRooms.length }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <div className="text-sm text-gray-500 mt-2">
                      Available Rooms:{" "}
                      {availableRooms.map((r) => r.roomNo).join(", ")}
                    </div>
                  </div>
                )}

                <select
                  value={nationality}
                  onChange={(e) => setnationality(e.target.value)}
                  className="w-full border p-2 rounded-md"
                  required
                >
                  <option disabled value="">
                    Nationality
                  </option>
                  <option value="Resident">Resident</option>
                  <option value="Non-Resident">Non-Resident</option>
                </select>

                {errorMessage && (
                  <div className="text-red-600 text-sm text-center">
                    {errorMessage}
                  </div>
                )}

                {totalAmount > 0 && (
                  <div className="text-lg font-bold text-center mt-4">
                    Total Amount: Rs {totalAmount}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#d9232e] hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
                >
                  Book Now
                </button>
              </form>
            </>
          ) : (
            <div className="text-center text-red-500">
              <p>The Room/s is/are not available for the selected dates.</p>
            </div>
          )}
        </div>
      </div>
          
    </div>
  );
}

export default RoomBooking;
