import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { festivalsData } from "../../data/festivalsData";

/* ================= HERO SLIDESHOW ================= */
function HeroSlideshow({ images, latitude, longitude, onBook }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow h-[280px] md:h-[420px]">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover hero-move
            transition-opacity duration-1000
            ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="absolute bottom-4 right-4 flex gap-3">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="backdrop-blur-md bg-white/20 border border-white/40
                     text-white px-5 py-2.5 rounded-full text-sm font-semibold
                     hover:bg-white/30 transition"
        >
          🧭 Directions
        </a>

        <button
          onClick={onBook}
          className="backdrop-blur-md bg-green-700/60 border border-white/40
                     text-white px-5 py-2.5 rounded-full text-sm font-semibold
                     hover:bg-green-700/80 transition"
        >
          🏨 Book Stay
        </button>
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function FestivalDetails() {
  const { slug } = useParams();               // ✅ slug FIXED
  const navigate = useNavigate();

  const item = festivalsData.find((f) => f.slug === slug);

  if (!item) {
    return <div className="pt-24 text-center">Festival not found</div>;
  }

  const heroImages =
    item.gallery?.photos?.length > 1
      ? item.gallery.photos
      : [item.image, item.image];

  return (
    <section className="pt-16 pb-20 attractions-page-bg">
      <div className="max-w-5xl mx-auto px-4 space-y-12">

        {/* TITLE */}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            {item.name}
          </h1>
          <p className="text-gray-600 mt-1">
            📍 {item.location || "Parvathipuram Manyam District"}
          </p>
        </div>

        {/* HERO */}
        <HeroSlideshow
          images={heroImages}
          latitude={item.latitude}
          longitude={item.longitude}
          onBook={() => navigate("/booking")}
        />

        {/* QUICK INFO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Info label="Category" value="Festival" />
          <Info label="Festival Time" value={item.bestTime} />
          <Info label="Location" value={item.location} />
          <Info label="District" value="Manyam" />
        </div>

        {/* ABOUT */}
        <div>
          <h2 className="text-xl font-semibold mb-2">About the Festival</h2>
          <p className="text-gray-700 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* HOW TO REACH */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">How to Reach</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReachCard title="🚗 By Road" value={item.howToReach?.road} />
            <ReachCard title="🚆 By Train" value={item.howToReach?.rail} />
            <ReachCard title="✈️ By Air" value={item.howToReach?.air} />
            <ReachCard title="📏 Distance" value={item.howToReach?.distance} />
          </div>
        </div>

        {/* MAP */}
        <div className="rounded-2xl overflow-hidden shadow">
          <iframe
            title={item.name}
            src={`https://www.google.com/maps?q=${item.latitude},${item.longitude}&output=embed`}
            className="w-full h-72"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}

/* ================= SMALL COMPONENTS ================= */
function Info({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ReachCard({ title, value }) {
  return (
    <div className="border rounded-xl p-4 hover:shadow-md transition">
      <p className="font-semibold text-gray-900 mb-1">{title}</p>
      <p className="text-sm text-gray-600">
        {value || "Information available locally"}
      </p>
    </div>
  );
}
