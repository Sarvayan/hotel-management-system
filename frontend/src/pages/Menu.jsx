import React, { useEffect, useState } from "react";
import axios from "axios";
import Cart from "./Cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Menu() {
  const [foodtype, setFoodType] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectMenu, setSelectMenu] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [orderFood, setOrderFood] = useState([]);
  const [checkGuest, setCheckGuest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/order/checkguest", {
        withCredentials: true,
      })
      .then((response) => {
        const isGuest = response.data === true;
        console.log(isGuest);

        if (!isGuest) {
          toast.error("You Didn't Check-in Yet", {
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
        console.error("Error food ordering:", error);
        toast.error("Server error. Try again.", {
          autoClose: 2000,
          position: "top-right",
        });
        setTimeout(() => navigate("/home"), 2000);
      });
  }, []);

  useEffect(() => {
    if (!checkGuest) return;

    const fetchData = async () => {
      try {
        const foodtypeResponse = await axios.get(
          "http://localhost:4000/api/foodtype/getfoodtype"
        );
        console.log("Food types fetched:", foodtypeResponse.data);
        setFoodType(foodtypeResponse.data);

        const menuResponse = await axios.get(
          "http://localhost:4000/api/menu/getmenu"
        );
        console.log("✅ Menu fetched:", menuResponse.data);
        setMenu(menuResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, [checkGuest]);

  function handleFoodType(event) {
    const filteredMenu = menu.filter(
      (item) => item.type === event.target.value
    );
    setSelectMenu(filteredMenu);
    setIsClicked(true);
  }

  function changeQuantity(item, event) {
    const value = parseInt(event.target.value, 10) || 0;
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [item.name]: value,
    }));
  }

  function handleSubmit(item) {
    if (!quantity[item.name] || quantity[item.name] < 1) {
      toast.error("Please enter a valid quantity (at least 1).");
      return;
    }

    setOrderFood((prevOrder) => [
      ...prevOrder,
      { name: item.name, price: item.price, quantity: quantity[item.name] },
    ]);

    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [item.name]: 0,
    }));
  }

  return (
    <div className="bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#d9232e] py-5 px-6">
          <h1 className="text-2xl font-bold text-white text-center">
            Order Your Favourite Food
          </h1>
        </div>
        <div className="flex justify-center gap-4 mb-6 p-4">
          {foodtype.length > 0 ? (
            foodtype.map((item) => (
              <button
                key={item.id || item.type}
                value={item.type}
                onClick={handleFoodType}
                className="w-1/3 bg-gradient-to-r from-[#FF5F6D] to-[#FFC371] text-white py-3 rounded-md hover:from-[#FFC371] hover:to-[#FF5F6D] hover:scale-105 transition duration-300 text-sm font-semibold shadow-lg cursor-pointer"
              >
                {item.type}
              </button>
            ))
          ) : (
            <p className="text-red-500">No food types available.</p>
          )}
        </div>

        {isClicked && (
          <div className="space-y-4 p-4">
            {selectMenu.map((item) => (
              <div
                key={item.id || item.name}
                className="flex items-center justify-between bg-gray-100 rounded-lg p-4 shadow-md"
              >
                <h2 className="text-lg font-semibold text-gray-800 w-1/3">
                  {item.name}
                </h2>
                <p className="text-lg font-semibold text-gray-700 w-1/3 text-center">
                  Rs {item.price}
                </p>
                <div className="flex items-center w-1/3 justify-end">
                  <label className="mr-2 text-gray-700">Qty</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity[item.name] || 0}
                    onChange={(e) => changeQuantity(item, e)}
                    className="w-16 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => handleSubmit(item)}
                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all cursor-pointer"
                >
                  Order
                </button>
              </div>
            ))}
          </div>
        )}

        <Cart orderFood={orderFood} setOrderFood={setOrderFood} />
      </div>
    </div>
  );
}

export default Menu;
