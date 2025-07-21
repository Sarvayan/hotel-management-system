import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaFax } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#d9232e] to-[#a51b23] text-white pt-12 pb-6 my-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">Anuthama Villa</h3>
            <p className="text-sm leading-relaxed text-gray-100">
              We provide exceptional service and premium accommodations to make your stay unforgettable. Our team is committed to excellence and guest satisfaction.
            </p>
            <div className="pt-2">
              <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-tight">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-100 hover:text-white transition-colors duration-300 text-sm">Home</a></li>
              <li><a href="#" className="text-gray-100 hover:text-white transition-colors duration-300 text-sm">Rooms & Suites</a></li>
              <li><a href="#" className="text-gray-100 hover:text-white transition-colors duration-300 text-sm">Amenities</a></li>
              <li><a href="#" className="text-gray-100 hover:text-white transition-colors duration-300 text-sm">Gallery</a></li>
              <li><a href="#" className="text-gray-100 hover:text-white transition-colors duration-300 text-sm">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-tight">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-100 text-sm">123 Luxury Avenue, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 flex-shrink-0" />
                <span className="text-gray-100 text-sm">+94 123 456 789</span>
              </li>
              <li className="flex items-center">
                <MdEmail className="mr-3 flex-shrink-0 text-base" />
                <span className="text-gray-100 text-sm">info@wearevilla.com</span>
              </li>
              <li className="flex items-center">
                <FaFax className="mr-3 flex-shrink-0" />
                <span className="text-gray-100 text-sm">+94 123 456 788</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-tight">Newsletter</h3>
            <p className="text-sm leading-relaxed text-gray-100 mb-4">
              Subscribe to our newsletter to get exclusive offers and updates about our services.
            </p>
            <form className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 w-full rounded-md text-gray-800 bg-white outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  required
                />
                <button 
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-200">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white border-opacity-20 my-6"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-200">
          <p>&copy; {new Date().getFullYear()} Anuthama Villa. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;