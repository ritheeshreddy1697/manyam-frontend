import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookingPay() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Fetch booking
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(setBooking)
      .catch(() => alert("Failed to load booking"));
  }, [bookingId]);

  const payNow = async () => {
    try {
      setLoading(true);

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

      const order = await res.json();

      if (!order.id) {
        alert("Failed to create payment order");
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Manyam Tourism",
        description: "Hotel Booking",
        order_id: order.id,

        handler: async function (response) {
          try {
            setVerifying(true);

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

            const result = await verifyRes.json();

            // 🔥 ALWAYS navigate using backend-confirmed bookingId
            navigate(`/booking/success/${result.bookingId}`);
          } catch {
            alert("Payment verification failed");
            setLoading(false);
            setVerifying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Payment initiation failed");
      setLoading(false);
    }
  };

  if (!booking) {
    return <p className="p-10 text-center">Loading booking...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Overlay Loader */}
      {(loading || verifying) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white px-8 py-6 rounded-xl text-center shadow-xl">
            <div className="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="font-semibold text-gray-700">
              {verifying ? "Verifying payment..." : "Opening payment..."}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Confirm Payment</h1>

        <p className="mb-6 text-lg font-semibold">
          Amount: ₹{booking.amount}
        </p>

        <button
          onClick={payNow}
          disabled={loading || verifying}
          className="bg-green-700 text-white px-6 py-3 rounded-xl w-full disabled:bg-gray-400"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}