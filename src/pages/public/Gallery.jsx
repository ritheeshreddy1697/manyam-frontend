import { useState, useEffect } from "react";

import gallery1 from "../../assets/images/gallery1.jpeg";
import gallery2 from "../../assets/images/gallery2.jpeg";
import gallery3 from "../../assets/images/gallery3.jpeg";
import gallery4 from "../../assets/images/gallery4.jpeg";
import gallery5 from "../../assets/images/gallery5.jpeg";
import gallery6 from "../../assets/images/gallery6.jpeg";
import gallery7 from "../../assets/images/gallery7.jpeg";
import gallery8 from "../../assets/images/gallery8.jpeg";

const images = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);

  /* ESC key close */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    };

    if (activeIndex !== null) {
      window.addEventListener("keydown", handleKey);
    }

    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  return (
    <section className="section-top pb-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-4 text-green-700 text-center">
          📸 Manyam Tourism Gallery
        </h1>

        <p className="text-gray-600 mb-10 text-center">
          Explore waterfalls, temples, festivals and viewpoints
        </p>

        {/* ================= MASONRY ================= */}
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
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
                src={img}
                alt={`Gallery ${i + 1}`}
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
        {activeIndex !== null && (
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
              src={images[activeIndex]}
              alt=""
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
                  activeIndex === images.length - 1 ? 0 : activeIndex + 1
                );
              }}
            >
              ›
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
