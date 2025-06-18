import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ViewDetails = () => {
  const { id } = useParams();
  const [guest, setGuest] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/guests/viewguest/${id}`
      );
      if (response.data.success) {
        setGuest(response.data.guest);
      } else {
        toast.error(response.data.message || "Failed to load guest data");
      }
    } catch (error) {
      console.error("Error fetching guest data:", error);
      toast.error("An error occurred while fetching guest data");
    }
  };

  useEffect(() => {
    if (!guest) return;

    const speakGuestDetails = () => {
      const synth = window.speechSynthesis;

      const details = `
        Guest Details.
        First Name: ${guest.fname}. 
        Phone Number: ${guest.phoneNumber.split("").join(" ")}.
        Address: ${guest.address}.
      `;

      const utterance = new SpeechSynthesisUtterance(details);

      const voices = synth.getVoices();
      const femaleVoice = voices.find(
        (voice) => voice.lang === "en-US" && voice.name.includes("Female")
      );

      utterance.voice =
        femaleVoice || voices.find((v) => v.name.includes("Female"));
      utterance.lang = "en-US";

      synth.speak(utterance);
    };

    const timer = setTimeout(speakGuestDetails, 500);

    return () => clearTimeout(timer);
  }, [guest]);

  if (!guest)
    return <p className="text-center text-lg text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-white py-12 px-4 m-2 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 bg-[#F26B38] rounded-md p-4">
          <h1 className="text-4xl font-extrabold text-[#FFF5E1] tracking-tight sm:text-5xl mb-3">
            Guest Profile
          </h1>
          <p className="text-xl text-[#FFF5E1]">
            Detailed information about the guest
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#f2c84b] p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold text-[#4b2e2e]">
                  {guest.fname.charAt(0)}
                  {guest.lname.charAt(0)}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-[#4b2e2e]">
                  {guest.fname} {guest.lname}
                </h2>
                <p className="text-[#4b2e2e]">{guest.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {guest.fname} {guest.lname}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          guest.gender === "Male"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {guest.gender}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      NIC Number
                    </p>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {guest.nic}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Email Address
                    </p>
                    <p className="mt-1 text-lg font-medium text-blue-600">
                      <a
                        href={`mailto:${guest.email}`}
                        className="hover:underline"
                      >
                        {guest.email}
                      </a>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Phone Number
                    </p>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      <a
                        href={`tel:${guest.phoneNumber}`}
                        className="hover:text-blue-600"
                      >
                        {guest.phoneNumber}
                      </a>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {guest.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/guestlist"
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Guest List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
