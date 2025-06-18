import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const [success, setSuccess] = useState(0);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[A-Z](?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

  function handleSubmit(event) {
    event.preventDefault();
    setSuccess(0);
    setErrorMessage("");
    setEmailErrorMessage("");
    setPasswordErrorMessage("");
    setConfirmPasswordErrorMessage("");

    if (!email.trim() || !password.trim() || !confirmpassword.trim()) {
      setErrorMessage("One of the fields is missing");
      return;
    }

    let validationSuccess = 0;

    if (emailRegex.test(email)) {
      validationSuccess++;
    } else {
      setEmailErrorMessage("❌ Invalid email address!");
    }

    if (passwordRegex.test(password)) {
      validationSuccess++;
    } else {
      setPasswordErrorMessage(
        "❌ Password must be at least 8 characters, start with a capital letter, include at least one number and one special character."
      );
    }

    if (password === confirmpassword) {
      validationSuccess++;
    } else {
      setConfirmPasswordErrorMessage(
        "❌ Password and Confirm Password do not match"
      );
    }

    if (validationSuccess === 3) {
      axios
        .post("http://localhost:4000/api/guests/signup", { email, password })
        .then((data) => {
          if (data.data === true) {
            navigate("/login");
          } else {
            setErrorMessage("Signup failed. Please try again.");
          }
        })
        .catch(() => {
          setErrorMessage("An error occurred. Please try again.");
        });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h1>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errorMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {emailErrorMessage && (
              <p className="text-red-500 text-sm">{emailErrorMessage}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordErrorMessage && (
              <p className="text-red-500 text-sm">{passwordErrorMessage}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-Enter Your Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {confirmPasswordErrorMessage && (
              <p className="text-red-500 text-sm">
                {confirmPasswordErrorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 cursor-pointer"
          >
            SignUp
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">Already Registered?</p>
          <Link
            to="/login"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Click Here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
