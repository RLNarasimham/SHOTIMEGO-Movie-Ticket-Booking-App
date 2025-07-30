import React from "react";
import {
  FiHelpCircle,
  FiSearch,
  FiMail,
  FiPhone,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const helpTopics = [
  {
    title: "Booking Issues",
    description:
      "Problems with seat selection, payment failures, or double bookings.",
    link: "/faq#booking",
    icon: <FiHelpCircle className="text-purple-500" size={28} />,
  },
  {
    title: "Refunds & Cancellations",
    description: "How to cancel a ticket and get a refund.",
    link: "/faq#refunds",
    icon: <FiHelpCircle className="text-red-500" size={28} />,
  },
  {
    title: "Offers & Discounts",
    description: "Learn how to use promo codes and avail discounts.",
    link: "/faq#offers",
    icon: <FiHelpCircle className="text-blue-500" size={28} />,
  },
  {
    title: "Account & Security",
    description: "Managing your account and password, security tips.",
    link: "/faq#account",
    icon: <FiHelpCircle className="text-green-500" size={28} />,
  },
];

const HelpCenter: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 sm:px-4 flex items-center justify-center transition-colors duration-300"
      style={{ paddingTop: "10rem" }}
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
            Help Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Find answers to your questions or get in touch with our support
            team.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <form className="w-full max-w-xl flex bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            <input
              type="text"
              placeholder="Search help topics, e.g. 'refund', 'cancel', 'payment'..."
              className="flex-1 px-5 py-3 outline-none text-gray-800 dark:text-white bg-transparent"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-purple-600 text-white px-6 transition-colors flex items-center"
            >
              <FiSearch className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {helpTopics.map((topic, idx) => (
            <Link
              key={idx}
              to={topic.link}
              className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition group"
            >
              <div>{topic.icon}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-red-600 transition">
                  {topic.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
                  {topic.description}
                </p>
              </div>
              <FiChevronRight
                className="text-gray-300 dark:text-gray-600 group-hover:text-red-500 mt-1"
                size={20}
              />
            </Link>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex-1 text-center sm:text-left">
            <div className="text-gray-700 dark:text-gray-200 font-medium mb-1">
              Still need help?
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Reach our support team. We’re here 24x7 for you!
            </div>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a
              href="mailto:support@showtimego.com"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-purple-600 text-white font-semibold transition-colors"
            >
              <FiMail /> Email Support
            </a>
            <a
              href="tel:+919000012345"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-red-600 text-white font-semibold transition-colors"
            >
              <FiPhone /> Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
