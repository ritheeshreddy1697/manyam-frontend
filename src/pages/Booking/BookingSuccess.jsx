import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookingSuccess() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/booking/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (res.status === 401 || res.status === 403) {
          setError("Unauthorized access to booking");
          return;
        }

        if (!res.ok) {
          setError("Failed to load booking details");
          return;
        }

        const data = await res.json();
        setBooking(data);
      } catch (err) {
        setError("Network error while loading booking");
      }
    };

    fetchBooking();
  }, [bookingId]);

  /* 🔴 ERROR STATE */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  /* ⏳ LOADING */
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4
            border-green-700 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Loading confirmation...
          </p>
        </div>
      </div>
    );
  }

  /* ✅ SUCCESS */
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl w-full text-center">
        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-3xl font-bold text-green-700">
          Booking Confirmed
        </h1>

        <p className="mt-2 text-gray-600">
          Your stay has been successfully booked.
        </p>

        <div className="mt-6 text-left space-y-2">
          <p><b>Booking ID:</b> {booking._id}</p>
          <p><b>Hotel:</b> {booking.hotelId?.name}</p>
          <p><b>Location:</b> {booking.hotelId?.location}</p>
          <p>
            <b>Check-in:</b>{" "}
            {new Date(booking.checkIn).toLocaleDateString()}
          </p>
          <p>
            <b>Check-out:</b>{" "}
            {new Date(booking.checkOut).toLocaleDateString()}
          </p>
          <p>
            <b>Status:</b>{" "}
            <span className="text-green-700 font-semibold">
              PAID
            </span>
          </p>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          📧 Receipt sent to your email.
        </p>

        <button
          onClick={() => navigate("/my-bookings")}
          className="mt-6 bg-green-700 text-white px-6 py-3 rounded-xl
            hover:bg-green-800 transition"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
}