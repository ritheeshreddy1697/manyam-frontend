import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const _MOTION = motion;

export default function PageWrapper({ children }) {
  const location = useLocation();

  // Home page should NOT have top padding
  const isHome = location.pathname === "/";

  return (
    <main className={`${isHome ? "" : "pt-24"} relative overflow-x-hidden`}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 right-0 w-[22rem] h-[22rem] rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-[18rem] h-[18rem] rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 w-[20rem] h-[20rem] rounded-full bg-teal-300/18 blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
