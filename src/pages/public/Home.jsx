import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import useCounter from "../../hooks/useCounter";
import useParallax from "../../hooks/useParallax";
import useScrollAnimation from "../../hooks/useScrollAnimation";

import { attractionsData } from "../../data/attractionsData";

import heroImg from "../../assets/images/public/hero.jpeg";
import collectorImg from "../../assets/images/public/collector.jpg";

const _MOTION = motion;

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const parallaxOffset = useParallax(0.16, {
    disabled: shouldReduceMotion,
    minWidth: 1024,
  });

  const waterfalls = useCounter(20, aboutVisible);
  const temples = useCounter(50, aboutVisible);
  const spots = useCounter(100, aboutVisible);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center transform-gpu will-change-transform"
          style={{
            backgroundImage: `url(${heroImg})`,
            transform: `translate3d(0, ${parallaxOffset}px, 0) scale(1.1)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/55 to-black/75" />
        <div className="absolute top-24 -left-20 w-72 h-72 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="absolute bottom-14 -right-16 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7 }}
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center justify-center px-5 text-center text-white sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl pt-20 pb-16 sm:pb-20">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.05, duration: shouldReduceMotion ? 0 : 0.5 }}
              className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
            >
              Andhra Pradesh Tourism Hub
            </motion.span>

            <h1 className="display-heading mt-6 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Explore the Beauty of Manyam
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg md:text-xl">
              Hills • Forests • Waterfalls • Tribal Culture
            </p>

            <div className="mt-9">
              <Link
                to="/attractions"
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 font-semibold btn-ghost shadow-lg shadow-black/20"
              >
                Explore Attractions
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator (Arrow) */}
        <a
          href="#about"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center text-white/90 transition hover:text-white sm:flex"
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
        className={`px-5 py-16 sm:px-6 md:py-24 lg:px-8 ${aboutVisible ? "scroll-show" : "scroll-hidden"}`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* LEFT: TEXT CONTENT */}
          <div className="lg:col-span-7 lg:pr-4">
            <h2 className="display-heading mb-3 text-3xl font-bold text-emerald-800 md:text-5xl">
              About Parvathipuram Manyam
            </h2>

            <div className="mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400" />

            <p className="mb-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Parvathipuram Manyam district is one of the most scenic and
              culturally rich regions of Andhra Pradesh. Surrounded by lush
              green hills, waterfalls, forests, ancient temples, and vibrant
              tribal communities, the district offers a perfect blend of nature,
              culture, and heritage.
            </p>

            <p className="mb-8 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Manyam is emerging as an important eco-tourism and spiritual
              destination, attracting visitors who seek peace, adventure, and
              cultural experiences.
            </p>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
                  transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : index * 0.06 }}
                  className="soft-panel rounded-xl p-4 text-center md:p-5"
                >
                  <h3 className="text-2xl font-bold text-emerald-700 md:text-3xl">
                    {item.value}
                  </h3>
                  <p className="text-sm text-slate-500">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: COLLECTOR CARD */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
              className="glass-panel w-full max-w-md rounded-3xl p-7 text-center md:p-8"
            >
              <img
                src={collectorImg}
                alt="District Collector"
                loading="lazy"
                decoding="async"
                className="mx-auto h-36 w-36 rounded-full border-4 border-emerald-600 object-cover transition hover:scale-105 md:h-40 md:w-40"
              />

              <h3 className="display-heading mt-5 text-2xl font-bold">
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
      <section className="px-5 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            className="display-heading mb-4 text-center text-3xl font-bold text-emerald-800 md:text-5xl"
          >
            Top Attractions
          </motion.h2>

          <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600 md:mb-12">
            Handpicked destinations across waterfalls, temples, viewpoints, and
            local culture.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {attractionsData.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.06 }}
              >
                <Link
                  to={item.link}
                  className="group block h-full overflow-hidden rounded-2xl soft-panel transition hover:-translate-y-1"
                >
                  <div className="h-52 overflow-hidden md:h-56">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="display-heading font-semibold text-slate-800">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
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
