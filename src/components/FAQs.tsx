import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "How do I book movie tickets online?",
    answer:
      "Simply search for your movie, choose a showtime, select your seats, and complete the payment. Your e-ticket will be instantly available on the website and emailed to you.",
  },
  {
    question: "Can I cancel or change my booking?",
    answer:
      "Bookings can be canceled or modified only before the showtime and as per cinema policies. Visit 'My Bookings' or contact support for assistance.",
  },
  {
    question: "Are there any extra charges for online booking?",
    answer:
      "A minimal internet handling fee may be applicable as per the ticketing policy. All charges are transparently displayed before you pay.",
  },
  {
    question: "Where can I find current offers and discounts?",
    answer:
      "Visit our 'Offers' page or check banners on the homepage for all the latest deals, cashback, and special card offers.",
  },
  {
    question: "How do I access my ticket after booking?",
    answer:
      "After successful payment, your ticket is shown on the confirmation screen, emailed to you, and is available under 'My Bookings' anytime.",
  },
];

const FAQs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16 dark:from-gray-900 dark:to-gray-950 px-2 sm:px-4 flex items-center justify-center transition-colors duration-300"
      style={{ paddingTop: "9rem" }}
    >
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8 tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  {faq.question}
                </span>
                <FiChevronDown
                  className={`h-6 w-6 text-gray-500 dark:text-gray-300 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 px-6 overflow-hidden ${
                  openIndex === idx
                    ? "max-h-40 py-2 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
