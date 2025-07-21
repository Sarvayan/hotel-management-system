import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import adminBg from "../assets/images/admin-bg3.jpg";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkGuest, setCheckGuest] = useState(false);
  const navigate = useNavigate();

  // Check if guest is authorized
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/order/checkguest", {
        withCredentials: true,
      })
      .then((response) => {
        const isGuest = response.data === true;
        if (!isGuest) {
          toast.error("Your Booking Hasn't Been Approved Yet", {
            autoClose: 2000,
            position: "top-center",
            className: "toast-error",
          });
          setTimeout(() => navigate("/home"), 2000);
        } else {
          setCheckGuest(true);
        }
      })
      .catch((error) => {
        console.error("Error during guest check:", error);
        toast.error("Server Error. Please Try Again.", {
          autoClose: 2000,
          position: "top-center",
          className: "toast-error",
        });
        setTimeout(() => navigate("/home"), 2000);
      });
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4000/api/order/getorder",
          { withCredentials: true }
        );
        setOrders(response.data || []);
      } catch (err) {
        setError("Failed to load order history. Please refresh the page.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (checkGuest) {
      fetchOrders();
    }
  }, [checkGuest]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Your <span className="text-[#d9232e]">Order History</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Review all your previous food orders
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Status bar */}
          <div className="bg-gradient-to-r from-[#d9232e] to-[#a51c24] py-4 px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Found
              </h2>
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-white text-sm font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Loading/error states */}
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-[#d9232e] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-lg font-medium text-gray-700">Loading your order history...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading orders</h3>
              <p className="mt-1 text-gray-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#d9232e] hover:bg-[#b51d26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d9232e]"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#d9232e] flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Order #{order._id.substring(18, 24).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-700 mb-2">Items Ordered</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {order.orderItems.map((item, index) => (
                          <li key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">{item.name}</span>
                              <span className="text-gray-600">Qty: {item.quantity}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium">Cash/Card</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-[#d9232e]">Rs {order.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center">
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
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                  <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/menu')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#d9232e] hover:bg-[#b51d26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d9232e]"
                    >
                      Browse Menu
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;