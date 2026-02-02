import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Booking() {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/hotels")
      .then(res => res.json())
      .then(setHotels);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-green-700">
        Book Your Stay
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map(hotel => (
          <div
            key={hotel._id}
            className="border rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* IMAGE */}
            <img
              src={hotel.image || "https://source.unsplash.com/400x300/?hotel"}
              alt={hotel.name}
              className="h-48 w-full object-cover"
            />

            {/* CONTENT */}
            <div className="p-5">
              <h2 className="text-xl font-semibold">{hotel.name}</h2>
              <p className="text-gray-600 text-sm">{hotel.location}</p>

              <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                {hotel.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-green-700">
                  ₹{hotel.price || 1000}/night
                </span>

                <button
                  onClick={() => navigate(`/booking/${hotel._id}`)}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
                >
                  View & Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
