import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-sm relative">

      {/* TOP INFO */}
      <div className="max-w-7xl mx-auto px-6 py-10 text-center leading-relaxed">
        <p>
          Toll Free No: <span className="text-gray-200">1800-425-31111</span> (Within India only)
        </p>

        <p className="mt-2">
          Department of Tourism, Government of Andhra Pradesh, <br className="sm:hidden" />
          Parvathipuram Manyam District
        </p>

        <p className="mt-2">
          Email:{" "}
          <span className="text-gray-200">
            tourism-manyam@gov.in
          </span>
        </p>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/10"></div>

      {/* BOTTOM LINKS */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-center">
        <p className="mb-4">
          © {new Date().getFullYear()} Parvathipuram Manyam Tourism. All rights reserved.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-gray-400">
          <span className="hover:text-white cursor-pointer">Copyright</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Terms of Use</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Contact Us</span>
        </div>
      </div>

      {/* SOCIAL ICONS */}
      <div className="flex justify-center gap-4 pb-10">
        {[
          { icon: Facebook, label: "Facebook" },
          { icon: Instagram, label: "Instagram" },
          { icon: Twitter, label: "Twitter / X" },
          { icon: Youtube, label: "YouTube" },
          { icon: Linkedin, label: "LinkedIn" },
        ].map(({ icon: Icon, label }, index) => (
          <a
            key={index}
            href="#"
            aria-label={label}
            className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center
              hover:bg-[#2a2a2a] transition"
          >
            <Icon size={18} className="text-gray-300" />
          </a>
        ))}
      </div>

      {/* BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute right-6 bottom-6 bg-yellow-500 hover:bg-yellow-600
          text-black p-3 rounded-md transition"
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
