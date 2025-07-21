import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminBg from "../assets/images/admin-bg3.jpg";

function GuestRegistration() {
  const navigate = useNavigate();
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [address, setaddress] = useState("");
  const [nic, setnic] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setgender] = useState("");
  const [errorMessage, seterrorMessage] = useState("");
  const [fnameErrorMessage, setFnameErrorMessage] = useState("");
  const [lnameErrorMessage, setLnameErrorMessage] = useState("");
  const [addressErrorMessage, setAddressErrorMessage] = useState("");
  const [nicErrorMessage, setNicErrorMessage] = useState("");
  const [phonenumErrorMessage, setPhonenumErrorMessage] = useState("");
  const [genderErrorMessage, setGenderErrorMessage] = useState("");

  function changeFname(event) {
    setfname(event.target.value);
  }
  function changeLname(event) {
    setlname(event.target.value);
  }
  function changeAddress(event) {
    setaddress(event.target.value);
  }
  function changeNIC(event) {
    setnic(event.target.value.toUpperCase());
  }
  function changePhoneNumber(event) {
    setPhoneNumber(event.target.value);
  }
  function changeGender(event) {
    setgender(event.target.value);
  }

  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
  const phoneRegex = /^\+94[1-9][0-9]{8}$/;
  const addressRegex = /^\d+\s[A-Za-z0-9\s,.#-]+$/;
  const nicRegex = /^(?:\d{9}[VX]|\d{12})$/;

  function handleSubmit(event) {
    event.preventDefault();

    if (!fname || !lname || !address || !nic || !phoneNumber || !gender) {
      seterrorMessage("One of the fields is missing");
      return;
    }

    if (!nameRegex.test(fname)) {
      setFnameErrorMessage("❌ Invalid First Name!");
      return;
    }
    setFnameErrorMessage("");

    if (!nameRegex.test(lname)) {
      setLnameErrorMessage("❌ Invalid Last Name!");
      return;
    }
    setLnameErrorMessage("");

    if (!addressRegex.test(address)) {
      setAddressErrorMessage("❌ Invalid Address format!");
      return;
    }
    setAddressErrorMessage("");

    if (!nicRegex.test(nic)) {
      setNicErrorMessage("❌ Invalid NIC. Use 9 digits + 'V/X' or 12 digits.");
      return;
    }
    setNicErrorMessage("");

    if (!phoneRegex.test(phoneNumber)) {
      setPhonenumErrorMessage(
        "❌ Invalid phone number. Use +94XXXXXXXXX format."
      );
      return;
    }
    setPhonenumErrorMessage("");

    if (gender.trim() === "") {
      setGenderErrorMessage(
        "❌ Invalid Gender Type. Please select a valid Gender type."
      );
      return;
    }
    setGenderErrorMessage("");

    axios
      .post(
        "http://localhost:4000/api/guests/registration",
        {
          fname,
          lname,
          address,
          nic,
          phoneNumber,
          gender,
        },
        { withCredentials: true }
      )
      .then((data) => {
        console.log(data.data);
        if (data.data === true) {
          toast.success("You Registered Successfully!", {
            autoClose: 2000,
            position: "top-right",
          });
          setTimeout(() => {
            navigate("/roombooking", { state: { status: true } });
          }, 2000);
        } else {
          toast.error(data.data);
        }
      });
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Background image */}
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
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left decorative panel - visible on medium screens and up */}
            <div className=" md:block md:w-1/3 bg-[#d9232e] p-8 flex flex-col justify-center">
              <div className="text-white">
                <h1 className="text-2xl font-bold mb-4">
                  Welcome to Our Villa
                </h1>
                <p className="mb-6 text-white">
                  Complete your guest registration to enjoy our premium services
                  and amenities.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-green-400 rounded-full p-2 mr-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>Fast and secure registration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-400 rounded-full p-2 mr-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>Personalized service</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-400 rounded-full p-2 mr-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form panel */}
            <div className="w-full md:w-2/3 p-6 sm:p-8 lg:p-10 bg-white bg-opacity-90">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Guest Registration
                </h1>
                <p className="text-gray-600">
                  Please fill in your details to complete registration
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="fname"
                      value={fname}
                      onChange={changeFname}
                      required
                      placeholder="Eg: John"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-transparent transition-all duration-200"
                    />
                    <p className="mt-1 text-sm text-red-600 h-5">
                      {fnameErrorMessage}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lname"
                      value={lname}
                      onChange={changeLname}
                      required
                      placeholder="Eg: Doe"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-transparent transition-all duration-200"
                    />
                    <p className="mt-1 text-sm text-red-600 h-5">
                      {lnameErrorMessage}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={address}
                    onChange={changeAddress}
                    required
                    placeholder="Eg: 123 Main St, Colombo"
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300  focus:border-transparent transition-all duration-200"
                  />
                  <p className="mt-1 text-sm text-red-600 h-5">
                    {addressErrorMessage}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIC Number
                    </label>
                    <input
                      type="text"
                      name="nic"
                      value={nic}
                      onChange={changeNIC}
                      required
                      placeholder="Eg: 912345678V or 200012345678"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300  focus:border-transparent transition-all duration-200 uppercase"
                    />
                    <p className="mt-1 text-sm text-red-600 h-5">
                      {nicErrorMessage}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phonenum"
                      value={phoneNumber}
                      onChange={changePhoneNumber}
                      required
                      placeholder="Eg: +94712345678"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300  focus:border-transparent transition-all duration-200"
                    />
                    <p className="mt-1 text-sm text-red-600 h-5">
                      {phonenumErrorMessage}
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={changeGender}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-transparent transition-all duration-200"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Prefer not to say</option>
                  </select>
                  <p className="mt-1 text-sm text-red-600 h-5">
                    {genderErrorMessage}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-red-600 h-5">{errorMessage}</p>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#d9232e] hover:bg-[#b51d27] text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d9232e] shadow-md transition-all duration-200 transform hover:scale-[1.01] cursor-pointer"
                  >
                    Register Now
                    <svg
                      className="w-4 h-4 ml-2 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default GuestRegistration;
