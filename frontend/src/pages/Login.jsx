import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import auth from "../services/firebaseAuth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseAuth";
import RoleContext from "../components/RoleContext";
import adminBg from "../assets/images/admin-bg3.jpg";

function Login() {
  const navigate = useNavigate();

  const { setUserRole } = useContext(RoleContext);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 4000,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address.");
      return setIsLoading(false);
    }

    if (password === "") {
      showToast("Password cannot be empty.");
      return setIsLoading(false);
    }

    if (!passwordRegex.test(password)) {
      showToast(
        "Password must include uppercase, lowercase, number & special character (min 8 characters)."
      );
      return setIsLoading(false);
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        const docSnap = await getDoc(doc(db, "users", user.uid));
        const role = docSnap.data()?.role;

        localStorage.setItem("role", role);
        setUserRole(role);
        document.cookie = `email=${user.email}; path=/; max-age=86400`;
        localStorage.setItem("userEmail", email);

        showToast("Login successful!", "success");
        setTimeout(() => navigate("/home"), 2000);
      })

      .catch((error) => {
        console.log(error);
        const errorMap = {
          "auth/user-not-found": "No user found with this email.",
          "auth/wrong-password": "Incorrect password. Please try again.",
          "auth/invalid-credential": "Invalid email/password combination.",
        };
        showToast(errorMap[error.code] || "Login failed. Please try again.");
      })
      .finally(() => setIsLoading(false));
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

          {/* Login Card */}
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
                  Welcome Back
                </h1>
                <p className="text-white/90 text-sm sm:text-base mt-2">
                  Please login to continue
                </p>
              </motion.div>
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 space-y-5 sm:space-y-6"
            >
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
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

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d9232e] focus:border-transparent transition duration-200"
                    placeholder="••••••••"
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Must include: uppercase, lowercase, number, special character
                  (min 8 chars)
                </p>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 shadow-lg cursor-pointer ${
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
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative py-4"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </motion.div>

              {/* Action Links */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-between gap-3 text-center"
              >
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-[#d9232e] font-medium hover:text-[#c11e28] text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-[#d9232e] focus:ring-offset-2 rounded px-2 py-1 transition duration-200"
                >
                  Create new account
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/forgotPassword")}
                  className="text-[#d9232e] font-medium hover:text-[#c11e28] text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-[#d9232e] focus:ring-offset-2 rounded px-2 py-1 transition duration-200"
                >
                  Forgot password?
                </button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="px-6 sm:px-8 pb-6 text-center"
            >
              <p className="text-xs text-gray-500">
                By logging in, you agree to our{" "}
                <a href="#" className="text-[#d9232e] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#d9232e] hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
}

export default Login;
