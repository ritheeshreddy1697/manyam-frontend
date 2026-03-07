import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../utils/apiUrl";

function exportCSV(bookings) {
  const headers = [
    "Booking ID",
    "Guest Name",
    "Guest Email",
    "Phone",
    "Adults",
    "Children",
    "Room Type",
    "Check-in",
    "Check-out",
    "Status",
    "Amount",
  ];
  const rows = bookings.map((b) => [
    b._id,
    b.guestName || "",
    b.userEmail,
    b.phone || "",
    Number(b.adults) || 1,
    Number(b.children) || 0,
    b.roomType || "",
    b.checkIn,
    b.checkOut,
    b.status,
    Number(b.amount) || 0,
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

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const shiftMonth = (monthKey, step) => {
  const [yearText, monthText] = String(monthKey || "").split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  if (!Number.isInteger(year) || !Number.isInteger(month)) return getMonthKey(new Date());

  const shifted = new Date(year, month - 1 + step, 1);
  return getMonthKey(shifted);
};

const getMonthLabel = (monthKey) => {
  const [yearText, monthText] = String(monthKey || "").split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return monthKey;
  }

  return `${MONTH_NAMES[month - 1]} ${year}`;
};

const parseDateText = (dateText) => {
  const [yearText, monthText, dayText] = String(dateText || "").split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const formatCalendarDate = (dateText) => {
  const parsed = parseDateText(dateText);
  if (!parsed) return dateText;

  return parsed.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const createCalendarCells = (monthKey, dayMap) => {
  const [yearText, monthText] = String(monthKey || "").split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return [];
  }

  const firstWeekDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];

  for (let index = 0; index < firstWeekDay; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${monthKey}-${String(day).padStart(2, "0")}`;
    cells.push({
      date,
      day,
      info: dayMap[date] || null,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

const getAvailabilityLevelLabel = (level) => {
  if (level === "full") return "Sold Out";
  if (level === "fast") return "Filling Fast";
  return "Available";
};

const getCalendarCellTone = (level) => {
  if (level === "full") {
    return "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100";
  }
  if (level === "fast") {
    return "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100";
  }
  if (level === "available") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100";
  }
  return "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100";
};

export default function HotelDashboard() {
  const navigate = useNavigate();
  const pastMenuRef = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState("current");
  const [showPastRanges, setShowPastRanges] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [hotelProfile, setHotelProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(getMonthKey(new Date()));
  const [calendarRoomType, setCalendarRoomType] = useState("");
  const [calendarByDate, setCalendarByDate] = useState({});
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("");
  const [selectedDayAvailableInput, setSelectedDayAvailableInput] = useState("");
  const [dayUpdateSaving, setDayUpdateSaving] = useState(false);
  const [dayUpdateError, setDayUpdateError] = useState("");
  const [dayUpdateSuccess, setDayUpdateSuccess] = useState("");
  const [calendarReloadTick, setCalendarReloadTick] = useState(0);

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
    let mounted = true;

    const fetchHotelProfile = async () => {
      try {
        const profileUrl = buildApiUrl("/api/hotel/profile");
        if (!profileUrl) throw new Error("Invalid API URL configuration");

        const res = await fetch(profileUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load hotel profile");
        const data = await res.json();
        if (!mounted) return;

        const normalizedRooms = Array.isArray(data?.rooms)
          ? data.rooms.filter((room) => String(room?.type || "").trim())
          : [];

        setHotelProfile({
          ...data,
          rooms: normalizedRooms,
        });
        setProfileError("");
        setCalendarRoomType((prev) => prev || normalizedRooms[0]?.type || "");
      } catch (err) {
        if (!mounted) return;
        setHotelProfile(null);
        setProfileError(err?.message || "Failed to load hotel profile");
      }
    };

    fetchHotelProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const hotelId = String(hotelProfile?._id || "");
  const hotelRooms = Array.isArray(hotelProfile?.rooms) ? hotelProfile.rooms : [];
  const activeCalendarRoomType = calendarRoomType || hotelRooms[0]?.type || "";

  useEffect(() => {
    let active = true;

    if (!hotelId || !activeCalendarRoomType) {
      setCalendarByDate({});
      setSelectedCalendarDate("");
      setCalendarError("");
      return undefined;
    }

    const fetchCalendarAvailability = async () => {
      try {
        setCalendarLoading(true);
        setCalendarError("");

        const calendarUrl = buildApiUrl(
          `/api/hotels/${encodeURIComponent(hotelId)}/availability-calendar`,
          {
            roomType: activeCalendarRoomType,
            month: calendarMonth,
          }
        );
        if (!calendarUrl) throw new Error("Invalid API URL configuration");

        const res = await fetch(calendarUrl, { cache: "no-store" });
        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (!res.ok) {
          throw new Error(data?.msg || "Failed to load availability calendar");
        }

        if (!active) return;

        const nextCalendarByDate = {};
        (Array.isArray(data?.days) ? data.days : []).forEach((dayInfo) => {
          if (!dayInfo?.date) return;
          nextCalendarByDate[dayInfo.date] = dayInfo;
        });

        setCalendarByDate(nextCalendarByDate);

        const todayKey = getDateKey(new Date());
        setSelectedCalendarDate((prev) => {
          if (prev && nextCalendarByDate[prev]) return prev;
          if (nextCalendarByDate[todayKey]) return todayKey;
          const firstDate = (Array.isArray(data?.days) ? data.days : [])[0]?.date;
          return firstDate || "";
        });
      } catch (err) {
        if (!active) return;
        setCalendarByDate({});
        setSelectedCalendarDate("");
        setCalendarError(err?.message || "Failed to load availability calendar");
      } finally {
        if (active) setCalendarLoading(false);
      }
    };

    fetchCalendarAvailability();

    return () => {
      active = false;
    };
  }, [hotelId, activeCalendarRoomType, calendarMonth, calendarReloadTick]);

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
  const calendarCells = createCalendarCells(calendarMonth, calendarByDate);
  const selectedDayInfo = selectedCalendarDate ? calendarByDate[selectedCalendarDate] : null;

  useEffect(() => {
    if (!selectedDayInfo) {
      setSelectedDayAvailableInput("");
      setDayUpdateError("");
      setDayUpdateSuccess("");
      return;
    }

    setSelectedDayAvailableInput(String(Math.max(0, Number(selectedDayInfo.available) || 0)));
    setDayUpdateError("");
    setDayUpdateSuccess("");
  }, [selectedCalendarDate, selectedDayInfo, activeCalendarRoomType]);

  const saveSelectedDayAvailability = async () => {
    if (!hotelId || !selectedDayInfo || !activeCalendarRoomType) return;

    try {
      setDayUpdateSaving(true);
      setDayUpdateError("");
      setDayUpdateSuccess("");

      const desiredAvailable = Math.max(0, Number(selectedDayAvailableInput) || 0);
      const bookedRooms = Math.max(0, Number(selectedDayInfo.booked) || 0);
      const updatedTotal = desiredAvailable + bookedRooms;

      const roomsPayload = hotelRooms.map((room) => {
        if (String(room?.type || "") !== String(activeCalendarRoomType)) return room;
        return {
          ...room,
          total: updatedTotal,
          price: Number(room.price) || 0,
        };
      });

      const profileUrl = buildApiUrl("/api/hotel/profile");
      if (!profileUrl) throw new Error("Invalid API URL configuration");

      const res = await fetch(profileUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: String(hotelProfile?.name || ""),
          location: String(hotelProfile?.location || ""),
          description: String(hotelProfile?.description || ""),
          images: Array.isArray(hotelProfile?.images) ? hotelProfile.images : [],
          rooms: roomsPayload,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data?.msg || "Failed to update rooms");
      }

      const normalizedRooms = Array.isArray(data?.rooms)
        ? data.rooms.filter((room) => String(room?.type || "").trim())
        : [];

      setHotelProfile({
        ...data,
        rooms: normalizedRooms,
      });
      setDayUpdateSuccess("Availability updated.");
      setCalendarReloadTick((prev) => prev + 1);
    } catch (err) {
      setDayUpdateError(err?.message || "Failed to update availability");
    } finally {
      setDayUpdateSaving(false);
    }
  };

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
          <div className="p-5 md:p-6 border-b border-slate-200/75 bg-white/75 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="display-heading text-xl md:text-2xl font-semibold text-slate-800">
                Room Availability Calendar
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Click any date to view booked rooms and rooms available for that day.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Room Type
              </label>
              <select
                value={activeCalendarRoomType}
                onChange={(event) => {
                  setCalendarRoomType(event.target.value);
                  setSelectedCalendarDate("");
                }}
                disabled={hotelRooms.length === 0}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {hotelRooms.length === 0 ? (
                  <option value="">No rooms</option>
                ) : (
                  hotelRooms.map((room, index) => (
                    <option key={`${room.type}-${index}`} value={room.type}>
                      {room.type}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="p-5 md:p-6 space-y-4">
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Available
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-amber-800">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Filling Fast
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-rose-800">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Sold Out
              </span>
            </div>

            {profileError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {profileError}
              </p>
            )}

            {!profileError && !hotelId && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                Add your hotel profile first to enable day-wise calendar availability.
              </div>
            )}

            {!profileError && hotelId && hotelRooms.length === 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                Add at least one room type in hotel profile to view calendar availability.
              </div>
            )}

            {hotelId && hotelRooms.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((prev) => shiftMonth(prev, -1))}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Prev
                  </button>
                  <p className="text-sm font-semibold text-slate-700">
                    {getMonthLabel(calendarMonth)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((prev) => shiftMonth(prev, 1))}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Next
                  </button>
                </div>

                <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="grid grid-cols-7 gap-2 text-[10px] text-slate-500 mb-2">
                      {WEEK_DAYS.map((day) => (
                        <div key={`${calendarMonth}-${day}`} className="text-center font-semibold py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {calendarCells.map((cell, index) => {
                        if (!cell) {
                          return (
                            <div
                              key={`${calendarMonth}-blank-${index}`}
                              className="h-16 rounded-xl border border-transparent"
                            />
                          );
                        }

                        const isSelected = cell.date === selectedCalendarDate;
                        const dayLevel = cell.info?.level;
                        const toneClass = isSelected
                          ? "border-sky-400 bg-sky-50 text-sky-900 ring-2 ring-sky-400/70"
                          : getCalendarCellTone(dayLevel);

                        return (
                          <button
                            key={cell.date}
                            type="button"
                            onClick={() => setSelectedCalendarDate(cell.date)}
                            disabled={!cell.info}
                            className={`h-16 rounded-xl border px-1 py-1 text-center transition ${toneClass} ${
                              !cell.info ? "cursor-not-allowed opacity-60" : ""
                            }`}
                          >
                            <span className="text-sm font-semibold">{cell.day}</span>
                            {cell.info && (
                              <span className="mt-1 block text-[10px] font-semibold">
                                A:{cell.info.available} B:{cell.info.booked}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Selected Day
                    </h3>

                    {selectedDayInfo ? (
                      <div className="mt-3 space-y-3">
                        <p className="text-sm font-semibold text-slate-800">
                          {formatCalendarDate(selectedCalendarDate)}
                        </p>
                        <DetailItem label="Room Type" value={activeCalendarRoomType} />
                        <DetailItem
                          label="Booking Status"
                          value={getAvailabilityLevelLabel(selectedDayInfo.level)}
                        />
                        <DetailItem
                          label="Bookings Done"
                          value={String(Number(selectedDayInfo.booked) || 0)}
                        />
                        <DetailItem
                          label="Rooms Available"
                          value={String(Number(selectedDayInfo.available) || 0)}
                        />
                        <DetailItem
                          label="Total Rooms"
                          value={String(Number(selectedDayInfo.total) || 0)}
                        />

                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Edit For Selected Date
                          </p>

                          <label className="mt-2 block text-xs text-slate-600">
                            Rooms Available
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={selectedDayAvailableInput}
                            onChange={(event) => {
                              const value = event.target.value;
                              const normalized =
                                value === "" ? "" : String(Math.max(0, Number(value) || 0));
                              setSelectedDayAvailableInput(normalized);
                              setDayUpdateError("");
                              setDayUpdateSuccess("");
                            }}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />

                          <button
                            type="button"
                            onClick={saveSelectedDayAvailability}
                            disabled={dayUpdateSaving}
                            className="mt-3 w-full rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {dayUpdateSaving ? "Updating..." : "Update Availability"}
                          </button>

                          <p className="mt-2 text-[11px] text-slate-500">
                            Booked rooms stay fixed for that date. Total room inventory is
                            adjusted to match this availability.
                          </p>
                        </div>

                        {dayUpdateError && (
                          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            {dayUpdateError}
                          </p>
                        )}

                        {dayUpdateSuccess && (
                          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                            {dayUpdateSuccess}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-600">
                        Click a date on the calendar to view room availability details.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {calendarLoading && hotelId && hotelRooms.length > 0 && (
              <p className="text-xs text-slate-600">Loading calendar availability...</p>
            )}

            {calendarError && (
              <p className="text-xs text-red-600">{calendarError}</p>
            )}
          </div>
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
                  <th className="p-4 text-left">Action</th>
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
                      <td className="p-4 text-slate-700">
                        <p className="font-medium text-slate-800">{b.guestName || "Guest"}</p>
                        <p className="text-xs text-slate-500 break-all">{b.userEmail}</p>
                      </td>
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
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(b)}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          Details
                        </button>
                      </td>
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

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Booking Details</h3>
                <p className="text-xs text-slate-500 break-all">{selectedBooking._id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailItem label="Guest Name" value={selectedBooking.guestName || "-"} />
              <DetailItem label="Guest Email" value={selectedBooking.userEmail || "-"} />
              <DetailItem label="Phone" value={selectedBooking.phone || "-"} />
              <DetailItem label="Room Type" value={selectedBooking.roomType || "-"} />
              <DetailItem label="Adults" value={String(Number(selectedBooking.adults) || 1)} />
              <DetailItem label="Children" value={String(Number(selectedBooking.children) || 0)} />
              <DetailItem label="Check-in" value={formatDate(selectedBooking.checkIn)} />
              <DetailItem label="Check-out" value={formatDate(selectedBooking.checkOut)} />
              <DetailItem
                label="Status"
                value={String(selectedBooking.status || "pending").toUpperCase()}
              />
              <DetailItem label="Amount" value={formatCurrency(selectedBooking.amount)} />
            </div>
          </div>
        </div>
      )}
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

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words font-medium text-slate-800">{value}</p>
    </div>
  );
}
