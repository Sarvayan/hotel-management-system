import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Filter } from "bad-words";
import { toast } from "react-toastify";
import adminBg from "../assets/images/admin-bg3.jpg";

function AddReview() {
  const [user, setUser] = useState({});
  const [starCount, setStarCount] = useState(0);
  const [hoverStar, setHoverStar] = useState(null);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({
    comment: "",
    rating: "",
    type: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
  const filter = new Filter();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/guests/dashboard", {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data);
        setShow(true);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  }, []);

  const emojiFeedback = {
    1: { emoji: "😡", text: "Very Bad", color: "text-red-500" },
    2: { emoji: "😞", text: "Bad", color: "text-orange-500" },
    3: { emoji: "😐", text: "Average", color: "text-yellow-500" },
    4: { emoji: "😊", text: "Good", color: "text-lime-500" },
    5: { emoji: "🤩", text: "Excellent", color: "text-green-500" },
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      comment: "",
      rating: "",
      type: ""
    };

    if (!starCount) {
      newErrors.rating = "Please select a rating";
      isValid = false;
    }

    if (!comment.trim()) {
      newErrors.comment = "Comment is required";
      isValid = false;
    } else if (!/^[A-Za-z0-9\s.,!?'-]{5,200}$/.test(comment)) {
      newErrors.comment = "Comment must be 5-200 characters long";
      isValid = false;
    } else if (filter.isProfane(comment)) {
      newErrors.comment = "Comment contains inappropriate language";
      isValid = false;
    }

    if (!selectedType) {
      newErrors.type = "Please select a booking type";
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
        "http://localhost:4000/api/review/addreview",
        {
          name: user.fname,
          address: user.address,
          star: starCount,
          type: selectedType,
          comment: comment,
          reviewDate: new Date().toISOString(),
        },
        { withCredentials: true }
      );

      if (response.data === true) {
        toast.success("Review submitted successfully!", {
          position: "top-center",
          autoClose: 2000,
          className: "toast-success",
        });
        navigate("/guestdashboard");
      } else {
        toast.error(response.data || "Failed to submit review", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Error submitting review. Please try again.", {
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
            Share Your <span className="text-[#d9232e]">Experience</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-600">
            Your feedback helps us improve our services
          </p>
        </div>

        {/* Main form container */}
        {show && (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            {/* Form header */}
            <div className="bg-gradient-to-r from-[#d9232e] to-[#a51c24] py-5 px-6">
              <h1 className="text-xl font-bold text-white">
                Review Form
              </h1>
            </div>

            {/* Form content */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* User info section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user.fname || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg  focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user.address || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg  focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-center space-x-2">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setStarCount(ratingValue)}
                        onMouseEnter={() => setHoverStar(ratingValue)}
                        onMouseLeave={() => setHoverStar(null)}
                        className="text-3xl transition-transform duration-100 hover:scale-110 focus:outline-none"
                      >
                        <FontAwesomeIcon
                          icon={faStar}
                          className={
                            ratingValue <= (hoverStar || starCount)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    );
                  })}
                </div>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                )}
                {starCount > 0 && (
                  <div className={`mt-3 text-center ${emojiFeedback[starCount].color}`}>
                    <span className="text-3xl mr-2">
                      {emojiFeedback[starCount].emoji}
                    </span>
                    <span className="text-lg font-semibold">
                      {emojiFeedback[starCount].text}
                    </span>
                  </div>
                )}
              </div>

              {/* Booking type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.type ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:border-transparent appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Select booking type</option>
                  <option value="Room Booking">Room Booking</option>
                  <option value="Event Booking">Event Booking</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your detailed experience here (5-200 characters)"
                  rows="5"
                  className={`w-full px-4 py-3 border ${errors.comment ? 'border-red-300' : 'border-gray-300'} rounded-lg  focus:border-transparent`}
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
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-[#d9232e] hover:bg-[#b51d26] focus:outline-none transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
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

export default AddReview;