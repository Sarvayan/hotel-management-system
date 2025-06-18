import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-[#d9232e] text-white py-3 mt-8 rounded-md">
      <div className="max-w-7xl mx-auto px-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Anuthama Villa</h3>
            <p className="text-sm leading-relaxed mb-4">
              We provide exceptional service and products to help businesses
              grow and thrive. Our team is committed to excellence and customer
              satisfaction.
            </p>
            <h4 className="text-xl font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Info</h3>
            <p className="text-sm mb-2">
              Address: 123 Business Ave, City, Country
            </p>
            <p className="text-sm mb-2">Mobile: +123 456 789</p>
            <p className="text-sm">Fax: +123 456 788</p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Newsletter</h3>
            <p className="text-sm leading-relaxed mb-4">
              Subscribe to our newsletter to get the latest updates and special
              offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 w-full rounded-l-md text-black bg-white outline-none"
              />
              <button className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-xs text-white">
          <p>&copy; 2025 Anuthama Villa. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
