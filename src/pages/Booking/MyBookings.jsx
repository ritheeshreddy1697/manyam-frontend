import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const downloadReceipt = async (id) => {
    try {
      setDownloadingId(id);

      const res = await fetch(
        `http://localhost:5000/api/booking/${id}/receipt`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!res.ok) {
        alert("Unauthorized or receipt not found");
        setDownloadingId(null);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      setDownloadingId(null);
    } catch (err) {
      alert("Failed to download receipt");
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/my-bookings", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ================= PAGE LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-10 h-10 border-4 border-green-600
            border-t-transparent rounded-full animate-spin"></div>
          <p>Loading your bookings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        My Bookings
      </h1>

      {bookings.length === 0 && (
        <div className="bg-white shadow rounded-xl p-8 text-center text-gray-600">
          No bookings yet. Book your stay to see them here.
        </div>
      )}

      <div className="grid gap-6">
        {bookings.map(b => (
          <div
            key={b._id}
            className="bg-white rounded-2xl shadow-md p-6
              flex flex-col md:flex-row justify-between gap-6
              hover:shadow-lg transition"
          >
            {/* LEFT */}
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {b.hotelId?.name}
              </h2>

              <p className="text-sm text-gray-500">
                📍 {b.hotelId?.location}
              </p>

              <p className="text-sm mt-2">
                📅{" "}
                {new Date(b.checkIn).toLocaleDateString()} →{" "}
                {new Date(b.checkOut).toLocaleDateString()}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Booking ID: {b._id}
              </p>

              {/* DOWNLOAD BUTTON */}
              {b.status === "paid" && (
                <button
                  onClick={() => downloadReceipt(b._id)}
                  disabled={downloadingId === b._id}
                  className="mt-3 text-sm text-green-700 font-medium underline
                    disabled:text-gray-400"
                >
                  {downloadingId === b._id
                    ? "Downloading…"
                    : "Download Receipt (PDF)"}
                </button>
              )}
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-start md:items-end justify-between">
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold
                  ${
                    b.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {b.status.toUpperCase()}
              </span>

              <p className="mt-4 text-lg font-bold text-gray-800">
                ₹ {b.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}