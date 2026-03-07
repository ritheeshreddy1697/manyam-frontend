import { useEffect, useState } from "react";
import AttractionPhotoManager from "../../components/admin/AttractionPhotoManager";

const getLocalISODate = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHotels, setShowHotels] = useState(false);
  const [showAddHotelForm, setShowAddHotelForm] = useState(false);
  const [hotelEmail, setHotelEmail] = useState("");
  const [assigningHotelRole, setAssigningHotelRole] = useState(false);
  const [hotelAssignMessage, setHotelAssignMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(getLocalISODate());

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings?t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          cache: "no-store",
        }
      );
      if (!res.ok) {
        setBookings([]);
        return;
      }
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/hotels`);
      const data = await res.json();
      setHotels(Array.isArray(data) ? data : []);
    } catch {
      setHotels([]);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      fetchBookings();
      fetchHotels();
    });

    const timer = setInterval(fetchBookings, 15000);
    return () => clearInterval(timer);
  }, []);

  const assignHotelRole = async () => {
    const email = hotelEmail.trim().toLowerCase();
    if (!email) {
      setHotelAssignMessage("Please enter an email.");
      return;
    }

    try {
      setAssigningHotelRole(true);
      setHotelAssignMessage("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/make-hotel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setHotelAssignMessage(data?.msg || "Failed to assign hotel role.");
        return;
      }

      setHotelAssignMessage(
        `Hotel admin dashboard access granted for ${email}.`
      );
      setHotelEmail("");
      setShowAddHotelForm(false);
    } catch {
      setHotelAssignMessage("Server error while assigning hotel role.");
    } finally {
      setAssigningHotelRole(false);
    }
  };

  const totalBookings = bookings.length;
  const paidBookings = bookings.filter(
    (b) => ["paid", "confirmed"].includes(String(b.status).toLowerCase())
  ).length;
  const confirmedBookings = bookings.filter(
    (b) => String(b.status).toLowerCase() === "confirmed"
  ).length;
  const totalPaidAmount = bookings.reduce((sum, b) => {
    const status = String(b.status).toLowerCase();
    const isPaidOrConfirmed = status === "paid" || status === "confirmed";
    return isPaidOrConfirmed ? sum + (Number(b.amount) || 0) : sum;
  }, 0);

  const dailyBookings = bookings.filter(
    (b) => getLocalISODate(b.checkIn) === selectedDate
  );
  const peopleBooked = [...new Set(dailyBookings.map((b) => b.userEmail).filter(Boolean))];

  const getHotelNameFromBooking = (booking) => {
    if (booking.hotelId && typeof booking.hotelId === "object") {
      return booking.hotelId.name || booking.hotelId.location || "Unknown Hotel";
    }

    if (typeof booking.hotelId === "string") {
      const matched = hotels.find((h) => h._id === booking.hotelId);
      return matched?.name || booking.hotelId;
    }

    return "Unknown Hotel";
  };

  return (
    <section className="min-h-screen pt-24 pb-14 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-7">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-700 p-7 md:p-9 text-white shadow-[0_20px_45px_rgba(5,46,22,0.35)]">
          <div className="pointer-events-none absolute -top-10 right-8 h-32 w-32 rounded-full bg-emerald-300/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 left-12 h-24 w-24 rounded-full bg-cyan-300/30 blur-2xl" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-emerald-100/90">
                Admin Control Center
              </p>
              <h1 className="mt-3 display-heading text-3xl md:text-4xl font-bold">
                Booking Operations Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-emerald-50/90">
                Track bookings, open hotel list, and view date-wise visitors.
              </p>
            </div>

            <button
              onClick={() => setShowHotels((prev) => !prev)}
              className="self-start md:self-auto rounded-full px-5 py-2.5 text-sm font-semibold bg-white text-emerald-800 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              {showHotels ? "Hide Hotels" : "Hotels"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Paid Amount"
            value={formatCurrency(totalPaidAmount)}
            tint="from-green-700 to-emerald-500"
          />
          <MetricCard
            title="Total Bookings"
            value={totalBookings}
            tint="from-slate-900 to-slate-700"
          />
          <MetricCard
            title="Paid Bookings"
            value={paidBookings}
            tint="from-emerald-700 to-teal-600"
          />
          <MetricCard
            title="Confirmed"
            value={confirmedBookings}
            tint="from-cyan-700 to-blue-600"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {showHotels && (
            <div className="xl:col-span-2 soft-panel rounded-3xl border border-white/60 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200/75 bg-white/75">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="display-heading text-xl md:text-2xl font-semibold text-slate-800">
                      Hotels List
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      {hotels.length} hotel{hotels.length === 1 ? "" : "s"} available.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddHotelForm((prev) => !prev)}
                    className="self-start sm:self-auto rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-700 shadow-md shadow-emerald-700/35 hover:-translate-y-0.5 transition-all"
                  >
                    Add Hotel
                  </button>
                </div>

                {showAddHotelForm && (
                  <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                    <input
                      type="email"
                      value={hotelEmail}
                      onChange={(e) => setHotelEmail(e.target.value)}
                      placeholder="Enter email to grant hotel dashboard access"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <button
                      onClick={assignHotelRole}
                      disabled={assigningHotelRole}
                      className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {assigningHotelRole ? "Assigning..." : "Grant Access"}
                    </button>
                  </div>
                )}

                {hotelAssignMessage && (
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    {hotelAssignMessage}
                  </p>
                )}
              </div>

              <div className="max-h-[360px] overflow-auto bg-white/85">
                {hotels.length === 0 ? (
                  <p className="px-6 py-10 text-center text-slate-600">No hotels found.</p>
                ) : (
                  hotels.map((hotel) => (
                    <div
                      key={hotel._id || hotel.id}
                      className="px-6 py-4 border-t border-slate-200/75"
                    >
                      <p className="font-semibold text-slate-800">{hotel.name || "Unnamed Hotel"}</p>
                      <p className="text-sm text-slate-600">{hotel.location || "No location"}</p>
                      <p className="text-xs text-slate-500 mt-1">{hotel.ownerEmail || "No owner email"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <aside
            className={`soft-panel rounded-3xl border border-white/60 overflow-hidden ${
              showHotels ? "xl:col-span-1" : "xl:col-span-3"
            }`}
          >
            <div className="px-6 py-5 border-b border-slate-200/75 bg-white/75">
              <h2 className="display-heading text-xl md:text-2xl font-semibold text-slate-800">
                Date-wise Bookings
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Pick a date to see people booked on that day.
              </p>
            </div>

            <div className="p-6 bg-white/85">
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="booking-date">
                Select Date
              </label>
              <input
                id="booking-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/55 p-4">
                <p className="text-sm text-slate-700">
                  Selected Date: <span className="font-semibold">{formatDate(selectedDate)}</span>
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  People Booked: <span className="font-semibold">{peopleBooked.length}</span>
                </p>
              </div>

              <div className="mt-4 space-y-3 max-h-60 overflow-auto pr-1">
                {dailyBookings.length === 0 ? (
                  <p className="text-slate-600 text-sm">No bookings on this date.</p>
                ) : (
                  dailyBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      <p className="font-semibold text-slate-800 break-all">{booking.userEmail || "Unknown user"}</p>
                      <p className="text-sm text-slate-600 mt-1">Hotel: {getHotelNameFromBooking(booking)}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusPill status={booking.status} />
                        <span className="text-xs text-slate-600">Amount: {formatCurrency(booking.amount)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>

        <AttractionPhotoManager />

        <div className="soft-panel rounded-3xl border border-white/60 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200/75 bg-white/75">
            <h2 className="display-heading text-xl md:text-2xl font-semibold text-slate-800">
              Booking Queue
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Bookings are auto-confirmed after successful payment.
            </p>
          </div>

          {loading && (
            <div className="p-6 space-y-4 bg-white/80">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 rounded-2xl bg-gradient-to-r from-slate-200/70 via-slate-100 to-slate-200/70 animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="px-6 py-10 text-center text-slate-600 bg-white/80">
              No bookings available right now.
            </div>
          )}

          {!loading &&
            bookings.map((b) => {
              const status = String(b.status || "").toUpperCase();

              return (
                <div
                  key={b._id}
                  className="px-6 py-5 border-t border-slate-200/75 bg-white/80 hover:bg-emerald-50/45 transition-colors"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Booking ID
                      </p>
                      <p className="font-semibold text-slate-800 break-all">{b._id}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusPill status={status} />
                        <span className="text-sm font-medium text-slate-700">
                          Amount: {formatCurrency(b.amount)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-slate-500">
                      No manual action required
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ title, value, tint }) {
  return (
    <div className="soft-panel rounded-2xl p-5 border border-white/60 animate-fade-up">
      <div
        className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${tint}`}
        aria-hidden="true"
      />
      <p className="mt-4 text-sm font-medium text-slate-600">{title}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const normalized = String(status || "unknown").toLowerCase();
  const label = normalized.toUpperCase();

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        normalized === "confirmed"
          ? "bg-cyan-100 text-cyan-800"
          : normalized === "paid"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
      }`}
    >
      {label}
    </span>
  );
}
