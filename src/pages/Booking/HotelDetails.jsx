import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HotelDetailsSkeleton from "../../components/HotelDetailsSkeleton";

export default function HotelDetails() {
  const { id: hotelId } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);

  // Guest info
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");

  // Booking info
  const [roomType, setRoomType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/hotels")
      .then(res => res.json())
      .then(data => {
        const h = data.find(x => x._id === hotelId);
        setHotel(h);
      });
  }, [hotelId]);

  if (!hotel) return <HotelDetailsSkeleton />;

  // ✅ SAFE IMAGE HANDLING
  const validImages =
    hotel.images?.filter(img => img.startsWith("http")) || [];

  const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];

  const bookHotel = async () => {
    if (!localStorage.getItem("token")) {
  navigate("/login");
  return;
}
  if (!guestName || !phone || !roomType || !checkIn || !checkOut) {
    alert("Please fill all details");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        hotelId,
        roomType,
        checkIn,
        checkOut
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Booking failed");
      setLoading(false);
      return;
    }

    // 🔥 smooth transition
    navigate(`/booking/pay/${data._id}`);

  } catch (err) {
    alert("Something went wrong");
    setLoading(false);
  }
};

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* IMAGE */}
      <img
        src={
          validImages.length > 0
            ? validImages[0]
            : "https://source.unsplash.com/1200x500/?hotel,resort"
        }
        alt={hotel.name}
        className="w-full h-72 object-cover rounded-2xl shadow"
      />

      <div className="grid md:grid-cols-2 gap-10 mt-10">
        {/* LEFT */}
        <div>
          <h1 className="text-3xl font-bold text-green-700">
            {hotel.name}
          </h1>
          <p className="text-gray-600">{hotel.location}</p>

          <p className="mt-4 text-gray-700">
            {hotel.description}
          </p>

          <h3 className="mt-6 font-semibold">Room Types</h3>

          {rooms.length === 0 ? (
            <p className="text-sm text-red-500 mt-2">
              No rooms configured by hotel
            </p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {rooms.map(r => (
                <li key={r._id}>
                  {r.type} — ₹{r.price} ({r.total} rooms)
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT – BOOKING CARD */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Guest Details
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 rounded mb-3"
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-full border p-2 rounded mb-4"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <h2 className="text-xl font-semibold mb-3">
            Booking Details
          </h2>

          <select
            className="w-full border p-2 rounded mb-3"
            value={roomType}
            onChange={e => setRoomType(e.target.value)}
          >
            <option value="">Select Room Type</option>
            {rooms.map(r => (
              <option key={r._id} value={r.type}>
                {r.type} – ₹{r.price}
              </option>
            ))}
          </select>

          <input
  type="date"
  className="w-full border p-2 rounded mb-3"
  value={checkIn}
  min={new Date().toISOString().split("T")[0]}
  onChange={e => setCheckIn(e.target.value)}
/>

<input
  type="date"
  className="w-full border p-2 rounded mb-4"
  value={checkOut}
  min={checkIn}
  onChange={e => setCheckOut(e.target.value)}
/>

          <button
            onClick={bookHotel}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white bg-green-700 hover:bg-green-800 disabled:bg-gray-400"
          >
            {loading ? "Creating booking..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
