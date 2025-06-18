import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProfileUpdate() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user || {};

  const [fname, setfname] = useState(user.fname || "");
  const [lname, setlname] = useState(user.lname || "");
  const [address, setaddress] = useState(user.address || "");
  const [phonenum, setphonenum] = useState(user.phoneNumber || "");
  const [gender, setgender] = useState(user.gender || "");

  const [errorMessage, seterrorMessage] = useState("");
  const [success, setsuccess] = useState(0);

  const nameRegex = /^[A-Za-z]{2,50}$/;
  const phoneRegex = /^\+94[1-9][0-9]{8}$/;

  const changeFname = (event) => setfname(event.target.value);
  const changeLname = (event) => setlname(event.target.value);
  const changeAddress = (event) => setaddress(event.target.value);
  const changePhoneNumber = (event) => setphonenum(event.target.value);
  const changeGender = (event) => setgender(event.target.value);

  function handleSubmit(event) {
    event.preventDefault();

    if (
      fname.trim() === "" ||
      lname.trim() === "" ||
      address.trim() === "" ||
      phonenum.trim() === ""
    ) {
      seterrorMessage("One of the fields is missing");
    } else {
      let valid = true;

      if (!nameRegex.test(fname)) {
        valid = false;
        seterrorMessage("❌ Invalid First Name!");
      }
      if (!nameRegex.test(lname)) {
        valid = false;
        seterrorMessage("❌ Invalid Last Name!");
      }
      if (!phoneRegex.test(phonenum)) {
        valid = false;
        seterrorMessage(
          "❌ Invalid phone number. It should start with +94 and have 9 digits"
        );
      }
      if (gender.trim() === "") {
        valid = false;
        seterrorMessage(
          "❌ Invalid Gender Type. Please select a valid Gender type"
        );
      }

      if (valid) {
        axios
          .put(
            "http://localhost:4000/api/guests/updateguest",
            {
              fname,
              lname,
              address,
              phonenum,
              gender,
            },
            { withCredentials: true }
          )
          .then((response) => {
            if (response.data === true) {
              toast.success("Profile Updated Successfully !");
              setTimeout(() => navigate("/guestdashboard"), 2000);
            } else {
              toast.error(response.data || "Updation Failed.");
            }
          })
          .catch((error) => {
            toast.error("Error Updating Profile:", error);
          });
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#d9232e] py-5 px-6">
          <h1 className="text-2xl font-bold text-white text-center">
            Update Profile
          </h1>
        </div>
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            {errorMessage && (
              <p className="text-red-600 text-center">{errorMessage}</p>
            )}

            <label className="block text-black font-medium">First Name</label>
            <input
              type="text"
              value={fname}
              placeholder="Enter Your First Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none mt-1"
              onChange={changeFname}
            />

            <label className="block text-black font-medium mt-3">
              Last Name
            </label>
            <input
              type="text"
              value={lname}
              placeholder="Enter Your Last Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none mt-1"
              onChange={changeLname}
            />

            <label className="block text-black font-medium mt-3">Address</label>
            <input
              type="text"
              value={address}
              placeholder="Enter Your Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none mt-1"
              onChange={changeAddress}
            />

            <label className="block text-black font-medium mt-3">
              Phone Number
            </label>
            <input
              type="text"
              value={phonenum}
              placeholder="Enter Your Phone Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none mt-1"
              onChange={changePhoneNumber}
            />

            <label className="block text-black font-medium mt-3">Gender</label>
            <select
              value={gender}
              onChange={changeGender}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none mt-1"
            >
              <option value="Default" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <button
              type="submit"
              className="w-full bg-[#d9232e] hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdate;
