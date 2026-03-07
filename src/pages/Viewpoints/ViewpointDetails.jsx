import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { viewpointsData } from "../../data/viewpointsData";
import { useAttractionItemMedia } from "../../hooks/useAttractionMedia";
import {
  getAttractionPhotoStyle,
  getAttractionPhotoUrl,
  mergeAttractionItem,
} from "../../utils/attractionMedia";

/* ================= HERO SLIDESHOW ================= */
function HeroSlideshow({ images, latitude, longitude, onBook }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow h-[280px] md:h-[420px]">
      {images.map((img, i) => (
        <img
          key={i}
          src={getAttractionPhotoUrl(img)}
          alt=""
          style={getAttractionPhotoStyle(img)}
          className={`absolute inset-0 w-full h-full object-cover hero-move
            transition-opacity duration-1000
            ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* gradient */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

      {/* overlay buttons */}
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

      {/* dots */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function ViewPointDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const baseItem = viewpointsData.find((v) => v.slug === slug);
  const { media } = useAttractionItemMedia("viewpoints", slug);
  const item = mergeAttractionItem(baseItem, media);

  const [lightbox, setLightbox] = useState(null);

  if (!item) return <div className="pt-24 text-center">View Point not found</div>;

  const heroImages =
    item.gallery?.photos?.length > 1
      ? item.gallery.photos
      : [item.coverPhoto || item.image, item.coverPhoto || item.image].filter(Boolean);

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

        {/* HERO */}
        <HeroSlideshow
          images={heroImages}
          latitude={item.latitude}
          longitude={item.longitude}
          onBook={() => navigate("/booking")}
        />

        {/* QUICK INFO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
          <Info label="Category" value="View Point" />
          <Info label="Best Time" value={item.bestTime || "All Seasons"} />
          <Info label="Distance" value={item.howToReach?.distance} />
          <Info label="District" value="Manyam" />
        </div>

        {/* ABOUT */}
        <div className="animate-fade-in-up" style={{ animationDelay: "180ms" }}>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-700 leading-relaxed">{item.description}</p>
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
{/* ================= ACTIONS & CONTACT ================= */}
<div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6 animate-fade-in-up" style={{ animationDelay: "360ms" }}>

  {/* ACTION BUTTONS */}
  <div className="grid sm:grid-cols-2 gap-4">
    <a
      href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-2
                 rounded-xl px-6 py-4
                 border border-blue-600 text-blue-700
                 bg-blue-50/60 backdrop-blur
                 font-semibold text-lg
                 hover:bg-blue-600 hover:text-white
                 transition-all duration-300"
    >
      <span className="text-xl">🧭</span>
      <span>Get Directions</span>
    </a>

    <button
      onClick={() => navigate("/booking")}
      className="group flex items-center justify-center gap-2
                 rounded-xl px-6 py-4
                 bg-green-700 text-white
                 font-semibold text-lg
                 shadow-md
                 hover:bg-green-800
                 hover:shadow-lg
                 transition-all duration-300"
    >
      <span className="text-xl">🏨</span>
      <span>Book Stay Nearby</span>
    </button>
  </div>

  {/* CONTACT INFO */}
  <div className="border-t pt-5 grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
    <div>
      <p className="font-semibold text-gray-900">Tourism Office</p>
      <p>District Tourism Office</p>
      <p>Parvathipuram Manyam</p>
    </div>

    <div>
      <p>
        <span className="font-semibold">Email:</span>{" "}
        <a
          href="mailto:tourism.manyam@ap.gov.in"
          className="text-green-700 hover:underline"
        >
          tourism.manyam@ap.gov.in
        </a>
      </p>
      <p>
        <span className="font-semibold">Phone:</span> +91 9XXXXXXXXX
      </p>
    </div>
  </div>

</div>

        {/* GALLERY */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "420ms" }}>
          <h2 className="text-xl font-semibold">Gallery</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {heroImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox({ type: "image", index: i })}
                className="relative overflow-hidden rounded-xl group"
              >
                <img
                  src={getAttractionPhotoUrl(img)}
                  alt=""
                  style={getAttractionPhotoStyle(img)}
                  className="w-full h-40 object-cover
                             transition-transform duration-500
                             group-hover:scale-110"
                />
              </button>
            ))}

            {item.gallery?.videos?.map((v, i) => (
              <button
                key={i}
                onClick={() => setLightbox({ type: "video", id: v.id })}
                className="relative overflow-hidden rounded-xl bg-black
                           flex items-center justify-center"
              >
                <img
                  src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                  className="w-full h-40 object-cover opacity-80"
                />
                <span className="absolute text-white text-4xl">▶</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[999] bg-black/90
                     flex items-center justify-center px-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>

          {lightbox.type === "image" && (
            <img
              src={getAttractionPhotoUrl(heroImages[lightbox.index])}
              className="max-h-[90vh] max-w-[90vw]
                         rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {lightbox.type === "video" && (
            <iframe
              src={`https://www.youtube.com/embed/${lightbox.id}`}
              allowFullScreen
              className="w-full max-w-4xl h-[220px] sm:h-[420px]
                         rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
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
