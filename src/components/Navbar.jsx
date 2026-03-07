import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/public/ap-logo.png";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const legacyUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const role = String(localStorage.getItem("role") || legacyUser.role || "")
    .trim()
    .toLowerCase();
  const hasHotelDashboardAccess = role === "hotel";
  const hasAdminDashboardAccess = role === "admin";
  const isLoggedIn = !!token && !!role;

  const [scrolled, setScrolled] = useState(false);

  // Desktop dropdowns
  const [attractionsOpen, setAttractionsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Mobile menu
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAttractionsOpen, setMobileAttractionsOpen] = useState(false);

  const attractionsRef = useRef(null);
  const profileRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const transparentHome = isHome && !scrolled;

  /* ===== Scroll effect ===== */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ===== Outside click (desktop dropdowns) ===== */
  useEffect(() => {
    const handleOutside = (e) => {
      if (attractionsRef.current && !attractionsRef.current.contains(e.target))
        setAttractionsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  /* ===== Close menus on route change ===== */
  useEffect(() => {
    queueMicrotask(() => {
      setAttractionsOpen(false);
      setProfileOpen(false);
      setMobileOpen(false);
      setMobileAttractionsOpen(false);
    });
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleBookStay = () => {
    navigate("/booking");
  };

  const handleDashboardOpen = () => {
    if (hasAdminDashboardAccess) {
      navigate("/admin/dashboard");
      return;
    }

    if (hasHotelDashboardAccess) {
      navigate("/hotel/dashboard");
    }
  };

  const dashboardLabel = hasAdminDashboardAccess
    ? "Admin Dashboard"
    : "Hotel Admin Dashboard";
  const showTopDashboardButton = hasAdminDashboardAccess || hasHotelDashboardAccess;

  const getNavLinkClass = (active) =>
    `nav-link pb-1 transition-colors ${active ? "nav-link-active font-semibold" : ""}`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        transparentHome ? "bg-transparent" : "bg-white/95 backdrop-blur shadow"
      }`}
    >
      {/* ================= DESKTOP HEADER ================= */}
      <div
        className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "py-2" : "py-5"
        }`}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="AP Logo"
            className={`transition-all duration-300 ${scrolled ? "h-10" : "h-16"}`}
          />
          <span
            className={`font-bold transition-all duration-300 ${
              transparentHome ? "text-2xl text-white" : "text-lg text-green-700"
            }`}
          >
            Manyam Tourism
          </span>
        </Link>

        {/* MOBILE HAMBURGER */}
        <button
          className={`md:hidden text-3xl ${
            transparentHome ? "text-white" : "text-green-700"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        {/* ================= DESKTOP MENU ================= */}
        <ul
          className={`hidden md:flex items-center gap-8 font-medium ${
            transparentHome ? "text-white" : "text-gray-800"
          }`}
        >
          <li>
            <Link to="/" className={getNavLinkClass(location.pathname === "/")}>
              Home
            </Link>
          </li>

          {/* Attractions */}
          <li ref={attractionsRef} className="relative">
            <button
              onClick={() => {
                setAttractionsOpen(!attractionsOpen);
                setProfileOpen(false);
              }}
              className={`${getNavLinkClass(
                location.pathname.startsWith("/attractions")
              )} flex items-center gap-1.5 px-1 py-1`}
              aria-haspopup="menu"
              aria-expanded={attractionsOpen}
            >
              <span>Attractions</span>
              <span
                className={`inline-block text-xs transition-transform ${
                  attractionsOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            <ul
              className={`absolute top-10 left-0 bg-white text-gray-800 rounded-md shadow-lg w-56 transition-all duration-300 origin-top ${
                attractionsOpen
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }`}
            >
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/attractions">All Attractions</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/attractions/temples">Temples</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/attractions/waterfalls">Waterfalls</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/attractions/viewpoints">View Points</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/attractions/festivals">Festivals</Link>
              </li>
            </ul>
          </li>

          <li>
            {showTopDashboardButton ? (
              <button
                onClick={handleDashboardOpen}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900
                  text-white font-semibold shadow-[0_10px_26px_rgba(15,23,42,0.45)]
                  border border-slate-300/20 ring-1 ring-slate-200/10
                  hover:-translate-y-0.5 hover:from-slate-700 hover:via-slate-700 hover:to-slate-800
                  hover:shadow-[0_14px_30px_rgba(15,23,42,0.55)] active:translate-y-0 transition-all duration-300"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={handleBookStay}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-700
                  text-white font-semibold shadow-[0_10px_26px_rgba(5,150,105,0.45)]
                  border border-emerald-200/35 ring-1 ring-emerald-300/20
                  hover:-translate-y-0.5 hover:from-emerald-500 hover:via-emerald-500 hover:to-green-600
                  hover:shadow-[0_14px_30px_rgba(5,150,105,0.55)] active:translate-y-0 transition-all duration-300"
              >
                Book Your Stay
              </button>
            )}
          </li>
          <li>
            <Link
              to="/gallery"
              className={getNavLinkClass(location.pathname === "/gallery")}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={getNavLinkClass(location.pathname === "/contact")}
            >
              Contact Us
            </Link>
          </li>

          {/* AUTH */}
          {!isLoggedIn ? (
            <li>
              <Link to="/login" className="px-4 py-2 rounded bg-green-700 text-white">
                Login
              </Link>
            </li>
          ) : (
            <li ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold"
              >
                {role.charAt(0).toUpperCase()}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  {role === "user" && (
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-3 text-slate-800 hover:bg-gray-100"
                    >
                      My Bookings
                    </Link>
                  )}

                  {hasHotelDashboardAccess && (
                    <>
                      <Link
                        to="/hotel/profile"
                        className="block px-4 py-3 text-slate-800 hover:bg-gray-100"
                      >
                        Hotel Profile
                      </Link>
                    </>
                  )}

                  {hasAdminDashboardAccess && (
                    <button
                      onClick={handleDashboardOpen}
                      className="w-full text-left px-4 py-3 text-slate-800 hover:bg-gray-100"
                    >
                      {dashboardLabel}
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <ul className="flex flex-col p-6 gap-4 font-medium text-gray-800">
            <Link to="/">Home</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/contact">Contact Us</Link>

            <button
              onClick={() => setMobileAttractionsOpen(!mobileAttractionsOpen)}
              className="flex w-full items-center justify-between"
            >
              <span>Attractions</span>
              <span>{mobileAttractionsOpen ? "▲" : "▼"}</span>
            </button>

            {mobileAttractionsOpen && (
              <div className="ml-4 flex flex-col gap-2 text-sm text-gray-600">
                <Link to="/attractions">All Attractions</Link>
                <Link to="/attractions/temples">Temples</Link>
                <Link to="/attractions/waterfalls">Waterfalls</Link>
                <Link to="/attractions/viewpoints">View Points</Link>
                <Link to="/attractions/festivals">Festivals</Link>
              </div>
            )}

            {showTopDashboardButton ? (
              <button
                onClick={handleDashboardOpen}
                className="w-full px-4 py-2 rounded bg-gradient-to-r from-slate-700 to-slate-900
                  text-white text-left font-semibold shadow-md shadow-slate-800/40"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={handleBookStay}
                className="w-full px-4 py-2 rounded bg-gradient-to-r from-emerald-600 to-green-700
                  text-white text-left font-semibold shadow-md shadow-emerald-700/30"
              >
                Book Your Stay
              </button>
            )}

            {!isLoggedIn ? (
              <Link to="/login" className="bg-green-700 text-white px-4 py-2 rounded text-center">
                Login
              </Link>
            ) : (
              <>
                {role === "user" && <Link to="/my-bookings">My Bookings</Link>}
                {(hasAdminDashboardAccess || hasHotelDashboardAccess) && (
                  <button onClick={handleDashboardOpen} className="text-left">
                    {dashboardLabel}
                  </button>
                )}
                <button onClick={handleLogout} className="text-red-600 text-left">
                  Logout
                </button>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
