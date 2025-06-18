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
      let voices = synth.getVoices();

      const speak = () => {
        const message = new SpeechSynthesisUtterance("Hey, Who are you?");
        const femaleVoice = voices.find(
          (voice) => voice.lang === "en-US" && voice.name.includes("Female")
        );
        message.voice =
          femaleVoice || voices.find((v) => v.name.includes("Female"));
        message.lang = "en-US";
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

    setTimeout(speakNotification, 500);
  }, []);

  const navigate = useNavigate();
  const { setUserRole } = useContext(RoleContext);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const changePassword = (event) => setPassword(event.target.value);

  const handleLogin = async (inputPassword) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/admin/login",
        { password: inputPassword }
      );

      if (response.data.success) {
        toast.success("Login Successful!");
        const { role } = response.data.user;

        localStorage.setItem("role", role);
        setUserRole(role);

        setTimeout(() => {
          navigate("/adminhome");
        }, 100);
      } else {
        toast.error("Login Failed!");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!password.trim()) {
      setErrorMessage("Password is missing!");
      return;
    }

    handleLogin(password);
  };

  const handleVoiceLogin = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.trim().replace(/\s+/g, "");
      toast.info(`Heard: "${spoken}"`);
      handleLogin(spoken);
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      toast.error("Voice recognition error: " + event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full rounded-md bg-[#d9232e] shadow-xl z-50 p-9 flex justify-between items-center border-b border-white/10">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-bold text-white text-center">
            Welcome to Anuthama Villa !
          </h1>
        </div>
      </div>
      <div className="relative min-h-screen flex items-center justify-center p-8">
        <GalleryBackground />

        <div className="z-10 bg-white rounded-xl p-8 max-w-md w-full mt-15">
          <div className="bg-[#d9232e] p-6 text-center rounded-md">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Secure access to villa management
            </p>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {errorMessage && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm font-medium">
                  {errorMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9232e]/50 focus:border-transparent transition-all duration-200 placeholder-gray-400"
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
                  className="w-full bg-[#d9232e] text-white py-3 px-4 rounded-lg font-semibold text-lg hover:brightness-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d9232e]/50 focus:ring-offset-2 transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
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
                  Login
                </button>

                <button
                  type="button"
                  onClick={handleVoiceLogin}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold text-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 text-[#d9232e]"
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
                  Voice Login
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/forgotpassword"
                className="text-sm font-medium text-[#d9232e] hover:text-[#b51d28] hover:underline transition-colors duration-200 inline-flex items-center"
              >
                Forgot your password?
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
