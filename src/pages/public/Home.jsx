import { Link } from "react-router-dom";

import useCounter from "../../hooks/useCounter";
import useParallax from "../../hooks/useParallax";
import useScrollAnimation from "../../hooks/useScrollAnimation";

import { attractionsData } from "../../data/attractionsData";

import heroImg from "../../assets/images/hero.jpeg";
import collectorImg from "../../assets/images/collector.jpg";

export default function Home() {
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const parallaxOffset = useParallax(0.4);

  const waterfalls = useCounter(20, aboutVisible);
  const temples = useCounter(50, aboutVisible);
  const spots = useCounter(100, aboutVisible);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: `url(${heroImg})`,
            transform: `translateY(${parallaxOffset}px)`,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 h-full flex items-center justify-center text-white text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Explore the Beauty of Manyam
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Hills • Forests • Waterfalls • Tribal Culture
            </p>

            <Link
              to="/attractions"
              className="inline-block bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
            >
              Explore Attractions
            </Link>
          </div>
        </div>
         {/* Scroll Indicator (Arrow) */}
<a
  href="#about"
  className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white opacity-80 hover:opacity-100 transition"
>
  <span className="text-sm mb-2 tracking-wide">
    Scroll Down
  </span>

  <svg
    className="w-8 h-8 animate-arrow-bounce"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 9l-7 7-7-7"
    />
  </svg>
</a>

      </section>

      {/* ================= ABOUT ================= */}
       <section
  id="about"
  ref={aboutRef}
  className={`py-24 px-6 bg-gray-50 border-t border-gray-200
    ${aboutVisible ? "scroll-show" : "scroll-hidden"}
  `}
>
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

    {/* LEFT: TEXT CONTENT */}
    <div className="lg:col-span-7 lg:pl-6">
      <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-3">
        About Parvathipuram Manyam
      </h2>

      <div className="w-16 h-1 bg-green-600 mb-6"></div>

      <p className="text-gray-600 mb-4 leading-relaxed">
        Parvathipuram Manyam district is one of the most scenic and culturally
        rich regions of Andhra Pradesh. Surrounded by lush green hills,
        waterfalls, forests, ancient temples, and vibrant tribal communities,
        the district offers a perfect blend of nature, culture, and heritage.
      </p>

      <p className="text-gray-600 mb-8 leading-relaxed">
        Manyam is emerging as an important eco-tourism and spiritual destination,
        attracting visitors who seek peace, adventure, and cultural experiences.
      </p>

      {/* STATS */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
  <div>
    <h3 className="text-2xl font-bold text-green-700">
      {waterfalls}+
    </h3>
    <p className="text-sm text-gray-500">Waterfalls</p>
  </div>

  <div>
    <h3 className="text-2xl font-bold text-green-700">
      {temples}+
    </h3>
    <p className="text-sm text-gray-500">Temples</p>
  </div>

  <div>
    <h3 className="text-2xl font-bold text-green-700">
      {spots}+
    </h3>
    <p className="text-sm text-gray-500">Tourist Spots</p>
  </div>

  <div>
    <h3 className="text-2xl font-bold text-green-700">
      Rich
    </h3>
    <p className="text-sm text-gray-500">Tribal Culture</p>
  </div>
</div>

    </div>

    {/* RIGHT: COLLECTOR CARD */}
<div className="lg:col-span-5 flex justify-start">
  <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">

    <img
      src={collectorImg}
      alt="District Collector"
      className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-green-600 transition hover:scale-105"
    />

    <h3 className="text-xl font-bold mt-4">
      District Collector
    </h3>

    <p className="text-gray-600">
      Parvathipuram Manyam District
    </p>

    <p className="text-sm text-gray-500 mt-3 italic">
      “Committed to promoting sustainable tourism while preserving
      the natural and cultural heritage of Manyam.”
    </p>
  </div>
</div>


  </div>
</section>
      {/* ================= ATTRACTIONS ================= */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-12">
            Top Attractions
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {attractionsData.slice(0, 4).map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                </div>

                <div className="p-5 text-center">
                  <h3 className="font-bold">{item.title}</h3>
                  <span className="text-green-700 text-sm mt-2 inline-block">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
