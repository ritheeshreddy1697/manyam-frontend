import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const confirmBooking = async (id) => {
    await fetch(
      `http://localhost:5000/api/bookings/admin/confirm/${id}`,
      { method: "PUT" }
    );
    fetchBookings();
  };

  return (
    <div className="min-h-screen pt-24 px-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white rounded shadow p-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-semibold">Booking ID: {b._id}</p>
              <p>Status: {b.status}</p>
              <p>Amount: ₹{b.amount}</p>
            </div>

            {b.status === "PAID" && (
              <button
                onClick={() => confirmBooking(b._id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
