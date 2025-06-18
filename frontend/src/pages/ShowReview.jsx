import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

// Function to convert UTC to Sri Lanka Time
// Function to convert UTC to Sri Lanka Time using toLocaleString with timeZone option
const convertToSriLankaTime = (utcDate) => {
  const date = new Date(utcDate); // Create Date object from UTC time
  return date.toLocaleString("en-GB", {
    // Sri Lanka format: dd/mm/yyyy, hh:mm:ss
    timeZone: "Asia/Colombo", // Ensure this correctly sets Sri Lanka time zone
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

function ShowReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/review/getreviews")
      .then((response) => {
        if (response.data.success === true) {
          setReviews(response.data.reviews);
          setLoading(false);
        } else {
          console.log("No reviews found");
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setError("Failed to fetch reviews. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#d9232e] py-5 px-6">
          <h1 className="text-2xl font-bold text-white text-center">
            Guest Reviews
          </h1>
        </div>
      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="w-full max-w-3xl space-y-4 p-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => {
            const formattedDate = convertToSriLankaTime(review.reviewDate); // Format date for each review
            return (
              <div
                key={index}
                className="bg-[#FFFACD] p-4 shadow-md rounded-lg border border-gray-300"
              >
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border border-gray-200">
                  <div className="flex flex-col items-start space-y-2">
                    <h2 className="text-2xl font-bold text-[#8B8000]">
                      {review.name}
                    </h2>
                    <p className="text-base font-medium text-[#8B8000]">
                      About {review.type}
                    </p>
                    <p className="text-sm text-[#8B8000]">{review.address}</p>
                    <p className="text-sm text-[#8B8000]">{formattedDate}</p>

                    <div className="flex items-center my-3">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={`h-5 w-5 ${
                            i < review.star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed mt-2">
                      <span className="text-[#8B8000] font-semibold">
                        "{review.comment}"
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default ShowReview;
