import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { templesData } from "../../data/templesData";

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
      {/* SLIDES */}
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

      {/* SUBTLE BOTTOM GRADIENT */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

      {/* FLOATING BUTTONS */}
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

      {/* DOTS */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full
              ${i === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function TempleDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const item = templesData.find((w) => w.slug === slug);

  if (!item) return <div className="pt-24 text-center">Not found</div>;

  /* 🔥 FORCE HERO SLIDESHOW TO WORK */
  const heroImages =
    item.gallery?.photos?.length > 1
      ? item.gallery.photos
      : [item.image, item.image, item.image];

  return (
    <section className="pt-16 pb-20 attractions-page-bg">
      <div className="max-w-5xl mx-auto px-4 space-y-12">

        {/* TITLE */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            {item.name}
          </h1>
          <p className="text-gray-600 mt-1">
            📍 {item.location || "Parvathipuram Manyam District"}
          </p>
        </div>

        {/* HERO SLIDESHOW */}
        <HeroSlideshow
          images={heroImages}
          latitude={item.latitude}
          longitude={item.longitude}
          onBook={() => navigate("/booking")}
        />

        {/* QUICK INFO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
          <Info label="Category" value="Temple" />
          <Info label="Best Time" value="Monsoon & Winter" />
          <Info label="Distance" value={item.howToReach?.distance} />
          <Info label="District" value="Manyam" />
        </div>

        {/* ABOUT */}
        <div className="animate-fade-in-up" style={{ animationDelay: "180ms" }}>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-700 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* HOW TO REACH */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: "240ms" }}>
          <h2 className="text-xl font-semibold mb-4">How to Reach</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReachCard title="🚗 By Road" value={item.howToReach?.road} />
            <ReachCard title="🚆 By Train" value={item.howToReach?.rail} />
            <ReachCard title="✈️ By Air" value={item.howToReach?.air} />
            <ReachCard title="📏 Distance" value={item.howToReach?.distance} />
          </div>
        </div>

        {/* MAP */}
        <div className="rounded-2xl overflow-hidden shadow animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <iframe
            title={item.name}
            src={`https://www.google.com/maps?q=${item.latitude},${item.longitude}&output=embed`}
            className="w-full h-72"
            loading="lazy"
          />
        </div>
{/* ================= CONTACT & ASSISTANCE ================= */}
<div className="
  relative overflow-hidden
  rounded-2xl p-6 md:p-8
  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
  text-white shadow-2xl
">

  {/* subtle background glow */}
  <div className="absolute -top-16 -right-16 w-48 h-48
                  bg-green-600/20 blur-3xl rounded-full" />
  <div className="absolute -bottom-16 -left-16 w-48 h-48
                  bg-blue-600/20 blur-3xl rounded-full" />

  <div className="relative z-10">
    {/* Heading */}
    <h3 className="text-xl font-semibold tracking-tight mb-2">
      Travel Assistance & Support
    </h3>

    <p className="text-sm text-gray-300 max-w-2xl mb-6 leading-relaxed">
      Need help with travel routes, best visiting time, accommodation,
      or local guidance? Our tourism support team is here to assist you.
    </p>

    {/* ACTIONS */}
    <div className="grid sm:grid-cols-2 gap-4">
      
      {/* CALL */}
      <a
        href="tel:+919999999999"
        className="
          group flex items-center justify-between
          px-6 py-4 rounded-xl
          bg-white/10 backdrop-blur-md
          border border-white/20
          hover:bg-white/20 hover:border-white/40
          transition-all duration-300
        "
      >
        <div>
          <p className="text-sm font-semibold">Call Tourism Support</p>
          <p className="text-xs text-gray-300">+91 99999 99999</p>
        </div>

        <span className="text-2xl group-hover:scale-110 transition">
          📞
        </span>
      </a>

      {/* EMAIL */}
      <a
        href="mailto:manyamtourism@gmail.com"
        className="
          group flex items-center justify-between
          px-6 py-4 rounded-xl
          bg-white/10 backdrop-blur-md
          border border-white/20
          hover:bg-white/20 hover:border-white/40
          transition-all duration-300
        "
      >
        <div>
          <p className="text-sm font-semibold">Email Tourism Office</p>
          <p className="text-xs text-gray-300">manyamtourism@gmail.com</p>
        </div>

        <span className="text-2xl group-hover:scale-110 transition">
          ✉️
        </span>
      </a>

    </div>
  </div>
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
