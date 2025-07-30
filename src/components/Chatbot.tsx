import React, { useState } from "react";
import { FaUser, FaRobot, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const Chatbot: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi. May I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isHome = location.pathname === "/";

  const suggestions = [
    "How do I book a movie ticket?",
    "Can I cancel my booking?",
    "What are the show timings today?",
    "What payment methods are supported?",
    "Where is the nearest theatre?",
  ];

  const sendMessage = async (customInput?: string) => {
    const userInput = customInput ?? input.trim();
    if (!userInput) return;

    const userMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      const botMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, there was a problem. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  React.useEffect(() => {
    if (!isOpen && location.pathname === "/") {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (
          lastMsg &&
          lastMsg.role === "assistant" &&
          lastMsg.content === "Hi. May I help you?"
        ) {
          return prev;
        }
        return [...prev, { role: "assistant", content: "Hi. May I help you?" }];
      });
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (location.pathname === "/") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return isOpen ? (
    <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-xl border border-gray-300 z-50 w-80 max-h-[80vh] flex flex-col">
      <div
        className="flex items-center justify-between px-4 py-2 bg-red-600 text-white rounded-t-xl cursor-pointer shadow-md"
        onClick={() => setIsOpen(false)}
      >
        <MessageCircle className="h-8 w-8 text-white" />
        <span className="text-sm font-semibold">GoBot</span>
        {isOpen ? <FaChevronDown /> : <FaChevronUp />}
      </div>

      <div className="px-3 py-2 space-y-2 border-b">
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q)}
            className="w-full text-left text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-end space-x-2 max-w-[80%]">
              {msg.role === "assistant" && (
                <FaRobot className="text-gray-500" />
              )}
              <div
                className={`px-3 py-2 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && <FaUser className="text-blue-500" />}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <FaRobot />
            <span>Typing...</span>
          </div>
        )}
      </div>

      <div className="flex border-t border-gray-200">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow p-2 text-sm outline-none"
          placeholder="Ask me anything..."
        />
        <button
          onClick={() => sendMessage()}
          className="px-4 bg-red-600 text-white text-sm rounded-tr-xl rounded-br-xl"
        >
          Send
        </button>
      </div>
    </div>
  ) : (
    <button
      className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl p-4 z-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400"
      onClick={() => setIsOpen(true)}
      aria-label="Open Chatbot"
    >
      <MessageCircle className="h-8 w-8" />
    </button>
  );
};

export default Chatbot;
