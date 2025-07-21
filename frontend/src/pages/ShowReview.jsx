import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import adminBg from "../assets/images/admin-bg3.jpg";
import { toast } from "react-toastify";

// Enhanced date formatting function
const formatReviewDate = (utcDate) => {
  const options = {
    timeZone: "Asia/Colombo",
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return new Date(utcDate).toLocaleString('en-GB', options);
};

function ShowReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/review/getreviews");
        if (response.data.success) {
          setReviews(response.data.reviews);
        } else {
          toast.info("No reviews available yet", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews. Please try again.", {
          position: "top-center",
          autoClose: 2000,
        });
        setError("Failed to fetch reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Guest <span className="text-[#d9232e]">Reviews</span>
          </h1>
          <p className="mt-3 max-w-2xl text-xl text-gray-600 mx-auto">
            What our guests say about their experience
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d9232e]"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  {/* Review header */}
                  <div className="bg-gradient-to-r from-[#d9232e] to-[#a51c24] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white truncate">
                        {review.name}
                      </h3>
                      <span className="bg-white text-[#d9232e] text-xs font-semibold px-2 py-1 rounded-full">
                        {review.type}
                      </span>
                    </div>
                    <p className="text-sm text-white opacity-90 mt-1">
                      {review.address}
                    </p>
                  </div>

                  {/* Review body */}
                  <div className="p-6">
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex mr-2">
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
                      <span className="text-sm text-gray-500">
                        {review.star}.0/5.0
                      </span>
                    </div>

                    {/* Comment */}
                    <blockquote className="mb-6">
                      <p className="text-gray-700 italic">
                        "{review.comment}"
                      </p>
                    </blockquote>

                    {/* Date */}
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {formatReviewDate(review.reviewDate)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No reviews yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Be the first to share your experience!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowReview;