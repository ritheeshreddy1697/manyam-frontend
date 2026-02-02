import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookingPay() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [paying, setPaying] = useState(false);

  // 🔹 Fetch booking
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

        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        alert("Failed to load booking");
        navigate("/my-bookings");
      } finally {
        setLoadingBooking(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  // 🔹 Payment
  const payNow = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    try {
      setPaying(true);

      // 1️⃣ Create order
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ bookingId })
        }
      );

      if (!res.ok) throw new Error("Order creation failed");

      const order = await res.json();

      // 2️⃣ Razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Manyam Tourism",
        description: "Hotel Booking",
        order_id: order.id,

        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                  ...response,
                  bookingId
                })
              }
            );

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            navigate(`/booking/success/${bookingId}`);
          } catch (err) {
            alert("Payment successful but verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            setPaying(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Payment failed. Try again.");
      setPaying(false);
    }
  };

  // 🔹 Loading states
  if (loadingBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading booking details...
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Confirm Payment</h1>

        <p className="text-gray-600 mb-2">
          Hotel: <b>{booking.hotelId?.name}</b>
        </p>

        <p className="text-lg font-semibold mb-6">
          Amount: ₹{booking.amount}
        </p>

        <button
          onClick={payNow}
          disabled={paying}
          className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400
                     text-white px-6 py-3 rounded-xl w-full transition"
        >
          {paying ? "Opening payment..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}