import { createElement } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  ArrowUp,
} from "lucide-react";

const _MOTION = motion;

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden text-slate-200">
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#0b1a12,#122a1e_42%,#123825)]" />
      <div className="absolute -top-24 right-12 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 text-center leading-relaxed">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Toll Free No:{" "}
          <span className="text-white font-semibold">1800-425-31111</span>{" "}
          (Within India only)
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-2 text-slate-300"
        >
          Department of Tourism, Government of Andhra Pradesh,{" "}
          <br className="sm:hidden" />
          Parvathipuram Manyam District
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-2 text-slate-300"
        >
          Email: <span className="text-white">tourism-manyam@gov.in</span>
        </motion.p>
      </div>

      {/* DIVIDER */}
      <div className="relative border-t border-white/10" />

      {/* BOTTOM LINKS */}
      <div className="relative max-w-7xl mx-auto px-6 py-6 text-center">
        <p className="mb-4 text-slate-300">
          © {new Date().getFullYear()} Parvathipuram Manyam Tourism. All rights reserved.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-slate-400">
          <span className="hover:text-white cursor-pointer transition">Copyright</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer transition">Terms of Use</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer transition">Contact Us</span>
        </div>
      </div>

      {/* SOCIAL ICONS */}
      <div className="relative flex justify-center gap-4 pb-12">
        {[
          { icon: Facebook, label: "Facebook" },
          { icon: Instagram, label: "Instagram" },
          { icon: Twitter, label: "Twitter / X" },
          { icon: Youtube, label: "YouTube" },
          { icon: Linkedin, label: "LinkedIn" },
        ].map(({ icon, label }, index) => (
          <motion.a
            key={index}
            href="#"
            aria-label={label}
            whileHover={{ y: -3, scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white/10 ring-1 ring-white/15 flex items-center justify-center
              hover:bg-white/20 transition"
          >
            {createElement(icon, { size: 18, className: "text-slate-100" })}
          </motion.a>
        ))}
      </div>

      {/* BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute right-6 bottom-6 bg-white text-emerald-800 p-3 rounded-xl shadow-lg
          hover:-translate-y-0.5 transition"
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
