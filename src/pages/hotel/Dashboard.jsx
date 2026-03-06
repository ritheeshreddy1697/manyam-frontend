import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function exportCSV(bookings) {
  const headers = ["Booking ID", "Guest Email", "Check-in", "Check-out", "Status"];
  const rows = bookings.map((b) => [
    b._id,
    b.userEmail,
    b.checkIn,
    b.checkOut,
    b.status,
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "hotel-bookings.csv";
  a.click();

  URL.revokeObjectURL(url);
}

const formatDate = (dateText) => {
  if (!dateText) return "-";

  const parsed = new Date(dateText);
  if (Number.isNaN(parsed.getTime())) return dateText;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function HotelDashboard() {
  const navigate = useNavigate();
  const pastMenuRef = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState("current");
  const [showPastRanges, setShowPastRanges] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchHotelBookings = async ({ withLoader = false } = {}) => {
      try {
        if (withLoader) setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/hotel/bookings?t=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        if (mounted) {
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch {
        if (mounted) setBookings([]);
      } finally {
        if (withLoader && mounted) setLoading(false);
      }
    };

    fetchHotelBookings({ withLoader: true });
    const timer = setInterval(() => fetchHotelBookings(), 15000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!showPastRanges) return undefined;

    const handleOutsideClick = (event) => {
      if (pastMenuRef.current && !pastMenuRef.current.contains(event.target)) {
        setShowPastRanges(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showPastRanges]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPastBooking = (booking) => {
    const checkout = new Date(booking.checkOut);
    if (Number.isNaN(checkout.getTime())) return false;
    checkout.setHours(0, 0, 0, 0);
    return checkout < today;
  };

  const pastBookings = bookings.filter(isPastBooking);
  const currentBookings = bookings.filter((booking) => !isPastBooking(booking));

  const filterDaysMap = {
    "past-7": 7,
    "past-30": 30,
    "past-90": 90,
    "past-180": 180,
    "past-365": 365,
  };
  const pastRangeOptions = [
    { value: "past-7", label: "Past 1 Week" },
    { value: "past-30", label: "Past 1 Month" },
    { value: "past-90", label: "Past 3 Months" },
    { value: "past-180", label: "Past 6 Months" },
    { value: "past-365", label: "Past 1 Year" },
  ];

  const selectedPastDays = filterDaysMap[bookingFilter] || 0;
  const isPastFilter = selectedPastDays > 0;

  const pastCutoff = new Date(today);
  if (selectedPastDays > 0) {
    pastCutoff.setDate(pastCutoff.getDate() - selectedPastDays);
  }

  const visibleBookings = isPastFilter
    ? pastBookings.filter((booking) => {
        const checkout = new Date(booking.checkOut);
        if (Number.isNaN(checkout.getTime())) return false;
        checkout.setHours(0, 0, 0, 0);
        return checkout >= pastCutoff && checkout < today;
      })
    : currentBookings;

  const totalBookings = bookings.length;
  const totalIncome = bookings.reduce((sum, booking) => {
    const status = String(booking.status).toLowerCase();
    const isPaidOrConfirmed = status === "paid" || status === "confirmed";
    return isPaidOrConfirmed ? sum + (Number(booking.amount) || 0) : sum;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-40 rounded-3xl bg-gradient-to-r from-emerald-200/70 via-emerald-100 to-cyan-100 animate-pulse" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 rounded-2xl bg-white/80 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-14 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-7">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 text-white p-7 md:p-9 shadow-[0_20px_45px_rgba(15,23,42,0.35)]">
          <div className="pointer-events-none absolute -top-10 right-10 h-36 w-36 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-12 h-28 w-28 rounded-full bg-cyan-300/30 blur-3xl" />
          <p className="relative text-sm uppercase tracking-[0.24em] text-emerald-100/90">
            Hotel Admin
          </p>
          <h1 className="relative mt-3 display-heading text-3xl md:text-4xl font-bold">
            Hotel Dashboard
          </h1>
          <p className="relative mt-3 max-w-2xl text-emerald-50/85">
            Add hotel details, update room vacancies, manage bookings, and track income.
          </p>

          <div className="relative mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/hotel/profile")}
              className="rounded-full px-4 py-2 text-sm font-semibold bg-white text-emerald-800 hover:bg-emerald-50"
            >
              Add Hotel
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          <StatCard title="Total Bookings" value={totalBookings} tone="slate" />
          <StatCard title="Total Income" value={formatCurrency(totalIncome)} tone="green" />
        </div>

        <div className="soft-panel rounded-3xl border border-white/60 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-200/75 bg-white/75 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="display-heading text-xl md:text-2xl font-semibold text-slate-800">
                Booking Overview
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                View current bookings or select a past booking range.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setBookingFilter("current");
                  setShowPastRanges(false);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  !isPastFilter
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                Current Bookings
              </button>

              <div className="relative" ref={pastMenuRef}>
                <button
                  onClick={() => {
                    setShowPastRanges((prev) => !prev);
                    if (!isPastFilter) setBookingFilter("past-7");
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isPastFilter || showPastRanges
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Past Bookings
                </button>

                {showPastRanges && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg z-20 overflow-hidden">
                    {pastRangeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setBookingFilter(option.value);
                          setShowPastRanges(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm transition ${
                          bookingFilter === option.value
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => exportCSV(visibleBookings)}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-700 shadow-md shadow-emerald-700/35 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-700/45 transition-all"
              >
                Export ({isPastFilter ? "Past" : "Current"})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-emerald-700 text-white">
                <tr>
                  <th className="p-4 text-left">Booking ID</th>
                  <th className="p-4 text-left">Guest</th>
                  <th className="p-4 text-left">Check-in</th>
                  <th className="p-4 text-left">Check-out</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Amount</th>
                </tr>
              </thead>

              <tbody className="bg-white/85">
                {visibleBookings.map((b) => {
                  const status = String(b.status).toLowerCase();
                  const isPaidOrConfirmed = status === "paid" || status === "confirmed";
                  return (
                    <tr
                      key={b._id}
                      className="border-b border-slate-200/75 hover:bg-emerald-50/45 transition-colors"
                    >
                      <td className="p-4 font-medium text-slate-800 break-all">{b._id}</td>
                      <td className="p-4 text-slate-700">{b.userEmail}</td>
                      <td className="p-4 text-slate-700">{formatDate(b.checkIn)}</td>
                      <td className="p-4 text-slate-700">{formatDate(b.checkOut)}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
                            isPaidOrConfirmed
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {String(b.status || "pending").toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700">{formatCurrency(b.amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {visibleBookings.length === 0 && (
            <p className="p-6 text-slate-600 bg-white/80 text-center">
              No {isPastFilter ? "past" : "current"} bookings yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value, tone }) {
  return (
    <div
      className={`soft-panel rounded-2xl p-6 border border-white/60 ${
        tone === "green"
          ? "shadow-[0_12px_28px_rgba(22,163,74,0.14)]"
          : tone === "amber"
            ? "shadow-[0_12px_28px_rgba(245,158,11,0.16)]"
            : "shadow-[0_12px_28px_rgba(51,65,85,0.12)]"
      }`}
    >
      <p className="text-slate-600 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2 text-slate-900 break-words">{value}</p>
    </div>
  );
}
