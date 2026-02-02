import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import useParallax from "../../hooks/useParallax";
import { templesData } from "../../data/templesData";
const item = templesData.find((t) => t.slug === slug);

export default function WaterfallDetails() {
  const { slug } = useParams();
  const waterfall = waterfallsData.find((w) => w.slug === slug);

  const parallaxOffset = useParallax(0.25);
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const [reachRef, reachVisible] = useScrollAnimation();

  const photos = waterfall?.gallery?.photos || [];
  const videos = waterfall?.gallery?.videos || [];

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);

  /* ================= KEYBOARD CONTROLS ================= */
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, photos.length]);

  if (!waterfall) {
    return <div className="pt-32 text-center">Waterfall not found</div>;
  }

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative h-[75vh] min-h-[520px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: `url(${waterfall.image})`,
            transform: `translateY(${parallaxOffset}px)`,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 h-full flex items-center justify-center text-white text-center px-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {waterfall.name}
            </h1>
            <p className="opacity-90 text-lg">
              Parvathipuram Manyam District
            </p>
          </div>
        </div>
      </section>

      {/* ================= INFO STRIP ================= */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <h4 className="font-semibold">Best Time</h4>
            <p className="text-sm text-gray-600">July – December</p>
          </div>
          <div>
            <h4 className="font-semibold">Type</h4>
            <p className="text-sm text-gray-600">Natural Waterfall</p>
          </div>
          <div>
            <h4 className="font-semibold">District</h4>
            <p className="text-sm text-gray-600">Parvathipuram Manyam</p>
          </div>
          <div>
            <h4 className="font-semibold">Distance</h4>
            <p className="text-sm text-gray-600">
              {waterfall.howToReach.distance}
            </p>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        ref={aboutRef}
        className={`py-24 px-6 max-w-6xl mx-auto
          ${aboutVisible ? "scroll-show" : "scroll-hidden"}
        `}
      >
        <span className="text-sm uppercase tracking-wider text-green-700 font-semibold">
          Overview
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-3">
          About the Waterfall
        </h2>
        <div className="w-16 h-1 bg-green-700 mb-6"></div>

        <p className="text-gray-600 leading-relaxed max-w-4xl mb-6">
          {waterfall.description}
        </p>

        <Link
          to="/booking"
          className="inline-block bg-green-700 text-white px-10 py-4 rounded-xl
            font-semibold text-lg shadow-lg hover:bg-green-800 transition"
        >
          Book Your Stay Near This Location
        </Link>
      </section>

      {/* ================= LOCATION ================= */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm uppercase tracking-wider text-green-700 font-semibold">
            Map
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-3">
            Location
          </h2>
          <div className="w-16 h-1 bg-green-700 mb-6"></div>

          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              title={waterfall.name}
              src={`https://www.google.com/maps?q=${waterfall.latitude},${waterfall.longitude}&t=k&z=15&output=embed`}
              className="w-full h-80"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ================= HOW TO REACH ================= */}
      <section
        ref={reachRef}
        className={`py-24 px-6 max-w-6xl mx-auto
          ${reachVisible ? "scroll-show" : "scroll-hidden"}
        `}
      >
        <span className="text-sm uppercase tracking-wider text-green-700 font-semibold">
          Travel Info
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-3">
          How to Reach
        </h2>
        <div className="w-16 h-1 bg-green-700 mb-10"></div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ["By Road", waterfall.howToReach.road],
            ["By Rail", waterfall.howToReach.rail],
            ["By Air", waterfall.howToReach.air],
            ["Distance", waterfall.howToReach.distance],
          ].map(([title, value], i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border hover:shadow-lg transition"
            >
              <h4 className="font-semibold mb-2">{title}</h4>
              <p className="text-sm text-gray-600">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PHOTOS & VIDEOS ================= */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm uppercase tracking-wider text-green-700 font-semibold">
            Media
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-3">
            Photos & Videos
          </h2>
          <div className="w-16 h-1 bg-green-700 mb-8"></div>

          {/* Photos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {photos.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                onClick={() => setLightboxIndex(index)}
                className="h-44 w-full object-cover rounded-xl cursor-pointer
                  hover:scale-105 transition shadow"
              />
            ))}
          </div>

          {/* Videos */}
          {videos.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-6">
              {videos.map((v, i) =>
                v.type === "youtube" ? (
                  <iframe
                    key={i}
                    src={v.url}
                    className="w-full h-64 rounded-xl shadow"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={i}
                    src={v.url}
                    controls
                    className="w-full h-64 rounded-xl shadow"
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================= STICKY BOOK CTA ================= */}
      <div className="sticky bottom-0 bg-white border-t shadow-xl z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold">
            Planning to visit {waterfall.name}?
          </span>

          <Link
            to="/booking"
            className="bg-green-700 text-white px-8 py-4 rounded-xl
              font-semibold text-lg shadow-lg ring-4 ring-green-200
              hover:bg-green-800 transition"
          >
            Book Your Stay
          </Link>
        </div>
      </div>

      {/* ================= LIGHTBOX ================= */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center px-4"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (diff > 50)
              setLightboxIndex((i) =>
                i === photos.length - 1 ? 0 : i + 1
              );
            if (diff < -50)
              setLightboxIndex((i) =>
                i === 0 ? photos.length - 1 : i - 1
              );
            setTouchStartX(null);
          }}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl"
            onClick={() => setLightboxIndex(null)}
          >
            ×
          </button>

          <img
            src={photos[lightboxIndex]}
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
