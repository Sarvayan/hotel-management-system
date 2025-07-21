import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import adminBg from "../assets/images/admin-bg3.jpg";

function Cart({ orderFood = [], setOrderFood }) {
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const calculatedTotal = orderFood.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(calculatedTotal);
  }, [orderFood]);

  function deleteFood(event) {
    const updatedOrderFood = orderFood.filter(
      (item) => !(item.name === event.name && item.quantity === event.quantity)
    );
    setOrderFood(updatedOrderFood);
    toast.info(`${event.name} removed from cart`);
  }

  async function handleSubmit() {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/order/placeorder",
        {
          orderItems: orderFood.map((item) => ({
            name: item.name,
            quantity: item.quantity,
          })),
          totalPrice: total,
          checkInTime: "10:00 AM",
          checkOutTime: "10:00 AM"
        },
        { withCredentials: true }
      );

      if (response.data === true) {
        toast.success("Order placed successfully!");
        setTimeout(() => navigate("/orderhistory"), 2000);
      } else {
        toast.error(response.data.message || "Order submission failed.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("An error occurred while placing your order.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-7xl mx-auto">
        {/* Background with opacity */}
        <div
          className="absolute inset-0 w-full h-full opacity-10 z-0"
          style={{
            backgroundImage: `url(${adminBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        
        {/* Main content */}
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
              Your <span className="text-indigo-600">Food Cart</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Review and confirm your delicious selections
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            {orderFood.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {/* Cart items */}
                <div className="px-6 py-5 sm:px-8 sm:py-7">
                  <h2 className="text-lg font-medium text-gray-900">
                    Order Summary
                  </h2>
                  <div className="mt-8">
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-200">
                        {orderFood.map((item, index) => (
                          <li key={index} className="py-6 flex flex-col sm:flex-row">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {item.name}
                                  </h3>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center justify-between sm:justify-end">
                              <p className="text-lg font-semibold text-gray-900 sm:ml-16">
                                Rs {item.price * item.quantity}
                              </p>
                              <button
                                onClick={() => deleteFood(item)}
                                className="ml-6 sm:ml-12 px-3 py-1.5 bg-red-100 text-red-600 rounded-md text-sm font-medium hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Order total */}
                <div className="px-6 py-5 sm:px-8 sm:py-7 bg-gray-50">
                  <div className="flex justify-between text-lg font-medium text-gray-900">
                    <p>Total</p>
                    <p>Rs {total}</p>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleSubmit}
                      className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                      Confirm Order
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-gray-500">
                    <p>
                      Check-in/Check-out time: 10:00 AM
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-16 sm:px-8 sm:py-20 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Your cart is empty
                </h3>
                <p className="mt-2 text-gray-500">
                  Start adding some delicious items to your order
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Continue Ordering
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;