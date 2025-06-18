import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import guestDetails from "../assets/images/guestdetails.jpg";

function UpdateEvent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const eventData = state?.eventData || {};

  const [eventId, setEventId] = useState(eventData.eventNo || "");
  const [eventName, setEventName] = useState(eventData.eventType || "");
  const [capacity, setCapacity] = useState(eventData.capacity || "");
  const [cost, setCost] = useState(eventData.cost || "");
  const [description, setDescription] = useState(eventData.description || "");

  const [errorMessage, setErrorMessage] = useState("");
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [capacityErrorMessage, setCapacityErrorMessage] = useState("");
  const [costErrorMessage, setCostErrorMessage] = useState("");
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const [success, setSuccess] = useState(0);

  function changeEventName(event) {
    setEventName(event.target.value);
  }

  function changeCapacity(event) {
    setCapacity(event.target.value);
  }

  function changeCost(event) {
    setCost(event.target.value);
  }

  function changeDescription(event) {
    setDescription(event.target.value);
  }

  function handleSubmitUpdate(event) {
    event.preventDefault();

    if (
      eventName.trim() === "" ||
      capacity.trim() === "" ||
      String(cost).trim() === "" ||
      description.trim() === ""
    ) {
      setErrorMessage("One of the fields is missing");
      return;
    }

    if (!/^[A-Za-z0-9 ]{2,50}$/.test(eventName)) {
      setNameErrorMessage(
        "❌ Invalid event name. Use 2-50 alphanumeric characters"
      );
      setSuccess(0);
      return;
    } else {
      setNameErrorMessage(" ");
      setSuccess(success + 1);
    }

    if (!/^[1-9]\d*$/.test(capacity)) {
      setCapacityErrorMessage("❌ Invalid capacity. Enter a positive number");
      setSuccess(0);
      return;
    } else {
      setCapacityErrorMessage(" ");
      setSuccess(success + 1);
    }

    if (!/^[1-9]\d*(\.\d{1,2})?$/.test(cost)) {
      setCostErrorMessage("❌ Invalid cost. Enter a valid number");
      setSuccess(0);
      return;
    } else {
      setCostErrorMessage(" ");
      setSuccess(success + 1);
    }

    if (description.trim().length < 10) {
      setDescriptionErrorMessage(
        "❌ Description should be at least 10 characters long"
      );
      setSuccess(0);
      return;
    } else {
      setDescriptionErrorMessage(" ");
      setSuccess(success + 1);
    }

    if (success === 4) {
      console.log(eventId);
      axios
        .put(`http://localhost:4000/api/events/updateevent/${eventId}`, {
          eventId,
          eventName,
          capacity,
          cost,
          description,
        })
        .then((data) => {
          if (data.data) {
            toast.success("Event updated successfully!");
            navigate("/manageevent");
          }
        })
        .catch((err) => {
          toast.error("Failed to update event. Try again.");
          console.error(err);
        });
    }
  }

  function handleSubmitDelete() {
    axios
      .delete(`http://localhost:4000/api/events/deleteevent/${eventId}`)
      .then((data) => {
        if (data.data) {
          toast.success("Event deleted successfully!");
          navigate("/manageevent");
        }
      })
      .catch((err) => {
        toast.error("Failed to delete event. Try again.");
        console.error(err);
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
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
      />

      {eventData && Object.keys(eventData).length > 0 ? (
        <form
          onSubmit={handleSubmitUpdate}
          className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="bg-[#d9232e] p-6 text-white">
            <h1 className="text-2xl font-bold text-center">
              Update Event Details
            </h1>
            <p className="text-center text-white mt-1">
              Modify the event information as needed
            </p>
          </div>

          <div className="p-6 space-y-5">
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Event ID
              </label>
              <input
                type="text"
                value={eventData.eventNo}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Event Name
              </label>
              <input
                type="text"
                placeholder="Enter Event Name"
                onChange={changeEventName}
                value={eventName}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none"
              />
              {nameErrorMessage && (
                <p className="text-sm text-red-600">{nameErrorMessage}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="text"
                placeholder="Enter Capacity"
                onChange={changeCapacity}
                value={capacity}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {capacityErrorMessage && (
                <p className="text-sm text-red-600">{capacityErrorMessage}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Cost
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">Rs</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Cost"
                  onChange={changeCost}
                  value={cost}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {costErrorMessage && (
                <p className="text-sm text-red-600">{costErrorMessage}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Enter Description"
                onChange={changeDescription}
                value={description}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {descriptionErrorMessage && (
                <p className="text-sm text-red-600">
                  {descriptionErrorMessage}
                </p>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-sm hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
              >
                Update Event
              </button>
              <button
                type="button"
                onClick={handleSubmitDelete}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-sm hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all cursor-pointer"
              >
                Delete Event
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
            <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      )}
    </div>
  );
}
export default UpdateEvent;
