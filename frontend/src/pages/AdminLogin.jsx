import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import RoleContext from "../components/RoleContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GalleryBackground from "../components/Gallery";

const AdminLogin = () => {
  useEffect(() => {
    const speakNotification = () => {
      const synth = window.speechSynthesis;
      if (!synth) return;

      let voices = synth.getVoices();

      const speak = () => {
        const message = new SpeechSynthesisUtterance(
          "Administrator login. Please verify your credentials."
        );
        const femaleVoice = voices.find(
          (voice) => voice.lang === "en-US" && voice.name.includes("Female")
        );
        message.voice =
          femaleVoice || voices.find((v) => v.name.includes("Female"));
        message.lang = "en-US";
        message.rate = 0.9;
        synth.speak(message);
      };

      if (voices.length === 0) {
        synth.onvoiceschanged = () => {
          voices = synth.getVoices();
          speak();
        };
      } else {
        speak();
      }
    };

    const timer = setTimeout(speakNotification, 1000);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();
  const { setUserRole } = useContext(RoleContext);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceRecognitionActive, setIsVoiceRecognitionActive] =
    useState(false);

  const handleLogin = async (inputPassword) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/admin/login",
        { password: inputPassword }
      );

      if (response.data.success) {
        toast.success("Authentication successful. Redirecting...", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
        });
        const { role } = response.data.user;

        localStorage.setItem("role", role);
        setUserRole(role);

        setTimeout(() => {
          navigate("/adminhome");
        }, 1500);
      } else {
        toast.error("Invalid credentials. Please try again.", {
          position: "top-center",
        });
      }
    } catch (error) {
      setErrorMessage("Authentication failed. Please verify your credentials.");
      toast.error("Login attempt failed", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!password.trim()) {
      setErrorMessage("Security credential required");
      toast.warning("Please enter your password", {
        position: "top-center",
      });
      return;
    }

    handleLogin(password);
  };

  const handleVoiceLogin = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        "Browser compatibility issue: Voice recognition not supported",
        {
          position: "top-center",
        }
      );
      return;
    }

    setIsVoiceRecognitionActive(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    toast.info("Listening for voice command...", {
      position: "top-center",
      autoClose: 3000,
    });

    recognition.start();

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.trim();
      toast.success(`Voice input detected: "${spoken}"`, {
        position: "top-center",
        autoClose: 2000,
      });
      setPassword(spoken);
      handleLogin(spoken);
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      toast.error(`Voice recognition error: ${event.error}`, {
        position: "top-center",
      });
      setIsVoiceRecognitionActive(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      setIsVoiceRecognitionActive(false);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-red-700 to-red-600 shadow-lg z-50 p-4 md:p-6 flex justify-between items-center border-b border-white/10">
        <div className="w-full max-w-7xl mx-auto px-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center tracking-tight">
            Welcome to Anuthama Villa Administration
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Background Gallery with Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <GalleryBackground />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-red-700 to-red-600 p-6 text-center rounded-t-xl shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Administrator Portal
            </h1>
            <p className="text-white/90 text-sm mt-2">
              Secure access to management dashboard
            </p>
          </div>

          {/* Card Body */}
          <div className="bg-white p-6 sm:p-8 rounded-b-xl shadow-lg">
            {errorMessage && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fade-in">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Credential
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter administrator password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-700"
                    autoComplete="current-password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:brightness-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Authenticate
                    </>
                  )}
                </button>

                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-500 text-sm">
                    OR
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  type="button"
                  onClick={handleVoiceLogin}
                  disabled={isVoiceRecognitionActive}
                  className={`w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold text-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                    isVoiceRecognitionActive
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isVoiceRecognitionActive ? (
                    <>
                      <svg
                        className="animate-pulse h-5 w-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                      Listening...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                      Voice Authentication
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                For security reasons, please ensure you're in a private location
                when entering credentials.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm border-t border-gray-200 py-3 z-40">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Anuthama Villa. All rights reserved.
            Unauthorized access prohibited.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
