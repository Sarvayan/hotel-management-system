import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        },
        { withCredentials: true }
      );

      if (response.data === true) {
        toast.success("Food ordering successful!");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        toast.error(response.data.message || "Food ordering failed.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Your Cart
      </h2>

      {orderFood.length > 0 ? (
        <div className="space-y-4">
          {orderFood.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-lg font-semibold text-gray-700">
                Rs {item.price * item.quantity}
              </p>
              <button
                onClick={() => deleteFood(item)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}

          <div className="text-right mt-4">
            <p className="text-xl font-semibold text-gray-800">
              Total Price: Rs {total}
            </p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white text-lg rounded-lg shadow-md hover:bg-green-700 transition-all cursor-pointer"
            >
              Confirm Order
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Your cart is empty</p>
      )}
    </div>
  );
}

export default Cart;
