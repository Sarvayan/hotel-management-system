import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import RoleContext from "../components/RoleContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const { setUserRole } = useContext(RoleContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [role, setRole] = useState(" ");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[A-Z][A-Za-z\d@$!%*?&]{7,}$/;

  const changeEmail = (event) => setEmail(event.target.value);
  const changePassword = (event) => setPassword(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setEmailErrorMessage("");
    setPasswordErrorMessage("");
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("❌ One of the fields is missing!");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailErrorMessage("❌ Invalid email address!");
    }
    if (!passwordRegex.test(password)) {
      setPasswordErrorMessage(
        "❌ Password must be at least 8 characters and start with an uppercase letter."
      );
    }

    if (emailRegex.test(email) && passwordRegex.test(password)) {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/guests/login",
          { email, password },
          { withCredentials: true }
        );

        if (response.data.success) {
          console.log("Login successful");
          toast.success("Login Successful!");
          const { role } = response.data.user;

          localStorage.setItem("role", role);
          setUserRole(role);
          setRole(role);

          console.log("Role set to:", role);
          console.log(localStorage.getItem("role"));

          /* if (role === "User") {
            navigate("/home");
          } else if (role === "Admin") {
            navigate("/home");
          } else {
            toast.error("Role is undefined !");
            setTimeout(() => navigate("/login"), 2000);
          } */
          setTimeout(() => {
            navigate("/home");
          }, 100);
        } else {
          console.log("Login failed or no data found");
          toast.error("Login Failed!");
        }
      } catch (error) {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
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
              onChange={changeEmail}
              value={email}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              onChange={changePassword}
              value={password}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {passwordErrorMessage && (
              <p className="text-red-500 text-sm">{passwordErrorMessage}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 cursor-pointer"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <Link
            to="/forgotpassword"
            className="text-indigo-500 hover:underline cursor-pointer"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
