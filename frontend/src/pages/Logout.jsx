import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import RoleContext from "../components/RoleContext";

function Logout() {
  const navigate = useNavigate();
  const { setUserRole } = useContext(RoleContext);

  useEffect(() => {
    axios
      .post(
        "http://localhost:4000/api/guests/logout",
        {},
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success) {
          localStorage.removeItem("role");
          setUserRole(null);
          toast.success("Logged Out Successfully", {
            autoClose: 2000,
            position: "top-right",
          });
          setTimeout(() => navigate("/"), 2000);
        }
      })
      .catch((error) => {
        console.error("Error during Logout:", error);
        toast.error("Server error. Try again.", {
          autoClose: 2000,
          position: "top-right",
        });
        setTimeout(() => navigate("/adminhome"), 2000);
      });
  }, []);

  return <></>;
}

export default Logout;
