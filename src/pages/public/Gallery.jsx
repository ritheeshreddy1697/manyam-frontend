import { useState, useEffect, useMemo } from "react";

import gallery1 from "../../assets/images/gallery/gallery1.jpeg";
import gallery2 from "../../assets/images/gallery/gallery2.jpeg";
import gallery3 from "../../assets/images/gallery/gallery3.jpeg";
import gallery4 from "../../assets/images/gallery/gallery4.jpeg";
import gallery5 from "../../assets/images/gallery/gallery5.jpeg";
import gallery6 from "../../assets/images/gallery/gallery6.jpeg";
import gallery7 from "../../assets/images/gallery/gallery7.jpeg";
import gallery8 from "../../assets/images/gallery/gallery8.jpeg";
import { buildApiUrl } from "../../utils/apiUrl";
import {
  getAttractionPhotoStyle,
  getAttractionPhotoUrl,
  normalizeAttractionPhoto,
} from "../../utils/attractionMedia";

const fallbackPhotos = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
].map((photo) => normalizeAttractionPhoto(photo)).filter(Boolean);

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [photos, setPhotos] = useState(fallbackPhotos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activePhotos = useMemo(
    () => (photos.length > 0 ? photos : fallbackPhotos),
    [photos]
  );

  /* ESC key close */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i === activePhotos.length - 1 ? 0 : i + 1));
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i === 0 ? activePhotos.length - 1 : i - 1));
    };

    if (activeIndex !== null && activePhotos.length > 0) {
      window.addEventListener("keydown", handleKey);
    }

    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, activePhotos.length]);

  /* Load from API */
  useEffect(() => {
    const url = buildApiUrl("/api/attractions/media?category=gallery");
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load gallery photos.");

        const data = await response.json();
        const mediaDocs = Array.isArray(data) ? data : data ? [data] : [];
        const apiPhotos = mediaDocs
          .flatMap((doc) => Array.isArray(doc.photos) ? doc.photos : [])
          .map(normalizeAttractionPhoto)
          .filter(Boolean);

        setPhotos(apiPhotos.length > 0 ? apiPhotos : fallbackPhotos);
      } catch {
        setPhotos(fallbackPhotos);
        setError("Could not load latest gallery photos. Showing defaults.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <section className="section-top pb-16 px-6 gallery-page-bg">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-4 text-green-700 text-center animate-fade-in">
          📸 Manyam Tourism Gallery
        </h1>

        <p className="text-gray-600 mb-10 text-center animate-fade-in" style={{ animationDelay: "120ms" }}>
          Explore waterfalls, temples, festivals and viewpoints
        </p>

        {/* ================= MASONRY ================= */}
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
          {activePhotos.map((photo, i) => (
            <button
              key={photo.publicId || photo.url || i}
              onClick={() => setActiveIndex(i)}
              className="
                mb-4 w-full text-left
                break-inside-avoid
                overflow-hidden rounded-2xl
                shadow-md
                animate-card
                focus:outline-none
              "
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={getAttractionPhotoUrl(photo)}
                alt={`Gallery ${i + 1}`}
                style={getAttractionPhotoStyle(photo)}
                className="
                  w-full object-cover
                  hover:scale-110
                  transition duration-500
                "
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {/* ================= LIGHTBOX ================= */}
        {activeIndex !== null && activePhotos.length > 0 && (
          <div
            className="
              fixed inset-0 z-[999]
              bg-black/90
              flex items-center justify-center
              px-4
            "
            onClick={() => setActiveIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-6 text-white text-3xl"
              onClick={() => setActiveIndex(null)}
            >
              ×
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 md:left-8 text-white text-4xl"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(
                  activeIndex === 0 ? images.length - 1 : activeIndex - 1
                );
              }}
            >
              ‹
            </button>

            {/* Image */}
            <img
              src={getAttractionPhotoUrl(activePhotos[activeIndex])}
              alt=""
              style={getAttractionPhotoStyle(activePhotos[activeIndex])}
              className="
                max-h-[90vh] max-w-[90vw]
                rounded-xl shadow-2xl
                animate-scaleIn
              "
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              className="absolute right-4 md:right-8 text-white text-4xl"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(
                  activeIndex === activePhotos.length - 1 ? 0 : activeIndex + 1
                );
              }}
            >
              ›
            </button>
          </div>
        )}

        {error && (
          <p className="mt-6 text-center text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            {error}
          </p>
        )}

        {loading && (
          <p className="mt-6 text-center text-sm text-slate-600">Loading latest photos...</p>
        )}

      </div>
    </section>
  );
}
