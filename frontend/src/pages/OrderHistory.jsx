import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
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
        console.log(isGuest);

        if (!isGuest) {
          toast.error("Your Booking Didn't Accept Yet", {
            autoClose: 2000,
            position: "top-right",
          });
          setTimeout(() => navigate("/home"), 2000);
        } else {
          console.log("✅ Guest verified");
          setCheckGuest(true);
        }
      })
      .catch((error) => {
        console.error("Error during guest check:", error);
        toast.error("Server error. Try again.", {
          autoClose: 2000,
          position: "top-right",
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
        setError("Error fetching order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-[#d9232e] py-6 px-8 rounded-t-xl shadow-md">
          <h1 className="text-3xl font-bold text-white text-center">
            Food Order History
          </h1>
        </div>

        <div className="p-6">
          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}

          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
              <p className="text-lg font-semibold">Loading...</p>
            </div>
          ) : (
            <div>
              {orders.length > 0 ? (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li key={order._id} className="border-b py-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order on{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </h3>
                        <p className="text-gray-600">
                          Total Price: Rs {order.totalPrice}
                        </p>
                      </div>
                      <ul className="mt-2 space-y-2">
                        {order.orderItems.map((item, index) => (
                          <li key={index} className="text-gray-700">
                            <span className="font-medium">{item.name}</span>{" "}
                            (Qty:{" "}
                            <span className="font-semibold">
                              {item.quantity}
                            </span>
                            )
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-600 font-medium">
                  No orders found for this email.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
