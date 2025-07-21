import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminBg from "../assets/images/admin-bg3.jpg";

function AddFeedback() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [feedbackType, setFeedbackType] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    feedbackType: "",
    comment: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/guests/dashboard", {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      feedbackType: "",
      comment: "",
    };

    if (!feedbackType) {
      newErrors.feedbackType = "Please select a feedback type";
      isValid = false;
    }

    if (!comment.trim()) {
      newErrors.comment = "Comment is required";
      isValid = false;
    } else if (comment.length < 5 || comment.length > 200) {
      newErrors.comment = "Comment must be between 5-200 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/feedback/addfeedback",
        {
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          feedbacktype: feedbackType,
          comment: comment,
        },
        { withCredentials: true }
      );

      if (response.data === true) {
        toast.success("Feedback submitted successfully!", {
          position: "top-center",
          autoClose: 2000,
          className: "toast-success",
        });
        navigate("/guestdashboard");
      } else {
        toast.error(response.data || "Failed to submit feedback", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast.error("Error submitting feedback. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative background */}
      <div
        className="absolute inset-0 w-full h-full opacity-10 z-0"
        style={{
          backgroundImage: `url(${adminBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Share Your <span className="text-[#d9232e]">Feedback</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-600">
            We value your opinion to help us improve our services
          </p>
        </div>

        {/* Main form container */}
        {user.email && (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            {/* Form header */}
            <div className="bg-gradient-to-r from-[#d9232e] to-[#a51c24] py-5 px-6">
              <h1 className="text-xl font-bold text-white">Feedback Form</h1>
            </div>

            {/* Form content */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* User info section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user.fname || ""}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9232e] focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user.lname || ""}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9232e] focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email || ""}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d9232e] focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Feedback type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    errors.feedbackType ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#d9232e] focus:border-transparent appearance-none cursor-pointer`}
                >
                  <option value="" disabled>
                    Select feedback type
                  </option>
                  <option value="Room&Amenities">Room and Amenities</option>
                  <option value="Event&Amenities">Event and Amenities</option>
                  <option value="Food&Dining">Food and Dining</option>
                  <option value="RoomService">Room Service</option>
                </select>
                {errors.feedbackType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.feedbackType}
                  </p>
                )}
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your detailed feedback here (5-200 characters)"
                  rows="5"
                  className={`w-full px-4 py-3 border ${
                    errors.comment ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#d9232e] focus:border-transparent`}
                ></textarea>
                <div className="flex justify-between items-center mt-1">
                  {errors.comment ? (
                    <p className="text-sm text-red-600">{errors.comment}</p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {comment.length}/200 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-[#d9232e] hover:bg-[#b51d26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d9232e] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddFeedback;
