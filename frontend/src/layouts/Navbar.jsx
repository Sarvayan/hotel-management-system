import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaCommentAlt,
  FaClipboardList,
  FaShoppingBasket,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";
import { MdRateReview, MdFeedback, MdHistory } from "react-icons/md";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    {
      id: "account",
      label: "Account",
      icon: <FaUser className="mr-2" />,
      color: "blue",
      links: [
        { to: "/home", label: "Home", icon: <FaUser className="mr-2" /> },
        {
          to: "/guestdashboard",
          label: "Dashboard",
          icon: <FaClipboardList className="mr-2" />,
        },
        {
          to: "/logout",
          label: "Logout",
          icon: <FaTimes className="mr-2" />,
          isDestructive: true,
        },
      ],
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <MdRateReview className="mr-2" />,
      color: "green",
      links: [
        {
          to: "/addreview",
          label: "Give Review",
          icon: <MdRateReview className="mr-2" />,
        },
        {
          to: "/showreview",
          label: "View Reviews",
          icon: <FaCommentAlt className="mr-2" />,
        },
      ],
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: <MdFeedback className="mr-2" />,
      color: "yellow",
      links: [
        {
          to: "/addfeedback",
          label: "Give Feedback",
          icon: <MdFeedback className="mr-2" />,
        },
      ],
    },
    {
      id: "orders",
      label: "Orders",
      icon: <FaShoppingBasket className="mr-2" />,
      color: "purple",
      links: [
        {
          to: "/menu",
          label: "Order Food",
          icon: <FaShoppingBasket className="mr-2" />,
        },
        {
          to: "/orderhistory",
          label: "Food Order History",
          icon: <MdHistory className="mr-2" />,
        },
        {
          to: "/bookinghistory",
          label: "Booking History",
          icon: <MdHistory className="mr-2" />,
        },
      ],
    },
    {
      id: "about",
      label: "About Us",
      to: "/about",
      icon: <FaInfoCircle className="mr-2" />,
      isStatic: true,
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      hover: "hover:bg-blue-200",
      active: "bg-blue-300",
      text: "text-blue-800",
    },
    green: {
      bg: "bg-green-100",
      hover: "hover:bg-green-200",
      active: "bg-green-300",
      text: "text-green-800",
    },
    yellow: {
      bg: "bg-yellow-100",
      hover: "hover:bg-yellow-200",
      active: "bg-yellow-300",
      text: "text-yellow-800",
    },
    purple: {
      bg: "bg-purple-100",
      hover: "hover:bg-purple-200",
      active: "bg-purple-300",
      text: "text-purple-800",
    },
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#b51e27] shadow-xl" : "bg-[#d9232e]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-white tracking-tight">
              WeAre Villa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) =>
              item.isStatic ? (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`flex items-center px-4 py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-colors duration-200 ${
                    location.pathname === item.to ? "bg-white/10" : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      colorClasses[item.color].hover
                    } ${
                      activeMenu === item.id
                        ? colorClasses[item.color].active
                        : "bg-white"
                    } ${colorClasses[item.color].text}`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                  {activeMenu === item.id && (
                    <div
                      className={`absolute right-0 mt-2 w-56 origin-top-right rounded-lg shadow-lg ${
                        colorClasses[item.color].bg
                      } ring-1 ring-black ring-opacity-5 z-10`}
                    >
                      <div className="py-1">
                        {item.links.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center px-4 py-2 text-sm ${
                              link.isDestructive
                                ? "text-red-600 hover:bg-red-50"
                                : `hover:${colorClasses[item.color].hover} ${
                                    colorClasses[item.color].text
                                  }`
                            }`}
                          >
                            {link.icon}
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-white/20 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-[#d9232e]">
          {navItems.map((item) =>
            item.isStatic ? (
              <Link
                key={item.id}
                to={item.to}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 w-full ${
                  location.pathname === item.to ? "bg-white/10" : ""
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ) : (
              <div key={item.id} className="relative">
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium w-full ${
                    activeMenu === item.id
                      ? colorClasses[item.color].active
                      : "bg-white"
                  } ${colorClasses[item.color].text}`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
                {activeMenu === item.id && (
                  <div
                    className={`pl-6 mt-1 space-y-1 ${
                      colorClasses[item.color].bg
                    } rounded-md`}
                  >
                    {item.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          link.isDestructive
                            ? "text-red-600 hover:bg-red-50"
                            : `hover:${colorClasses[item.color].hover} ${
                                colorClasses[item.color].text
                              }`
                        }`}
                      >
                        {link.icon}
                        <span className="ml-3">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
