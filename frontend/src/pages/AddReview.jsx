import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Filter } from "bad-words";
import { toast } from "react-toastify";

function AddReview() {
  const [user, setUser] = useState({});
  const [starCount, setStarCount] = useState(0);
  const [comment, setComment] = useState("");
  const [commentErrorMessage, setCommentErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
      });
  }, []);

  const changeStar = (value) => setStarCount(value + 1);

  const changeComment = (event) => {
    setComment(event.target.value);
    setCommentErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!comment.trim()) {
      setErrorMessage("One of the fields is missing.");
      return;
    }

    if (!/^[A-Za-z0-9\s.,!?'-]{5,200}$/.test(comment)) {
      setCommentErrorMessage(
        "❌ Invalid Comment. Your comment must be 5-200 characters long and free from inappropriate language."
      );
      return;
    }

    if (filter.isProfane(comment)) {
      setCommentErrorMessage("❌ Your comment contains inappropriate words.");
      return;
    }

    const reviewDate = new Date().toISOString(); // current date

    axios
      .post(
        "http://localhost:4000/api/review/addreview",
        {
          name: user.fname,
          address: user.address,
          star: starCount,
          type: selectedType,
          comment: comment,
          reviewDate: reviewDate,
        },
        { withCredentials: true }
      )
      .then((data) => {
        if (data.data === true) {
          toast.success("Your review has been submitted successfully!");
          navigate("/guestdashboard");
        } else {
          toast.error("❌ Failed to submit the review. Please try again.");
        }
      })
      .catch(() => {
        setErrorMessage("There was an error submitting your review.");
        toast.error("❌ There was an error submitting your review.");
      });
  };

  const emojiFeedback = {
    1: { emoji: "😡", text: "Very Bad" },
    2: { emoji: "😞", text: "Bad" },
    3: { emoji: "😐", text: "Average" },
    4: { emoji: "😊", text: "Good" },
    5: { emoji: "🤩", text: "Excellent" },
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {show && (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-[#d9232e] py-5 px-6 mb-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Share Your Experience
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            {errorMessage && (
              <p className="text-red-600 text-center font-semibold mb-4">
                {errorMessage}
              </p>
            )}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={user.fname || ""}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={user.address || ""}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    onClick={() => changeStar(index)}
                    className={`text-3xl cursor-pointer transition-colors duration-200 ${
                      index < starCount ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </span>
                ))}
              </div>
              {starCount > 0 && (
                <p className="mt-2 text-center text-lg font-semibold text-gray-600">
                  <span className="text-2xl mr-2">
                    {emojiFeedback[starCount]?.emoji}
                  </span>
                  {emojiFeedback[starCount]?.text}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Select Booking Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border p-2 rounded-md"
                required
              >
                <option disabled value="">
                  Select Type
                </option>
                {["Room Booking", "Event Booking"].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Comments
              </label>
              <textarea
                name="comment"
                placeholder="Write your thoughts here..."
                value={comment}
                onChange={changeComment}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none"
              />
              {commentErrorMessage && (
                <p className="text-red-600 text-sm mt-1">
                  {commentErrorMessage}
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-[#d9232e] hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddReview;
