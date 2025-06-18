import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GuestRegistration() {
  const navigate = useNavigate();
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [address, setaddress] = useState("");
  const [nic, setnic] = useState("");
  const [phonenum, setphonenum] = useState("");
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
    setphonenum(event.target.value);
  }
  function changeGender(event) {
    setgender(event.target.value);
  }

  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;

  const phoneRegex = /^\+94[1-9][0-9]{8}$/;
  const addressRegex = /^\d+\s[A-Za-z0-9\s,.#-]+$/;
  const nicRegex = /^(?:\d{9}[VX]|\d{12})$/; // Matches both old and new NIC formats

  function handleSubmit(event) {
    event.preventDefault();

    if (!fname || !lname || !address || !nic || !phonenum || !gender) {
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

    if (!phoneRegex.test(phonenum)) {
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
          phonenum,
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
    <div className="flex justify-center items-center my-3 bg-white">
      <form
        onSubmit={handleSubmit}
        className="text-gray-800 bg-gray-200 rounded-lg p-10 shadow-2xl w-full max-w-4xl"
      >
        <h1 className="text-4xl font-serif text-center text-black mb-8">
          Guest Registration Form
        </h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block font-medium text-black">First Name</label>
            <input
              type="text"
              name="fname"
              value={fname}
              onChange={changeFname}
              required
              placeholder="Eg: John"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-red-600">{fnameErrorMessage}</p>
          </div>
          <div className="mb-4">
            <label className="block font-medium text-black">Last Name</label>
            <input
              type="text"
              name="lname"
              value={lname}
              onChange={changeLname}
              required
              placeholder="Eg: Doe"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-red-600">{lnameErrorMessage}</p>
          </div>
          <div className="mb-4 col-span-2">
            <label className="block font-medium text-black">Address</label>
            <textarea
              name="address"
              value={address}
              onChange={changeAddress}
              required
              placeholder="Eg: 123 Main St, Colombo"
              rows="4"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-red-600">{addressErrorMessage}</p>
          </div>
          <div className="mb-4">
            <label className="block font-medium text-black">NIC Number</label>
            <input
              type="text"
              name="nic"
              value={nic}
              onChange={changeNIC}
              required
              placeholder="Eg: 912345678V or 200012345678"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black uppercase"
            />
            <p className="text-red-600">{nicErrorMessage}</p>
          </div>
          <div className="mb-4">
            <label className="block font-medium text-black">Phone Number</label>
            <input
              type="text"
              name="phonenum"
              value={phonenum}
              onChange={changePhoneNumber}
              required
              placeholder="Eg: +94712345678"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-red-600">{phonenumErrorMessage}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block font-medium text-black">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={changeGender}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other / Prefer not to say</option>
            </select>
            <p className="text-red-600">{genderErrorMessage}</p>
          </div>
        </div>
        <p className="text-red-600 text-center">{errorMessage}</p>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-500 transition-all mt-2 cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default GuestRegistration;
