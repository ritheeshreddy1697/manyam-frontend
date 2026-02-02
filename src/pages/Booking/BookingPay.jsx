import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookingPay() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setBooking);
  }, [bookingId]);

  const payNow = async () => {
    setLoading(true);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ bookingId })
    });

    const order = await res.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "Manyam Tourism",
      description: "Hotel Booking",
      order_id: order.id,
      handler: async function (response) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            ...response,
            bookingId
          })
        });

        navigate(`/booking/success/${bookingId}`);
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  if (!booking) return <p className="p-10">Loading booking...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Confirm Payment</h1>
        <p className="mb-4">Amount: ₹{booking.amount}</p>

        <button
          onClick={payNow}
          disabled={loading}
          className="bg-green-700 text-white px-6 py-3 rounded-xl w-full"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}