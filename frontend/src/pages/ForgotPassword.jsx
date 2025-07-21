import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import adminBg from "../assets/images/admin-bg3.jpg";

const ForgotPassword = () => {
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
      <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <header className="fixed top-0 left-0 w-full bg-[#d9232e] shadow-lg z-50 py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center border-b border-white/20">
          <div className="mx-auto w-full max-w-7xl flex justify-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center tracking-tight">
              Welcome to Anuthama Villa
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center relative pt-16">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${adminBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>

          {/* Password Reset Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-md sm:max-w-lg md:max-w-xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden z-10 mx-4 my-8"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#d9232e] to-[#c11e28] p-6 sm:p-8 text-center">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Reset Your Password
                </h1>
                <p className="text-white/90 text-sm sm:text-base mt-2">
                  We'll send you a link to reset your password
                </p>
              </motion.div>
            </div>

            {/* Reset Form */}
            <form onSubmit={handleReset} className="p-6 sm:p-8 space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d9232e] focus:border-transparent transition duration-200"
                    placeholder="your@email.com"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 shadow-lg ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#d9232e] hover:bg-[#c11e28] focus:ring-2 focus:ring-[#d9232e] focus:ring-offset-2"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
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
                          d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </motion.div>

              {/* Help Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <p className="text-xs text-gray-500">
                  Enter your registered email to receive a password reset link.
                </p>
              </motion.div>

              {/* Back to Login */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center pt-4"
              >
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="text-[#d9232e] font-medium hover:text-[#c11e28] text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-[#d9232e] focus:ring-offset-2 rounded px-2 py-1 transition duration-200"
                >
                  Back to Login
                </button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-6 sm:px-8 pb-6 text-center"
            >
              <p className="text-xs text-gray-500">
                Need help? Contact our{" "}
                <a href="mailto:support@anuthamavilla.com" className="text-[#d9232e] hover:underline">
                  support team
                </a>
              </p>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default ForgotPassword;