import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import guestDetails from "../assets/images/guestdetails.jpg";

function AddEvent() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [eventName, setEventName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [eventNameError, setEventNameError] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const [costError, setCostError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const nameRegex = /^[A-Za-z0-9 ]{3,100}$/;
  const capacityRegex = /^[1-9][0-9]*$/;
  const costRegex = /^(1000|[1-9][0-9]{3,})(\.[0-9]{1,2})?$/;
  const descriptionRegex = /^.{10,500}$/;

  const getNextEventId = (eventList) => {
    const nums = eventList
      .map((e) => parseInt(e.eventId?.replace("E", ""), 10))
      .filter((n) => !isNaN(n));
    const max = nums.length > 0 ? Math.max(...nums) : 0;
    const nextNum = (max + 1).toString().padStart(3, "0");
    return `E${nextNum}`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/events/allevents"
        );
        const allEvents = Array.isArray(response.data.retdata)
          ? response.data.retdata
          : [];
        setEvents(allEvents);
        const nextId = getNextEventId(allEvents);
        setEventId(nextId);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
        setEventId("E001"); // fallback
      }
    };
    fetchEvents();
  }, []);

  const generateDescription = async () => {
    if (!eventName.trim()) {
      toast.error("Please enter an event name first.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/ai/generateeventdescription",
        { eventName }
      );
      setDescription(res.data.description);
    } catch (err) {
      console.error("AI Error:", err.response?.data || err.message);
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    let isValid = true;

    if (!nameRegex.test(eventName)) {
      setEventNameError("❌ Invalid Event Name! Must be 3-100 characters");
      isValid = false;
    } else setEventNameError("");

    if (!capacityRegex.test(capacity)) {
      setCapacityError("❌ Capacity must be a positive number");
      isValid = false;
    } else setCapacityError("");

    if (!costRegex.test(cost)) {
      setCostError(
        "❌ Invalid cost format! Enter the amount greater than 1000"
      );
      isValid = false;
    } else setCostError("");

    if (!descriptionRegex.test(description)) {
      setDescriptionError("❌ Description must be 10-500 characters long");
      isValid = false;
    } else setDescriptionError("");

    if (isValid) {
      axios
        .post("http://localhost:4000/api/events/addevent", {
          eventId,
          eventName,
          capacity,
          cost,
          description,
        })
        .then((response) => {
          if (response.data) {
            toast.success("Event Added successfully!");
            setTimeout(() => navigate("/addevent"), 2000);
          } else {
            toast.error("Event addition was unsuccessful!");
          }
        })
        .catch(() => {
          toast.error("Error adding event. Please try again.");
        });
    }
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
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#d9232e] p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create New Event
          </h1>
          <p className="text-white">
            Fill in the details below to add a new event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event ID (Read Only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Event ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={eventId}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Event Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {eventNameError && (
                <p className="text-sm text-red-600">{eventNameError}</p>
              )}
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Enter capacity"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {capacityError && (
                <p className="text-sm text-red-600">{capacityError}</p>
              )}
            </div>

            {/* Cost */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cost <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  Rs
                </span>
                <input
                  type="text"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              {costError && <p className="text-sm text-red-600">{costError}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={generateDescription}
                className="flex items-center text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 rounded-lg shadow-sm hover:from-blue-600 hover:to-indigo-600 transition-all"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Auto Generate
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter detailed event description..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {descriptionError && (
              <p className="text-sm text-red-600">{descriptionError}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#d9232e] text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
