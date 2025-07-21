import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { motion as Motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const OTP = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 4000,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setIsLoading(true);

    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address.");
      return setIsLoading(false);
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset link sent to your email.", "success");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        showToast("No user found with this email.");
      } else if (error.code === "auth/invalid-email") {
        showToast("Invalid email address.");
      } else {
        showToast("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-[url('/bg.jpg')] bg-cover bg-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
        >
          <Motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Reset Password
            </h2>
            <p className="text-green-100 text-sm sm:text-base mt-1">
              We'll help you recover access
            </p>
          </Motion.div>

          <form
            onSubmit={handleReset}
            className="p-6 sm:p-8 space-y-4 sm:space-y-6"
          >
            <Motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                placeholder="your@email.com"
                required
              />
            </Motion.div>

            <Motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium sm:font-semibold text-white transition duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 cursor-pointer"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center text-sm sm:text-base">
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </Motion.button>
          </form>

          <Motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-center text-gray-400 mb-4 sm:mb-6 px-4 sm:px-6"
          >
            Enter your registered email to receive a password reset link.
          </Motion.p>
        </Motion.div>
      </div>
    </>
  );
};

export default OTP;
