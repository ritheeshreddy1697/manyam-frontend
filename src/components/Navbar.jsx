

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/ap-logo.png";

export default function Navbar() {
  const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
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

  // Role
  

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
    setAttractionsOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
    setMobileAttractionsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleBookStay = () => {
    if (role === "user") navigate("/booking");
    else navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${transparentHome ? "bg-transparent" : "bg-white shadow"}`}
    >
      {/* ================= DESKTOP HEADER ================= */}
      <div
        className={`max-w-7xl mx-auto px-6 flex items-center justify-between
          transition-all duration-300 ${scrolled ? "py-2" : "py-5"}`}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="AP Logo"
            className={`transition-all duration-300 ${scrolled ? "h-10" : "h-16"}`}
          />
          <span
            className={`font-bold transition-all duration-300
              ${transparentHome ? "text-2xl text-white" : "text-lg text-green-700"}`}
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
        >
          ☰
        </button>

        {/* ================= DESKTOP MENU ================= */}
        <ul
          className={`hidden md:flex items-center gap-8 font-medium
            ${transparentHome ? "text-white" : "text-gray-800"}`}
        >
          <li><Link to="/">Home</Link></li>
         

          {/* Attractions */}
          <li ref={attractionsRef} className="relative">
            <button
              onClick={() => {
                setAttractionsOpen(!attractionsOpen);
                setProfileOpen(false);
              }}
              className="flex items-center gap-1"
            >
              Attractions
              <span className={`transition-transform ${attractionsOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            <ul
              className={`absolute top-10 left-0 bg-white text-gray-800 rounded-md shadow-lg w-56
                transition-all duration-300 origin-top
                ${attractionsOpen
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}`}
            >
              <li className="px-4 py-2 hover:bg-gray-100"><Link to="/attractions">All Attractions</Link></li>
              <li className="px-4 py-2 hover:bg-gray-100"><Link to="/attractions/temples">Temples</Link></li>
              <li className="px-4 py-2 hover:bg-gray-100"><Link to="/attractions/waterfalls">Waterfalls</Link></li>
              <li className="px-4 py-2 hover:bg-gray-100"><Link to="/attractions/festivals">Festivals</Link></li>
            </ul>
          </li>

          <li><button onClick={handleBookStay}>Book Your Stay</button></li>
           <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          


{/* AUTH SECTION */}
{!isLoggedIn ? (
  <li>
    <Link
      to="/login"
      className="px-4 py-2 rounded bg-green-700 text-white"
    >
      Login
    </Link>
  </li>
) : (
  <li ref={profileRef} className="relative">
    <button
      onClick={() => setProfileOpen(!profileOpen)}
      className="w-10 h-10 rounded-full bg-green-700 text-white
        flex items-center justify-center font-bold"
    >
      {role.charAt(0).toUpperCase()}
    </button>

    {profileOpen && (
      <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg">
        {role === "user" && (
          <Link to="/my-bookings" className="block px-4 py-3 hover:bg-gray-100">
            My Bookings
          </Link>
        )}

        {role === "hotel" && (
          <>
            <Link to="/hotel/profile" className="block px-4 py-3 hover:bg-gray-100">
              Hotel Profile
            </Link>
            <Link to="/hotel/dashboard" className="block px-4 py-3 hover:bg-gray-100">
              Dashboard
            </Link>
          </>
        )}

        {role === "admin" && (
          <Link to="/admin/dashboard" className="block px-4 py-3 hover:bg-gray-100">
            Admin Dashboard
          </Link>
        )}

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
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
              className="flex justify-between"
            >
              Attractions <span>{mobileAttractionsOpen ? "▲" : "▼"}</span>
            </button>

            {mobileAttractionsOpen && (
              <div className="ml-4 flex flex-col gap-2 text-sm text-gray-600">
                <Link to="/attractions">All Attractions</Link>
                <Link to="/attractions/temples">Temples</Link>
                <Link to="/attractions/waterfalls">Waterfalls</Link>
                <Link to="/attractions/festivals">Festivals</Link>
              </div>
            )}

            <button onClick={handleBookStay}>Book Your Stay</button>

            {!role ? (
              <Link
                to="/login"
                className="bg-green-700 text-white px-4 py-2 rounded text-center"
              >
                Login
              </Link>
            ) : (
              <>
                {role === "user" && <Link to="/my-bookings">My Bookings</Link>}
                {role === "admin" && <Link to="/admin/dashboard">Admin Dashboard</Link>}
                {role === "hotel" && <Link to="/hotel/dashboard">Hotel Dashboard</Link>}
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
