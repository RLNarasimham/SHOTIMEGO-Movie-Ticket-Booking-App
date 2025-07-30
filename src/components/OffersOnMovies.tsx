import React, { useState } from "react";

const movieOffers = [
  {
    id: 1,
    title: "Buy 1 Get 1 Free",
    description: "Use HDFC Credit Cards",
    image:
      "https://prodcdn.wishfin.com/media/images/hdfc-bank-credit-car-1712586871.jpg",
    validTill: "Valid till 31st Dec 2025",
  },
  {
    id: 2,
    title: "Flat ₹50 Cashback",
    description: "With Paytm Wallet on first booking",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.-PpGCBUYfLGbhzZsM8ahRQHaDi?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    validTill: "Valid once per user",
  },
  {
    id: 3,
    title: "50% Off with Times Card",
    description: "Enjoy movies at half price every Friday",
    image:
      "https://media.istockphoto.com/id/530965093/photo/up-to-50-off-3d-render-red-word-isolated.jpg?b=1&s=170667a&w=0&k=20&c=sitP27-P05pwZER97_rVXKeOPVrAKGgM9eAg1E-l3Dg=",
    validTill: "Limited period offer",
  },
  {
    id: 4,
    title: "Diwali Dhamaka Offer",
    description: "Get ₹200 off on every movie ticket this Diwali!",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.aB67736qkZJu_eaopBytxgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    validTill: "Valid till 15th Nov 2025",
  },
];

const OffersOnMovies = () => {
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedOfferId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="w-full md:px-8 dark:bg-gray-900 min-h-screen"
      style={{ paddingTop: "10rem", paddingBottom: "5rem" }}
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Movie Offers 🎟️
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {movieOffers.map((offer) => {
          const isSelected = selectedOfferId === offer.id;
          return (
            <div
              key={offer.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border-2 ${
                isSelected ? "border-red-500" : "border-transparent"
              }`}
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-64 object-contain bg-white dark:bg-gray-800"
              />
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {offer.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {offer.description}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs italic">
                  {offer.validTill}
                </p>

                <button
                  onClick={() => handleSelect(offer.id)}
                  className={`mt-3 w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {isSelected ? "Unselect Offer" : "Select Offer"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedOfferId && (
        <div className="mt-10 text-center">
          <span className="text-green-600 dark:text-green-400 font-semibold text-lg">
            🎉 You selected:{" "}
            {movieOffers.find((offer) => offer.id === selectedOfferId)?.title}
          </span>
        </div>
      )}
    </div>
  );
};

export default OffersOnMovies;
