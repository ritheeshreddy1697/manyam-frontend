import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import useCounter from "../../hooks/useCounter";
import useParallax from "../../hooks/useParallax";
import useScrollAnimation from "../../hooks/useScrollAnimation";

import { attractionsData } from "../../data/attractionsData";

import heroImg from "../../assets/images/public/hero.jpeg";
import collectorImg from "../../assets/images/public/collector.jpg";

const _MOTION = motion;

export default function Home() {
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const parallaxOffset = useParallax(0.4);

  const waterfalls = useCounter(20, aboutVisible);
  const temples = useCounter(50, aboutVisible);
  const spots = useCounter(100, aboutVisible);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: `url(${heroImg})`,
            transform: `translateY(${parallaxOffset}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/75" />
        <div className="absolute top-24 -left-20 w-72 h-72 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="absolute bottom-14 -right-16 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 min-h-screen flex items-center justify-center text-white text-center px-4"
        >
          <div className="max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.6 }}
              className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
            >
              Andhra Pradesh Tourism Hub
            </motion.span>

            <h1 className="display-heading mt-6 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Explore the Beauty of Manyam
            </h1>

            <p className="text-lg md:text-2xl mt-4 mb-10 text-white/85">
              Hills • Forests • Waterfalls • Tribal Culture
            </p>

            <Link
              to="/attractions"
              className="inline-block rounded-full px-8 py-4 font-semibold btn-ghost"
            >
              Explore Attractions
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator (Arrow) */}
        <a
          href="#about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/90 hover:text-white transition"
        >
          <span className="text-sm mb-2 tracking-[0.22em] uppercase">
            Scroll
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
        className={`py-24 px-6 ${aboutVisible ? "scroll-show" : "scroll-hidden"}`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: TEXT CONTENT */}
          <div className="lg:col-span-7 lg:pl-6">
            <h2 className="display-heading text-3xl md:text-5xl font-bold text-emerald-800 mb-3">
              About Parvathipuram Manyam
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-emerald-700 to-emerald-400 mb-6 rounded-full" />

            <p className="text-slate-600 mb-4 leading-relaxed text-lg">
              Parvathipuram Manyam district is one of the most scenic and
              culturally rich regions of Andhra Pradesh. Surrounded by lush
              green hills, waterfalls, forests, ancient temples, and vibrant
              tribal communities, the district offers a perfect blend of nature,
              culture, and heritage.
            </p>

            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              Manyam is emerging as an important eco-tourism and spiritual
              destination, attracting visitors who seek peace, adventure, and
              cultural experiences.
            </p>

            {/* STATS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: `${waterfalls}+`, label: "Waterfalls" },
                { value: `${temples}+`, label: "Temples" },
                { value: `${spots}+`, label: "Tourist Spots" },
                { value: "Rich", label: "Tribal Culture" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="soft-panel rounded-2xl p-4 text-center"
                >
                  <h3 className="text-2xl font-bold text-emerald-700">
                    {item.value}
                  </h3>
                  <p className="text-sm text-slate-500">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: COLLECTOR CARD */}
          <div className="lg:col-span-5 flex justify-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-panel rounded-3xl p-8 text-center max-w-md w-full"
            >
              <img
                src={collectorImg}
                alt="District Collector"
                className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-emerald-600 transition hover:scale-105"
              />

              <h3 className="display-heading text-2xl font-bold mt-5">
                District Collector
              </h3>

              <p className="text-slate-600 mt-1">
                Parvathipuram Manyam District
              </p>

              <p className="text-sm text-slate-500 mt-4 italic leading-relaxed">
                “Committed to promoting sustainable tourism while preserving the
                natural and cultural heritage of Manyam.”
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= ATTRACTIONS ================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="display-heading text-3xl md:text-5xl font-bold text-emerald-800 text-center mb-12"
          >
            Top Attractions
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {attractionsData.slice(0, 4).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Link
                  to={item.link}
                  className="group block soft-panel rounded-2xl overflow-hidden transition hover:-translate-y-1"
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="display-heading font-semibold text-slate-800">
                      {item.title}
                    </h3>
                    <span className="text-emerald-700 text-sm mt-2 inline-block font-medium">
                      View Details →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
