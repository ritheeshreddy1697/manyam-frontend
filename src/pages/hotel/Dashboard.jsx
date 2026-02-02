import { useEffect, useState } from "react";

export default function HotelDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
function exportCSV(bookings) {
  const headers = ["Booking ID", "Guest Email", "Check-in", "Check-out", "Status"];
  const rows = bookings.map(b => [
    b._id,
    b.userEmail,
    b.checkIn,
    b.checkOut,
    b.status
  ]);

  const csv =
    [headers, ...rows]
      .map(r => r.join(","))
      .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "hotel-bookings.csv";
  a.click();
}

  useEffect(() => {
    fetch("http://localhost:5000/api/hotel/bookings", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      });
  }, []);

  const totalBookings = bookings.length;
  const paidBookings = bookings.filter(b => b.status === "paid").length;
  const pendingBookings = totalBookings - paidBookings;

  if (loading) {
    return <p className="p-10">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        Hotel Dashboard
      </h1>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Bookings" value={totalBookings} />
        <StatCard title="Paid Bookings" value={paidBookings} green />
        <StatCard title="Pending Bookings" value={pendingBookings} yellow />
      </div>
<button
  onClick={() => exportCSV(bookings)}
  className="mb-4 bg-green-700 text-white px-4 py-2 rounded-lg"
>
  Export Bookings (CSV)
</button>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-4 text-left">Booking ID</th>
              <th className="p-4 text-left">Guest</th>
              <th className="p-4 text-left">Check-in</th>
              <th className="p-4 text-left">Check-out</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="border-b">
                <td className="p-4">{b._id}</td>
                <td className="p-4">{b.userEmail}</td>
                <td className="p-4">{b.checkIn}</td>
                <td className="p-4">{b.checkOut}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        b.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {b.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="p-6 text-gray-600">No bookings yet.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, green, yellow }) {
  return (
    <div
      className={`rounded-2xl p-6 shadow bg-white
        ${green ? "border-l-4 border-green-600" : ""}
        ${yellow ? "border-l-4 border-yellow-500" : ""}
      `}
    >
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
