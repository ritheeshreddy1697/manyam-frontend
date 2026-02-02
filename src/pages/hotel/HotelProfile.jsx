import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HotelProfile() {
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [rooms, setRooms] = useState([]);
  const [images, setImages] = useState([]);

  // Room form
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hotel/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setHotel(data);
        setName(data.name || "");
        setLocation(data.location || "");
        setDescription(data.description || "");
        setRooms(data.rooms || []);
        setImages(data.images || []);
      });
  }, []);

  const uploadImage = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      "http://localhost:5000/api/hotel/upload-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      }
    );

    const data = await res.json();
    setImages([...images, data.url]);
  };

  const saveProfile = async () => {
    const res = await fetch("http://localhost:5000/api/hotel/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        name,
        location,
        description,
        rooms,
        images
      })
    });

    const data = await res.json();
    setHotel(data);
    setImages(data.images || []);

    alert("✅ Hotel profile saved");
  };

  const addRoom = () => {
    if (!type || !price || !total) return;
    setRooms([...rooms, { type, price: +price, total: +total }]);
    setType("");
    setPrice("");
    setTotal("");
  };

  const deleteRoom = i => {
    setRooms(rooms.filter((_, idx) => idx !== i));
  };

  if (!hotel) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-700">
          Hotel Profile
        </h1>
        <button
          onClick={() => navigate("/hotel/dashboard")}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Dashboard
        </button>
      </div>

      {/* BASIC INFO */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Hotel Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {/* IMAGES */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-3">Hotel Images</h2>
        <div className="flex gap-3 flex-wrap mb-4">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-32 h-24 object-cover rounded"
            />
          ))}
        </div>
        <input type="file" onChange={uploadImage} />
      </div>

      {/* ROOMS */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-3">Rooms</h2>
        {rooms.map((r, i) => (
          <div key={i} className="flex justify-between text-sm mb-2">
            <span>{r.type}</span>
            <span>₹{r.price}</span>
            <span>{r.total}</span>
            <button
              onClick={() => deleteRoom(i)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        ))}

        <div className="grid grid-cols-3 gap-2 mt-3">
          <input
            placeholder="Type"
            value={type}
            onChange={e => setType(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Total"
            type="number"
            value={total}
            onChange={e => setTotal(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={addRoom}
          className="mt-3 bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>
      </div>

      <button
        onClick={saveProfile}
        className="bg-green-700 text-white px-6 py-3 rounded-xl"
      >
        Save All Changes
      </button>
    </div>
  );
}
