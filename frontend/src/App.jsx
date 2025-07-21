import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import "./assets/css/toastStyles.css";

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import About from "./pages/About";
import Contactus from "./pages/ContactUs";
import Signup from "./pages/Signup";
import AdminSignup from "./pages/AdminSignup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import NewPassword from "./pages/NewPassword";
import GuestRegistration from "./pages/GuestRegistration";
import GuestDashboard from "./pages/GuestDashboard";
import RoomBooking from "./pages/RoomBooking";
import EventBooking from "./pages/EventBooking";
import Room from "./pages/Room";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import AddReview from "./pages/AddReview";
import ShowReview from "./pages/ShowReview";
import AddFeedback from "./pages/AddFeedback";
import AddProduct from "./pages/AddProduct";
import ShowProduct from "./pages/ShowProduct";
import ViewDetails from "./pages/ViewDetails";
import GuestList from "./pages/GuestList";
import BlacklistAccount from "./pages/BlacklistAccount";
import BookingRequest from "./pages/BookingRequest";
import BookingHistory from "./pages/BookingHistory";
import AdminNavbar from "./layouts/AdminNavbar";
import UserNavbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import UpdateRoom from "./pages/UpdateRoom";
import ManageRoom from "./pages/ManageRoom";
import AddEvent from "./pages/AddEvent";
import UpdateEvent from "./pages/UpdateEvent";
import ManageEvent from "./pages/ManageEvent";
import ProfileUpdate from "./pages/ProfileUpdate";
import OrderHistory from "./pages/OrderHistory";
import Checkin from "./pages/Checkin";
import Checkout from "./pages/Checkout";
import CleaningStatus from "./pages/CleaningStatus";
import AdminLogin from "./pages/AdminLogin";
import Logout from "./pages/Logout";
import Report from "./pages/Report";

import RoleContext from "./components/RoleContext";

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <RoleContext.Provider value={{ userRole, setUserRole }}>
      <BrowserRouter>
        {userRole === "admin" ? (
          <AdminNavbar />
        ) : userRole === "user" ? (
          <UserNavbar />
        ) : null}

        <ToastContainer />

        <div className="pt-25">
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login setUserRole={setUserRole} />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/newpassword" element={<NewPassword />} />

            {/* User & Admin Routes */}

            <Route path="/about" element={<About />} />
            <Route path="/contactus" element={<Contactus />} />
            <Route path="/guestregistration" element={<GuestRegistration />} />
            <Route path="/home" element={<Home />} />
            <Route path="/guestdashboard" element={<GuestDashboard />} />
            <Route path="/roombooking" element={<RoomBooking />} />
            <Route path="/eventbooking" element={<EventBooking />} />
            <Route path="/room" element={<Room />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/addreview" element={<AddReview />} />
            <Route path="/showreview" element={<ShowReview />} />
            <Route path="/addfeedback" element={<AddFeedback />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/showproduct" element={<ShowProduct />} />
            <Route path="/viewdetails/:id" element={<ViewDetails />} />
            <Route path="/guestlist" element={<GuestList />} />
            <Route path="/blacklistaccount" element={<BlacklistAccount />} />
            <Route path="/bookingrequest" element={<BookingRequest />} />
            <Route path="/bookinghistory" element={<BookingHistory />} />
            <Route path="/manageroom" element={<ManageRoom />} />
            <Route path="/updateroom" element={<UpdateRoom />} />
            <Route path="/addevent" element={<AddEvent />} />
            <Route path="/manageevent" element={<ManageEvent />} />
            <Route path="/updateevent" element={<UpdateEvent />} />
            <Route path="/updateprofile" element={<ProfileUpdate />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
            <Route path="/checkin" element={<Checkin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cleaningstatus" element={<CleaningStatus />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/adminsignup" element={<AdminSignup />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/report" element={<Report />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </RoleContext.Provider>
  );
}

export default App;
