import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { buildApiUrl } from "../../utils/apiUrl";

export default function BookingPay() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Fetch booking
  useEffect(() => {
    const bookingUrl = buildApiUrl(`/api/booking/${encodeURIComponent(bookingId)}`);
    if (!bookingUrl) {
      alert("Invalid API URL configuration");
      return;
    }

    fetch(bookingUrl, {
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

    const orderUrl = buildApiUrl("/api/payment/order");
    if (!orderUrl) {
      alert("Invalid API URL configuration");
      setLoading(false);
      return;
    }

    const res = await fetch(orderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ bookingId })
    });

    const order = await res.json();

    if (!order?.id) {
      alert("Payment order failed");
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

      handler: async (response) => {
        try {
          setVerifying(true);

          const verifyUrl = buildApiUrl("/api/payment/verify");
          if (!verifyUrl) throw new Error("Invalid API URL configuration");

          const verifyRes = await fetch(verifyUrl, {
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

          const data = await verifyRes.json();

          if (!verifyRes.ok) throw new Error();

          navigate(`/booking/success/${data.bookingId}`);
        } catch {
          alert("Payment verified but UI failed. Check My Bookings.");
          navigate("/my-bookings");
        } finally {
          setLoading(false);
          setVerifying(false);
        }
      },

      modal: {
        ondismiss: () => {
          setLoading(false);
          setVerifying(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);

    // 🔴 HANDLE PAYMENT FAILURE
    rzp.on("payment.failed", () => {
      alert("Payment failed or cancelled");
      setLoading(false);
      setVerifying(false);
    });

    rzp.open();

  } catch {
    alert("Payment init error");
    setLoading(false);
    setVerifying(false);
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
