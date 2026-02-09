import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { waterfallsData } from "../../data/waterfallsData";
import { viewpointsData } from "../../data/viewpointsData";
import { festivalsData } from "../../data/festivalsData";

/* 🔥 SAME HERO, GALLERY, LIGHTBOX CODE AS WATERFALLS */

export default function AttractionDetails({ type }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState(null);

  let data = [];

  if (type === "waterfalls") data = waterfallsData;
  if (type === "viewpoints") data = viewpointsData;
  if (type === "festivals") data = festivalsData;

  const item = data.find((i) => i.slug === slug);
  if (!item) return <div className="pt-24 text-center">Not found</div>;

  /* 🔥 heroImages, slideshow, gallery SAME AS WATERFALL */

  return (
    <>
      {/* COPY–PASTE FULL WaterfallDetails JSX HERE */import { useParams, useNavigate } from "react-router-dom";
      import { useState, useEffect } from "react";
      import { waterfallsData } from "../../data/waterfallsData";
      
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
      export default function WaterfallDetails() {
        const { slug } = useParams();
        const navigate = useNavigate();
        const item = waterfallsData.find((w) => w.slug === slug);
      
        if (!item) return <div className="pt-24 text-center">Not found</div>;
      
        /* 🔥 FORCE HERO SLIDESHOW TO WORK */
        const heroImages =
          item.gallery?.photos?.length > 1
            ? item.gallery.photos
            : [item.image, item.image, item.image];
      
        return (
          <section className="pt-16 pb-20 bg-gray-50">
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
      
              {/* HERO SLIDESHOW */}
              <HeroSlideshow
                images={heroImages}
                latitude={item.latitude}
                longitude={item.longitude}
                onBook={() => navigate("/booking")}
              />
      
              {/* QUICK INFO */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Info label="Category" value="Waterfall" />
                <Info label="Best Time" value="Monsoon & Winter" />
                <Info label="Distance" value={item.howToReach?.distance} />
                <Info label="District" value="Manyam" />
              </div>
      
              {/* ABOUT */}
              <div>
                <h2 className="text-xl font-semibold mb-2">About</h2>
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
      }
    </>
  );
}
