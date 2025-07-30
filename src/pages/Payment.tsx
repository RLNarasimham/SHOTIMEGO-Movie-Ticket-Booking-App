import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  collection,
  addDoc,
} from "firebase/firestore";

interface BookingData {
  bookingId: string;
  movieId: string;
  showTimeId: string;
  movieTitle: string;
  showTime: string;
  theater: string;
  selectedSeats: string[];
  totalAmount: number;
  seats: { id: string; type: string; price: number }[];
  userId: string;
  status: string;
  createdAt: any;
  expiresAt: any;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, cb: (response: any) => void) => void;
    };
  }
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const { currentUser } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookingData = async () => {
      if (!bookingId || !currentUser) {
        setError("Invalid booking or user session");
        setLoading(false);
        return;
      }

      try {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        const pendingBookingRef = doc(db, "pendingBookings", bookingId);
        const bookingSnap = await getDoc(pendingBookingRef);

        if (!bookingSnap.exists()) {
          setError("Booking not found or has expired");
          setLoading(false);
          return;
        }

        const booking = bookingSnap.data() as BookingData;

        if (booking.userId !== currentUser.uid) {
          setError("Unauthorized access to booking");
          setLoading(false);
          return;
        }

        const now = new Date();
        const expiresAt = booking.expiresAt.toDate();
        if (now > expiresAt) {
          setError("Booking has expired. Please book again.");

          await deleteDoc(pendingBookingRef);
          setLoading(false);
          return;
        }

        if (booking.status !== "pending") {
          setError("Booking is no longer available");
          setLoading(false);
          return;
        }

        setBookingData(booking);
        setLoading(false);

        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
      } catch (error) {
        console.error("Error loading booking data:", error);
        setError("Failed to load booking data");
        setLoading(false);
      }
    };

    loadBookingData();
  }, [bookingId, currentUser]);

  const handlePayment = async () => {
    if (!bookingData || !currentUser) return;
    setPaymentLoading(true);

    // Ensure Razorpay script is loaded
    if (!window.Razorpay) {
      alert("Payment gateway failed to load. Please try again later.");
      setPaymentLoading(false);
      return;
    }

    const options: RazorpayOptions = {
      key: "rzp_test_CVzMi7VTAC9DC9",
      amount: bookingData.totalAmount * 100, // in paise
      currency: "INR",
      name: "SHOWTIMEGO",
      description: `${bookingData.movieTitle} - ${bookingData.showTime}`,
      image: "/vite.svg",
      prefill: {
        name: currentUser.displayName || "SHOWTIMEGO User",
        email: currentUser.email || "",
      },
      theme: {
        color: "#dc2626",
      },
      handler: async function (response: RazorpayResponse) {
        try {
          // 1) Mark seats booked
          const movieShowRef = doc(
            db,
            "bookings",
            `${bookingData.movieId}_${bookingData.showTimeId}`
          );
          const movieShowSnap = await getDoc(movieShowRef);
          const alreadyBooked: string[] = movieShowSnap.exists()
            ? (movieShowSnap.data() as any).bookedSeats || []
            : [];

          // 2) Check conflict
          if (
            bookingData.selectedSeats.some((s) => alreadyBooked.includes(s))
          ) {
            alert(
              "Some of your seats have just been taken by someone else. Please try booking again."
            );
            await deleteDoc(doc(db, "pendingBookings", bookingData.bookingId));
            navigate("/");
            return;
          }

          // 3) Update bookedSeats
          if (!movieShowSnap.exists()) {
            await setDoc(movieShowRef, {
              bookedSeats: bookingData.selectedSeats,
            });
          } else {
            await updateDoc(movieShowRef, {
              bookedSeats: arrayUnion(...bookingData.selectedSeats),
            });
          }

          // 4) Move pending → confirmed
          const confirmedBooking = {
            ...bookingData,
            paymentId: response.razorpay_payment_id,
            status: "confirmed",
            confirmedAt: new Date(),
          };
          await addDoc(collection(db, "confirmedBookings"), confirmedBooking);

          // 5) Create receipt
          const receipt = {
            id: `receipt_${Date.now()}`,
            bookingId: bookingData.bookingId,
            userId: currentUser.uid,
            movieTitle: bookingData.movieTitle,
            showTime: bookingData.showTime,
            showDate: bookingData.showDate,
            theater: bookingData.theater,
            seats: bookingData.selectedSeats,
            totalAmount: bookingData.totalAmount,
            paymentId: response.razorpay_payment_id,
            generatedAt: new Date(),
          };
          await addDoc(collection(db, "receipts"), receipt);

          // 6) Delete pending booking
          await deleteDoc(doc(db, "pendingBookings", bookingData.bookingId));

          setPaymentSuccess(true);
          setTimeout(() => navigate("/bookings"), 3000);
        } catch (err) {
          console.error("Error finalizing payment:", err);
          alert(
            "Oops, something went wrong finalizing your booking. Please contact support."
          );
        } finally {
          setPaymentLoading(false);
        }
      },
    };

    // Instantiate Razorpay
    try {
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (resp: any) => {
        console.error("Razorpay failure:", resp.error);
        alert(`Payment failed: ${resp.error.description || resp.error.reason}`);
        setPaymentLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay open error:", err);
      alert("Unable to open payment gateway. Please try again later.");
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-300 text-lg font-medium">
          Loading booking details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error}
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your booking has been confirmed. You will receive a confirmation
            email shortly.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to your bookings...
          </p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Booking Data Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
            <p className="text-red-100">Secure payment powered by Razorpay</p>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Booking Summary
              </h2>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {bookingData.movieTitle}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Theater:
                    </span>
                    <p className="font-medium dark:text-white text-black">
                      {bookingData.theater}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Show Time:
                    </span>
                    <p className="font-medium dark:text-white text-black">
                      {bookingData.showTime}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Selected Seats:
                  </span>
                  <p className="font-medium dark:text-white text-black">
                    {bookingData.selectedSeats.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Details
              </h2>

              <div className="space-y-3 dark:text-white text-black">
                {bookingData.seats.map((seat, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      Seat {seat.id} ({seat.type})
                    </span>
                    <span>₹{seat.price}</span>
                  </div>
                ))}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total Amount:</span>
                    <span>₹{bookingData.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                    Secure Payment
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your payment is secured with 256-bit SSL encryption. We
                    never store your card details.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>
                {paymentLoading
                  ? "Processing..."
                  : `Pay ₹${bookingData.totalAmount}`}
              </span>
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              By proceeding, you agree to our Terms & Conditions and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
