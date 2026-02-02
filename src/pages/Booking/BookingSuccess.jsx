import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookingSuccess() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setBooking)
      .catch(() => {
        // fallback so UI never hangs
        setBooking({ _id: bookingId });
      });
  }, [bookingId]);

  if (!booking) return <p className="p-10">Loading confirmation...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl w-full text-center">
        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-3xl font-bold text-green-700">
          Booking Confirmed
        </h1>

        <p className="mt-2 text-gray-600">
          Payment successful. Receipt sent to your email.
        </p>

        <p className="mt-4">
          <b>Booking ID:</b> {booking._id}
        </p>

        <button
          onClick={() => (window.location.href = "/my-bookings")}
          className="mt-6 bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
}