import React, { useEffect, useState } from "react";
import axios from "axios";
import Cart from "./Cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import adminBg from "../assets/images/admin-bg3.jpg";
import foodBackground from "../assets/images/food-bg.jpg";

function Menu() {
  const [foodtype, setFoodType] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectMenu, setSelectMenu] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [orderFood, setOrderFood] = useState([]);
  const [checkGuest, setCheckGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/order/checkguest", {
        withCredentials: true,
      })
      .then((response) => {
        const isGuest = response.data === true;
        if (!isGuest) {
          toast.error("Please complete check-in before ordering", {
            autoClose: 2000,
            position: "top-right",
          });
          setTimeout(() => navigate("/home"), 2000);
        } else {
          setCheckGuest(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Server error. Please try again.", {
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
        const [foodtypeResponse, menuResponse] = await Promise.all([
          axios.get("http://localhost:4000/api/foodtype/getfoodtype"),
          axios.get("http://localhost:4000/api/menu/getmenu"),
        ]);

        setFoodType(foodtypeResponse.data);
        setMenu(menuResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load menu. Please refresh the page.");
      } finally {
        setIsLoading(false);
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
    const value = Math.max(0, parseInt(event.target.value, 10) || 0);
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [item.name]: value > 10 ? 10 : value, // Limit to max 10
    }));
  }

  function handleSubmit(item) {
    if (!quantity[item.name] || quantity[item.name] < 1) {
      toast.error("Please enter a valid quantity (1-10)");
      return;
    }

    setOrderFood((prevOrder) => [
      ...prevOrder,
      {
        name: item.name,
        price: item.price,
        quantity: quantity[item.name],
        type: item.type,
      },
    ]);

    toast.success(`${quantity[item.name]} ${item.name} added to cart!`, {
      position: "top-right",
      autoClose: 1500,
    });

    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [item.name]: 0,
    }));
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background with subtle overlay */}
      <div className="absolute inset-0 bg-black opacity-5 z-0"></div>
      <div
        className="absolute inset-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `url(${adminBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main card container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-red-700 to-red-600 py-8 px-6 sm:px-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Restaurant Menu
            </h1>
            <p className="text-white text-opacity-90 text-lg">
              Order your favorite dishes from our exquisite selection
            </p>
          </div>

          {/* Food type selector */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {foodtype.length > 0 ? (
                foodtype.map((item) => (
                  <button
                    key={item.id || item.type}
                    value={item.type}
                    onClick={handleFoodType}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base"
                  >
                    {item.type}
                  </button>
                ))
              ) : (
                <div className="w-full text-center py-4">
                  <p className="text-red-500">No food categories available</p>
                </div>
              )}
            </div>

            {/* Menu items */}
            {isClicked && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                  {selectMenu[0]?.type || "Menu"} Selection
                </h2>
                {selectMenu.map((item) => (
                  <div
                    key={item.id || item.name}
                    className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center w-full sm:w-1/3 mb-4 sm:mb-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.description || "Delicious dish"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-2/3">
                      <span className="text-xl font-bold text-red-600 w-1/4 text-center">
                        Rs {item.price}
                      </span>

                      <div className="flex items-center w-1/2 justify-center">
                        <button
                          onClick={() =>
                            changeQuantity(item, {
                              target: { value: (quantity[item.name] || 0) - 1 },
                            })
                          }
                          disabled={(quantity[item.name] || 0) <= 0}
                          className="w-10 h-10 bg-gray-200 rounded-l-lg flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={quantity[item.name] || 0}
                          onChange={(e) => changeQuantity(item, e)}
                          className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                        <button
                          onClick={() =>
                            changeQuantity(item, {
                              target: { value: (quantity[item.name] || 0) + 1 },
                            })
                          }
                          disabled={(quantity[item.name] || 0) >= 10}
                          className="w-10 h-10 bg-gray-200 rounded-r-lg flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={() => handleSubmit(item)}
                        disabled={(quantity[item.name] || 0) < 1}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-4"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isClicked && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Select a food category
                </h3>
                <p className="mt-1 text-gray-500">
                  Choose from our delicious menu options above
                </p>
              </div>
            )}
          </div>

          {/* Cart component */}
          <div className="border-t border-gray-200 p-6 sm:p-8">
            <Cart orderFood={orderFood} setOrderFood={setOrderFood} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
