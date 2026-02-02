import { useState } from "react";

export default function HotelBookings() {
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem("bookings")) || []
  );

  const updateStatus = (id, status) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status } : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Hotel Bookings</h1>

      {bookings.map((b) => (
        <div key={b.id} className="border p-3 mb-2 rounded">
          <p>Hotel: {b.hotel}</p>
          <p>Status: {b.status}</p>

          <button
            className="bg-blue-600 text-white px-3 py-1 mr-2 rounded"
            onClick={() => updateStatus(b.id, "Confirmed")}
          >
            Confirm
          </button>
        </div>
      ))}
    </div>
  );
}
