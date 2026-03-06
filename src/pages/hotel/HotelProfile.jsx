import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EMPTY_HOTEL_PROFILE = {
  name: "",
  location: "",
  description: "",
  rooms: [],
  images: [],
};

export default function HotelProfile() {
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [rooms, setRooms] = useState([]);
  const [images, setImages] = useState([]);

  // New room form
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState("");

  const applyProfileData = (data) => {
    const normalized = {
      ...EMPTY_HOTEL_PROFILE,
      ...(data || {}),
    };

    setHotel(normalized);
    setName(normalized.name || "");
    setLocation(normalized.location || "");
    setDescription(normalized.description || "");
    setRooms(Array.isArray(normalized.rooms) ? normalized.rooms : []);
    setImages(Array.isArray(normalized.images) ? normalized.images : []);
  };

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      const localDraft = (() => {
        try {
          return JSON.parse(localStorage.getItem("hotel_profile_draft") || "null");
        } catch {
          return null;
        }
      })();

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch hotel profile");
        }

        const data = await res.json();
        if (!mounted) return;

        applyProfileData(data);
        setLoadError("");
      } catch {
        if (!mounted) return;

        applyProfileData(localDraft || EMPTY_HOTEL_PROFILE);
        setLoadError(
          "Server profile could not be loaded. You can still fill details and save."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/upload-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (data?.url) {
      setImages((prev) => [...prev, data.url]);
    }
  };

  const saveProfile = async () => {
    const payload = {
      name,
      location,
      description,
      rooms,
      images,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await res.json();
      applyProfileData(data);
      localStorage.setItem("hotel_profile_draft", JSON.stringify(data));
      setLoadError("");

      alert("✅ Hotel details saved");
    } catch {
      localStorage.setItem("hotel_profile_draft", JSON.stringify(payload));
      applyProfileData(payload);
      setLoadError(
        "Server save failed. Details are saved locally in this browser."
      );
      alert("Saved locally. Server update failed.");
    }
  };

  const addRoom = () => {
    if (!type || !price || !total) return;

    setRooms((prev) => [
      ...prev,
      { type, price: Number(price), total: Number(total) },
    ]);

    setType("");
    setPrice("");
    setTotal("");
  };

  const deleteRoom = (index) => {
    setRooms((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateRoomValue = (index, field, value) => {
    setRooms((prev) =>
      prev.map((room, idx) =>
        idx === index
          ? {
              ...room,
              [field]: Number(value),
            }
          : room
      )
    );
  };

  const totalRoomsCount = rooms.reduce(
    (sum, room) => sum + (Number(room.total) || 0),
    0
  );

  if (loading) return <p className="p-6">Loading...</p>;
  if (!hotel) return <p className="p-6">Could not load profile.</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-700">
            Add / Update Hotel Details
          </h1>
          <p className="text-slate-600 mt-1">
            Add room photos, set cost per 12hr, and manage room vacancies.
          </p>
        </div>

        <button
          onClick={() => navigate("/hotel/dashboard")}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>

      {loadError && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadError}
        </div>
      )}

      {/* BASIC INFO */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-3">Hotel Information</h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Hotel Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* ROOM PHOTOS */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-3">Room Photos</h2>
        <div className="flex gap-3 flex-wrap mb-4">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Room ${i + 1}`}
              className="w-36 h-24 object-cover rounded"
            />
          ))}
        </div>
        <input type="file" onChange={uploadImage} />
      </div>

      {/* ROOMS + VACANCIES */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-3">Rooms, Cost & Vacancies</h2>
        <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p className="font-semibold">
            Total No. of Rooms in Hotel: {totalRoomsCount}
          </p>
          <p className="mt-1 text-emerald-700">
            Use "Rooms Available" to update room count whenever vacancies change.
          </p>
        </div>

        {rooms.length === 0 && (
          <p className="text-sm text-slate-600 mb-3">
            No rooms added yet.
          </p>
        )}

        <div className="space-y-3">
          {rooms.map((room, index) => (
            <div
              key={`${room.type}-${index}`}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 border rounded-lg p-3"
            >
              <div>
                <p className="text-xs text-slate-500">Room Type</p>
                <p className="font-semibold text-slate-800">{room.type}</p>
              </div>

              <label className="text-sm">
                <span className="block text-xs text-slate-500 mb-1">Cost per 12hr</span>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={room.price}
                  onChange={(e) => updateRoomValue(index, "price", e.target.value)}
                />
              </label>

              <label className="text-sm">
                <span className="block text-xs text-slate-500 mb-1">Rooms Available</span>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={room.total}
                  onChange={(e) => updateRoomValue(index, "total", e.target.value)}
                />
              </label>

              <div className="flex items-end">
                <button
                  onClick={() => deleteRoom(index)}
                  className="text-red-600 text-sm"
                >
                  Delete Room
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
          <input
            placeholder="Room Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Cost / 12hr"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Rooms Available"
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={addRoom}
          className="mt-3 bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>

        <button
          onClick={saveProfile}
          className="mt-3 ml-3 bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Update Rooms Available
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={saveProfile}
          className="bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Save Hotel Details
        </button>
      </div>
    </div>
  );
}
