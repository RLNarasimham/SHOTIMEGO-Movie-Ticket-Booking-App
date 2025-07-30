import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { auth } from "../config/firebase.ts";

const ContactUs: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-6 px-2 sm:px-4 flex items-center justify-center transition-colors duration-300 pt-16"
      style={{ paddingTop: "8rem" }}
    >
      <div className="w-full max-w-4xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            Have a question, feedback, or need support? Reach out to us and our
            team will get back to you as soon as possible.
          </p>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FiMail className="text-red-500" size={22} />
            support@showtimego.com
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FiPhone className="text-purple-600" size={22} />
            +91 90000 12345
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FiMapPin className="text-blue-500" size={22} />
            Hyderabad, Telangana, India
          </div>
        </div>

        <div className="flex-1">
          <form
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow space-y-5 transition-colors"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Name<span className="text-red-600 ml-0.5">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-red-500 outline-none transition"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Email<span className="text-red-600 ml-0.5">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Message<span className="text-red-600 ml-0.5">*</span>
              </label>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-purple-600 text-white text-lg font-semibold rounded-md transition-colors"
              disabled={submitted}
            >
              {submitted ? (
                <span className="flex justify-center items-center gap-2">
                  <FiCheckCircle className="animate-bounce" /> Message Sent!
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
