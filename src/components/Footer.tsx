import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-4 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-y-8">
        
        <div className="flex flex-col gap-4 md:max-w-xs">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-white mb-2"
          >
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 4l12 8-12 8V4z" />
            </svg>
            SHOWTIMEGO
          </Link>
          <p className="text-gray-400 text-sm">
            Your one-stop destination for movies, concerts, and events. Book
            tickets easily and enjoy entertainment like never before!
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <FaFacebook size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300"
            >
              <FaTwitter size={22} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500"
            >
              <FaYoutube size={22} />
            </a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div>
            <h3 className="text-white font-semibold mb-2 text-lg">Movies</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  to="/coming-soon"
                  className="hover:text-red-400 transition-colors"
                >
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="hover:text-red-400 transition-colors"
                >
                  Offers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2 text-lg">Events</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  to="/concerts"
                  className="hover:text-red-400 transition-colors"
                >
                  Concerts
                </Link>
              </li>
              <li>
                <Link
                  to="/sports"
                  className="hover:text-red-400 transition-colors"
                >
                  Sports
                </Link>
              </li>
              <li>
                <Link
                  to="/theatresandarts"
                  className="hover:text-red-400 transition-colors"
                >
                  Theatre & Arts
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2 text-lg">Support</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  to="/help"
                  className="hover:text-red-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-red-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-red-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} SHOWTIMEGO. All rights reserved. |
        Designed for movie lovers 🎬
      </div>
    </footer>
  );
};

export default Footer;
