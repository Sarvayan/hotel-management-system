import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, ArrowRight } from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [email, setemail] = useState("");
  const [errorMessage, seterrorMessage] = useState(" ");
  const [emailErrorMessage, setEmailErrorMessage] = useState(" ");

  function getEmail(event) {
    setemail(event.target.value); // Ensure 'event' is properly passed here
  }

  function handleSubmit() {
    if (email.trim() === "") {
      seterrorMessage("One of the fields is missing");
    } else {
      if (!emailRegex.test(email)) {
        setEmailErrorMessage("❌ Invalid email address!");
      }
    }

    if (emailRegex.test(email)) {
      axios
        .post(
          "http://localhost:4000/api/guests/otp",
          { email: email },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data === true) {
            console.log("Successful");
            navigate("/otp");
          } else {
            console.log("Failed");
            seterrorMessage(
              "Incorrect email address. Please check your entered email address"
            );
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
          seterrorMessage("An error occurred. Please try again.");
        });
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1497294815431-9365093b7331?q=80&w=2070')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Forgot Password Container */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-200">
            Enter your email address and we'll help you reset your password
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                className={`w-full pl-10 pr-4 py-2 bg-white/5 border ${
                  emailErrorMessage ? "border-red-500/50" : "border-white/10"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {emailErrorMessage && (
              <p className="mt-1 text-sm text-red-200">{emailErrorMessage}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Reset Password
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm text-blue-300 hover:text-blue-400 transition-colors duration-200"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
