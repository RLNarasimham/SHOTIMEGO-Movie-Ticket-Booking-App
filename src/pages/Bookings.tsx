import React, { useState, useEffect } from "react";
import { Ticket, Calendar, MapPin, Clock, Download, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { Receipt } from "../types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const Bookings: React.FC = () => {
  const { currentUser } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchReceipts = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, "receipts"),
        where("userId", "==", currentUser.uid),
        orderBy("generatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const userReceipts: Receipt[] = [];
      querySnapshot.forEach((doc) => {
        userReceipts.push(doc.data() as Receipt);
      });
      setReceipts(userReceipts);
      console.log(userReceipts);
    };
    fetchReceipts();
  }, [currentUser]);

  const getEventNameAndLabel = (receipt) => {
    // Movie case
    if (receipt.movieTitle) return ["Movie", receipt.movieTitle];
    // Concerts: field is "name"
    if (receipt.name) return ["Event", receipt.name];
    // Sports & Theatre/Arts: field is "title"
    if (receipt.title) return ["Event", receipt.title];
    return ["Event", "N/A"];
  };

  const downloadReceipt = async (receipt: Receipt) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("SHOWTIMEGO - BOOKING RECEIPT", 15, 18);

    const qrValue = `Booking ID: ${receipt.bookingId}\nMovie: ${
      receipt.movieTitle
    }\nShow Time: ${receipt.showTime}\nSeats: ${receipt.seats.join(", ")}`;
    const qrDataUrl = await QRCode.toDataURL(qrValue, {
      width: 100,
      margin: 1,
    });

    const qrWidth = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const qrX = (pageWidth - qrWidth) / 2;
    const qrY = 25;

    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrWidth, qrWidth);

    let contentY = qrY + qrWidth + 10;
    doc.setFontSize(12);
    doc.text(`Booking ID: ${receipt.bookingId}`, 15, contentY);
    contentY += 10;
    doc.text(`Receipt ID: ${receipt.id}`, 15, contentY);
    contentY += 10;

    const [label, eventName] = getEventNameAndLabel(receipt);
    doc.text(`${label}: ${eventName}`, 15, contentY);

    contentY += 10;
    doc.text(`Show Time: ${receipt.showTime}`, 15, contentY);
    contentY += 10;
    doc.text(`Show Date: ${receipt.showDate}`, 15, contentY);
    contentY += 10;
    doc.text(`Theater: ${receipt.theater}`, 15, contentY);
    contentY += 10;
    doc.text(`Seats: ${receipt.seats.join(", ")}`, 15, contentY);
    contentY += 10;
    doc.text(`Total Amount: Rs. ${receipt.totalAmount}`, 15, contentY);
    contentY += 10;
    doc.text(`Payment ID: ${receipt.paymentId}`, 15, contentY);

    let generatedAt = "";
    if (receipt.generatedAt?.seconds) {
      generatedAt = new Date(
        receipt.generatedAt.seconds * 1000
      ).toLocaleString();
    } else if (typeof receipt.generatedAt === "number") {
      generatedAt = new Date(receipt.generatedAt).toLocaleString();
    } else {
      generatedAt = String(receipt.generatedAt);
    }
    contentY += 10;
    doc.text(`Booking Date: ${generatedAt}`, 15, contentY);

    contentY += 10;
    doc.text("Thank you for choosing SHOWTIMEGO!", 15, contentY);
    contentY += 10;
    doc.text("For support, contact: support@showtimego.com", 15, contentY);

    doc.save(`receipt-${receipt.id}.pdf`);
  };

  if (receipts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            My Bookings
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Bookings Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You haven't made any bookings yet. Start by exploring our latest
              movies!
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Movies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14"
      style={{ paddingTop: "9.5rem" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Ticket className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Bookings
          </h1>
          <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm font-medium px-3 py-1 rounded-full">
            {receipts.length} booking{receipts.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-6">
          {receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {receipt.eventtype &&
                      receipt.eventtype.toLowerCase().includes("movie")
                        ? "Movie"
                        : "Event"}
                      : {receipt.movieTitle}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(
                            receipt.generatedAt.seconds * 1000
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{receipt.showTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{receipt.theater}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{receipt.totalAmount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {receipt.seats.length} seat
                      {receipt.seats.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Seats</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {receipt.seats.map((seat, index) => (
                        <span
                          key={index}
                          className="bg-red-100 dark:bg-red-900 dark:text-red-200 text-red-800 px-2 py-1 rounded text-sm font-medium"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Booking Details
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <div>Booking ID: {receipt.bookingId.split("_")[1]}</div>
                      <div>Payment ID: {receipt.paymentId.slice(-8)}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Status
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 dark:text-green-200 text-green-800">
                      Confirmed
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Booked on{" "}
                    {new Date(
                      receipt.generatedAt.seconds * 1000
                    ).toLocaleString()}
                  </div>

                  <button
                    onClick={() => downloadReceipt(receipt)}
                    className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
