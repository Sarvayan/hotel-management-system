import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddProduct() {
  const navigate = useNavigate();

  const [pname, setpname] = useState("");
  const [category, setcategory] = useState("");
  const [description, setdescription] = useState("");
  const [stock, setstock] = useState("");
 
  const [errorMessage, seterrorMessage] = useState("");
  const [pnameErrorMessage, setPnameErrorMessage] = useState("");
  const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
  const [stockErrorMessage, setStockErrorMessage] = useState("");
  

  function changePname(event) {
    setpname(event.target.value);
    setPnameErrorMessage("");
  }

  function changeCategory(event) {
    setcategory(event.target.value);
    setCategoryErrorMessage("");
  }

  function changeDescription(event) {
    setdescription(event.target.value);
    setDescriptionErrorMessage("");
  }

  function changeStock(event) {
    setstock(event.target.value);
    setStockErrorMessage("");
  }

  

  const pnameRegex = /^[A-Za-z0-9\s\-]{3,50}$/;
  const descriptionRegex = /^[A-Za-z0-9\s.,!'"()-]{10,500}$/;
  

  function handleSubmit(event) {
    event.preventDefault();
    seterrorMessage("");

    let isValid = true;

    if (!pnameRegex.test(pname)) {
      setPnameErrorMessage(
        "❌ Invalid Product Name! Must be 3-50 characters, only letters, numbers, spaces, and hyphens (-) allowed."
      );
      isValid = false;
    }

    if (!descriptionRegex.test(description)) {
      setDescriptionErrorMessage(
        "❌ Invalid Description! Must be 10-500 characters, containing only letters, numbers, spaces, and allowed punctuation."
      );
      isValid = false;
    }

    if (category.trim() === "") {
      setCategoryErrorMessage(
        "❌ Invalid Category Type. Please select a valid category."
      );
      isValid = false;
    }

    if (stock.trim() === "" || isNaN(stock) || stock < 0) {
      setStockErrorMessage("❌ Stock must be a non-negative number.");
      isValid = false;
    }

    
    if (!isValid) {
      return;
    }

    axios
      .post("http://localhost:4000/api/inventory/addproduct", {
        pname: pname,
        category: category,
        description: description,
        stock: stock,
        
      })
      .then((response) => {
        if (response.data === true) {
          toast.success("Product added successfully!", {
            
          });
          navigate("/");
        } else {
          toast.error("Error: " + response.data, {
            
          });
        }
      })
      .catch((error) => {
        toast.error("There was an error submitting the product.", {
         
        });
      });
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Add New Product
      </h1>
      <form onSubmit={handleSubmit}>
        <p className="text-red-700 text-center mb-4">{errorMessage}</p>

        <label className="block text-lg font-semibold text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          name="pname"
          placeholder="Enter Product Name"
          value={pname}
          onChange={changePname}
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
        />
        <p className="text-red-700 text-sm">{pnameErrorMessage}</p>

        <label className="block text-lg font-semibold text-gray-700 mt-4">
          Category
        </label>
        <select
          value={category}
          onChange={changeCategory}
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="Furniture">Furniture</option>
          <option value="Electronics">Electronics</option>
          <option value="Toiletries">Toiletries</option>
          <option value="Cleaning Supplies">Cleaning Supplies</option>
        </select>
        <p className="text-red-700 text-sm">{categoryErrorMessage}</p>

        <label className="block text-lg font-semibold text-gray-700 mt-4">
          Description
        </label>
        <input
          type="text"
          name="description"
          placeholder="Enter Description About Product"
          value={description}
          onChange={changeDescription}
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
        />
        <p className="text-red-700 text-sm">{descriptionErrorMessage}</p>

        <label className="block text-lg font-semibold text-gray-700 mt-4">
          Stock
        </label>
        <input
          type="number"
          name="stock"
          placeholder="Enter Stock Level"
          value={stock}
          onChange={changeStock}
          min="1"
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
        />
        <p className="text-red-700 text-sm">{stockErrorMessage}</p>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-500 text-white text-lg font-semibold rounded-lg transition-all transform hover:bg-blue-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
