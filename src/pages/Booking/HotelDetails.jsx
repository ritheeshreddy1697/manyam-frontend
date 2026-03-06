import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HotelDetailsSkeleton from "../../components/HotelDetailsSkeleton";
import { buildApiUrl } from "../../utils/apiUrl";

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
const MONTH_SHORT_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

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

const formatDateInput = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const getDateMeta = (dateText) => {
  const parsed = parseDateText(dateText);
  if (!parsed) {
    return {
      day: "--",
      weekDay: "",
      monthYear: "Select date",
    };
  }

  return {
    day: String(parsed.getDate()).padStart(2, "0"),
    weekDay: WEEK_DAYS[parsed.getDay()],
    monthYear: `${MONTH_SHORT_NAMES[parsed.getMonth()]} ${parsed.getFullYear()}`,
  };
};

const getNights = (checkIn, checkOut) => {
  const start = parseDateText(checkIn);
  const end = parseDateText(checkOut);
  if (!start || !end || end <= start) return 0;
  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
};

const getAvailabilityLevel = (available, total) => {
  if (available <= 0 || total <= 0) return "full";
  const ratio = available / total;
  return ratio <= 0.3 ? "fast" : "available";
};

const buildFallbackAvailability = (hotel) => {
  const safeHotel = hotel || {};
  const rooms = Array.isArray(safeHotel.rooms) ? safeHotel.rooms : [];
  const roomRows = rooms.map((room) => {
    const total = Number(room.total) || 0;
    const available = total;
    return {
      type: room.type,
      price: Number(room.price) || 0,
      total,
      booked: 0,
      available,
      level: getAvailabilityLevel(available, total),
    };
  });

  return {
    hotelId: safeHotel._id || null,
    totalRooms: roomRows.reduce((sum, room) => sum + room.total, 0),
    rooms: roomRows,
  };
};

const buildFallbackCalendarMonth = (hotel, roomType, monthKey) => {
  const [yearText, monthText] = String(monthKey || "").split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return {
      hotelId: hotel?._id || null,
      roomType: roomType || "",
      month: monthKey,
      totalRooms: 0,
      days: [],
    };
  }

  const room = (hotel?.rooms || []).find((item) => item.type === roomType);
  const totalRooms = Number(room?.total) || 0;
  const daysInMonth = new Date(year, month, 0).getDate();

  const days = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${monthKey}-${String(day).padStart(2, "0")}`;
    const available = totalRooms;
    days.push({
      date,
      total: totalRooms,
      booked: 0,
      available,
      level: getAvailabilityLevel(available, totalRooms),
    });
  }

  return {
    hotelId: hotel?._id || null,
    roomType,
    month: monthKey,
    totalRooms,
    days,
  };
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

export default function HotelDetails() {
  const { id: hotelId } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);

  // Guest info
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");

  // Booking info
  const [roomType, setRoomType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(getMonthKey(new Date()));
  const [calendarAvailability, setCalendarAvailability] = useState({});
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const [calendarStep, setCalendarStep] = useState("checkIn");
  const [availabilityApiUnsupported, setAvailabilityApiUnsupported] = useState(false);
  const [calendarApiUnsupported, setCalendarApiUnsupported] = useState(false);

  useEffect(() => {
    const hotelsUrl = buildApiUrl("/api/hotels");
    if (!hotelsUrl) return;

    fetch(hotelsUrl)
      .then((res) => res.json())
      .then((data) => {
        const h = data.find(x => x._id === hotelId);
        setHotel(h);
      });
  }, [hotelId]);

  useEffect(() => {
    let active = true;

    if (!checkIn || !checkOut) {
      setAvailability(null);
      setAvailabilityError("");
      return undefined;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const hasValidDates =
      !Number.isNaN(checkInDate.getTime()) &&
      !Number.isNaN(checkOutDate.getTime()) &&
      checkOutDate > checkInDate;

    if (!hasValidDates) {
      setAvailability(null);
      setAvailabilityError("Select valid check-in and check-out dates.");
      return undefined;
    }

    if (availabilityApiUnsupported) {
      setAvailability(buildFallbackAvailability(hotel));
      setAvailabilityError("");
      return undefined;
    }

    const fetchAvailability = async () => {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError("");

        const availabilityUrl = buildApiUrl(
          `/api/hotels/${encodeURIComponent(hotelId)}/availability`,
          { checkIn, checkOut }
        );
        if (!availabilityUrl) {
          throw new Error("Invalid API URL configuration");
        }

        const res = await fetch(availabilityUrl);
        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (!res.ok) {
          if (res.status === 404) {
            if (!active) return;
            setAvailabilityApiUnsupported(true);
            setAvailability(buildFallbackAvailability(hotel));
            setAvailabilityError("");
            return;
          }
          throw new Error(data?.msg || "Failed to fetch room availability");
        }

        if (!active) return;
        setAvailabilityApiUnsupported(false);
        setAvailability(data);
      } catch (err) {
        if (!active) return;
        setAvailability(null);
        setAvailabilityError(err.message || "Failed to fetch room availability");
      } finally {
        if (active) setAvailabilityLoading(false);
      }
    };

    fetchAvailability();

    return () => {
      active = false;
    };
  }, [hotelId, checkIn, checkOut, hotel, availabilityApiUnsupported]);

  useEffect(() => {
    if (!roomType || !availability?.rooms) return;

    const selectedRoom = availability.rooms.find((room) => room.type === roomType);
    if (selectedRoom && selectedRoom.available <= 0) {
      setRoomType("");
    }
  }, [availability, roomType]);

  useEffect(() => {
    let active = true;
    const activeRoomType = roomType || hotel?.rooms?.[0]?.type;
    const visibleMonths = [calendarMonth, shiftMonth(calendarMonth, 1)];

    if (!activeRoomType) {
      setCalendarAvailability({});
      return undefined;
    }

    if (calendarApiUnsupported) {
      const fallbackMap = {};
      visibleMonths.forEach((monthKey) => {
        fallbackMap[monthKey] = buildFallbackCalendarMonth(hotel, activeRoomType, monthKey);
      });
      setCalendarAvailability(fallbackMap);
      setCalendarError("");
      return undefined;
    }

    const fetchCalendarAvailability = async () => {
      try {
        setCalendarLoading(true);
        setCalendarError("");

        const availabilityMap = {};
        for (const monthKey of visibleMonths) {
          const calendarUrl = buildApiUrl(
            `/api/hotels/${encodeURIComponent(hotelId)}/availability-calendar`,
            {
              roomType: activeRoomType,
              month: monthKey,
            }
          );
          if (!calendarUrl) {
            throw new Error("Invalid API URL configuration");
          }

          const res = await fetch(calendarUrl);
          let data = null;
          try {
            data = await res.json();
          } catch {
            data = null;
          }

          if (!res.ok) {
            if (res.status === 404) {
              if (!active) return;
              setCalendarApiUnsupported(true);
              const fallbackMap = {};
              visibleMonths.forEach((visibleMonthKey) => {
                fallbackMap[visibleMonthKey] = buildFallbackCalendarMonth(
                  hotel,
                  activeRoomType,
                  visibleMonthKey
                );
              });
              setCalendarAvailability(fallbackMap);
              setCalendarError("");
              return;
            }
            throw new Error(data?.msg || "Failed to load calendar availability");
          }

          availabilityMap[data?.month || monthKey] = data;
        }

        if (!active) return;
        setCalendarApiUnsupported(false);
        setCalendarAvailability(availabilityMap);
      } catch (err) {
        if (!active) return;
        setCalendarAvailability({});
        setCalendarError(err.message || "Failed to load calendar availability");
      } finally {
        if (active) setCalendarLoading(false);
      }
    };

    fetchCalendarAvailability();

    return () => {
      active = false;
    };
  }, [hotelId, calendarMonth, roomType, hotel, calendarApiUnsupported]);

  if (!hotel) return <HotelDetailsSkeleton />;

  // ✅ SAFE IMAGE HANDLING
  const validImages =
    hotel.images?.filter(img => img.startsWith("http")) || [];

  const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];
  const baseTotalRooms = rooms.reduce((sum, room) => sum + (Number(room.total) || 0), 0);
  const totalRoomsInHotel = availability?.totalRooms ?? baseTotalRooms;
  const availabilityByType = {};
  (availability?.rooms || []).forEach((room) => {
    availabilityByType[room.type] = room;
  });
  const visibleMonthKeys = [calendarMonth, shiftMonth(calendarMonth, 1)];
  const calendarByDate = {};
  Object.values(calendarAvailability || {}).forEach((monthData) => {
    (monthData?.days || []).forEach((item) => {
      calendarByDate[item.date] = item;
    });
  });
  const todayDateText = formatDateInput(new Date());
  const checkInMeta = getDateMeta(checkIn);
  const checkOutMeta = getDateMeta(checkOut);
  const totalNights = getNights(checkIn, checkOut);
  const selectedRoom = rooms.find((room) => room.type === roomType) || null;
  const selectedRoomRate = Number(selectedRoom?.price) || 0;
  const estimatedTotal = totalNights > 0 ? selectedRoomRate * totalNights : 0;

  const getRoomStatus = (room) => {
    const info = availabilityByType[room.type];
    if (!info) {
      return {
        label: "Select dates to check",
        badgeClass: "bg-slate-100 text-slate-700",
        isUnavailable: false,
      };
    }

    if (info.level === "full") {
      return {
        label: "Not available",
        badgeClass: "bg-red-100 text-red-700",
        isUnavailable: true,
      };
    }

    if (info.level === "fast") {
      return {
        label: "Fast booking",
        badgeClass: "bg-yellow-100 text-yellow-700",
        isUnavailable: false,
      };
    }

    return {
      label: "Available",
      badgeClass: "bg-green-100 text-green-700",
      isUnavailable: false,
    };
  };

  const bookHotel = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    if (!guestName || !phone || !roomType || !checkIn || !checkOut) {
      alert("Please fill all details");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime()) ||
      checkOutDate <= checkInDate
    ) {
      alert("Please select valid check-in and check-out dates");
      return;
    }

    const selectedRoomAvailability = availabilityByType[roomType];
    if (selectedRoomAvailability && selectedRoomAvailability.available <= 0) {
      alert("Selected room is not available for these dates");
      return;
    }

    setLoading(true);

    try {
      const bookingsUrl = buildApiUrl("/api/bookings");
      if (!bookingsUrl) {
        alert("Invalid API URL configuration");
        setLoading(false);
        return;
      }

      const res = await fetch(bookingsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          hotelId,
          roomType,
          checkIn,
          checkOut
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Booking failed");
        setLoading(false);
        return;
      }

      // 🔥 smooth transition
      navigate(`/booking/pay/${data._id}`);
    } catch {
      alert("Something went wrong");
      setLoading(false);
    }
  };

  const getAvailabilityDotClass = (level) => {
    if (level === "available") return "bg-emerald-500";
    if (level === "fast") return "bg-amber-500";
    if (level === "full") return "bg-rose-500";
    return "bg-slate-300";
  };

  const handleCalendarDateClick = (dateText, isSoldOut) => {
    if (dateText < todayDateText || isSoldOut) return;

    if (calendarStep === "checkIn") {
      setCheckIn(dateText);
      setCheckOut("");
      setCalendarStep("checkOut");
      return;
    }

    if (!checkIn || dateText <= checkIn) {
      setCheckIn(dateText);
      setCheckOut("");
      setCalendarStep("checkOut");
      return;
    }

    setCheckOut(dateText);
    setCalendarStep("checkIn");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* IMAGE */}
      <img
        src={
          validImages.length > 0
            ? validImages[0]
            : "https://source.unsplash.com/1200x500/?hotel,resort"
        }
        alt={hotel.name}
        className="w-full h-72 object-cover rounded-2xl shadow"
      />

      <div className="grid md:grid-cols-2 gap-10 mt-10">
        {/* LEFT */}
        <div>
          <h1 className="text-3xl font-bold text-green-700">
            {hotel.name}
          </h1>
          <p className="text-gray-600">{hotel.location}</p>

          <p className="mt-4 text-gray-700">
            {hotel.description}
          </p>

          <h3 className="mt-6 font-semibold">Room Types</h3>
          <p className="text-sm text-slate-600 mt-1">
            Total rooms in this hotel: <span className="font-semibold text-slate-800">{totalRoomsInHotel}</span>
          </p>

          {rooms.length === 0 ? (
            <p className="text-sm text-red-500 mt-2">
              No rooms configured by hotel
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {rooms.map(r => {
                const status = getRoomStatus(r);
                const availabilityInfo = availabilityByType[r.type];

                return (
                  <li key={r._id || r.type} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                    <div>
                      <p className="font-medium text-slate-800">
                        {r.type} — ₹{r.price}
                      </p>
                      <p className="text-xs text-slate-500">
                        {availabilityInfo
                          ? `${availabilityInfo.available}/${availabilityInfo.total} available`
                          : `${r.total} rooms`}
                      </p>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.badgeClass}`}>
                      {status.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {availabilityLoading && (
            <p className="mt-3 text-sm text-slate-600">Checking room vacancies...</p>
          )}

          {availabilityError && (
            <p className="mt-3 text-sm text-red-600">{availabilityError}</p>
          )}

        </div>

        {/* RIGHT – BOOKING CARD */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Guest Details
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 rounded mb-3"
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-full border p-2 rounded mb-4"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <h2 className="text-xl font-semibold mb-3">
            Booking Details
          </h2>

          <select
            className="w-full border p-2 rounded mb-3"
            value={roomType}
            onChange={e => setRoomType(e.target.value)}
          >
            <option value="">Select Room Type</option>
            {rooms.map(r => {
              const status = getRoomStatus(r);
              const availabilityInfo = availabilityByType[r.type];
              const unavailable = Boolean(availabilityInfo) && status.isUnavailable;

              return (
                <option
                  key={r._id || r.type}
                  value={r.type}
                  disabled={unavailable}
                >
                  {r.type} – ₹{r.price}
                  {availabilityInfo
                    ? ` (${availabilityInfo.available}/${availabilityInfo.total} left)`
                    : ""}
                  {unavailable ? " - Not available" : ""}
                </option>
              );
            })}
          </select>

          <div className="rounded-2xl border border-slate-200 p-4 mb-4 bg-slate-50">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setCalendarStep("checkIn")}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  calendarStep === "checkIn"
                    ? "border-sky-500 bg-sky-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">Check-In</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 leading-none">{checkInMeta.day}</p>
                <p className="mt-1 text-xs text-slate-600">{checkInMeta.weekDay ? `${checkInMeta.weekDay}, ${checkInMeta.monthYear}` : checkInMeta.monthYear}</p>
              </button>

              <button
                type="button"
                onClick={() => setCalendarStep("checkOut")}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  calendarStep === "checkOut"
                    ? "border-sky-500 bg-sky-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">Check-Out</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 leading-none">{checkOutMeta.day}</p>
                <p className="mt-1 text-xs text-slate-600">{checkOutMeta.weekDay ? `${checkOutMeta.weekDay}, ${checkOutMeta.monthYear}` : checkOutMeta.monthYear}</p>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <p className="text-xs font-medium text-slate-600">
                {calendarStep === "checkIn" ? "Select check-in date" : "Select check-out date"}
              </p>
              <p className="text-xs font-semibold text-sky-700">
                {totalNights > 0 ? `${totalNights} night${totalNights > 1 ? "s" : ""}` : "Choose your stay dates"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 text-[11px]">
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

            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setCalendarMonth((prev) => shiftMonth(prev, -1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Prev
              </button>
              <p className="text-sm font-semibold text-slate-700">Select dates</p>
              <button
                type="button"
                onClick={() => setCalendarMonth((prev) => shiftMonth(prev, 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Next
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {visibleMonthKeys.map((monthKey) => {
                const calendarCells = createCalendarCells(monthKey, calendarByDate);

                return (
                  <div key={monthKey} className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-center text-sm font-semibold text-slate-700 mb-2">
                      {getMonthLabel(monthKey)}
                    </p>

                    <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-500 mb-1">
                      {WEEK_DAYS.map((day) => (
                        <div key={`${monthKey}-${day}`} className="text-center py-1 font-semibold">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calendarCells.map((cell, index) => {
                        if (!cell) {
                          return (
                            <div
                              key={`${monthKey}-blank-${index}`}
                              className="h-12 rounded-lg border border-transparent"
                            />
                          );
                        }

                        const isPast = cell.date < todayDateText;
                        const isSoldOut = Number(cell.info?.available) <= 0;
                        const isDisabled = isPast || isSoldOut;
                        const isStart = cell.date === checkIn;
                        const isEnd = cell.date === checkOut;
                        const inRange = Boolean(checkIn && checkOut && cell.date > checkIn && cell.date < checkOut);
                        const dayLevel = cell.info?.level;

                        let colorClass = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";
                        if (dayLevel === "available") colorClass = "bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100";
                        if (dayLevel === "fast") colorClass = "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100";
                        if (dayLevel === "full") colorClass = "bg-rose-50 border-rose-200 text-rose-700";

                        if (inRange) colorClass = "bg-sky-50 border-sky-200 text-sky-800";
                        if (isStart || isEnd) colorClass = "bg-sky-600 border-sky-700 text-white hover:bg-sky-700";
                        if (isPast && !isStart && !isEnd) {
                          colorClass = "bg-slate-50 border-slate-200 text-slate-400";
                        }

                        return (
                          <button
                            key={cell.date}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleCalendarDateClick(cell.date, isSoldOut)}
                            className={`h-12 rounded-lg border px-1 py-1 text-center text-sm font-semibold transition ${colorClass} ${
                              isDisabled ? "cursor-not-allowed opacity-60" : ""
                            }`}
                          >
                            <span>{cell.day}</span>
                            {!isStart && !isEnd && (
                              <span
                                className={`mx-auto mt-1 block h-1.5 w-1.5 rounded-full ${getAvailabilityDotClass(dayLevel)}`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {calendarLoading && (
              <p className="mt-3 text-xs text-slate-600">Loading date-wise availability...</p>
            )}

            {calendarError && (
              <p className="mt-3 text-xs text-red-600">{calendarError}</p>
            )}
          </div>

          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-800">Price Summary</p>
            <p className="mt-1 text-xs text-emerald-700">
              {roomType
                ? `₹${selectedRoomRate} x ${totalNights || 0} night${totalNights === 1 ? "" : "s"}`
                : "Select room type and dates to see total amount"}
            </p>
            <p className="mt-1 text-base font-bold text-emerald-900">
              Total: ₹{estimatedTotal}
            </p>
          </div>

          <button
            onClick={bookHotel}
            disabled={loading || availabilityLoading || calendarLoading}
            className="w-full py-3 rounded-xl text-white bg-green-700 hover:bg-green-800 disabled:bg-gray-400"
          >
            {loading
              ? "Creating booking..."
              : availabilityLoading
              ? "Checking availability..."
              : calendarLoading
              ? "Loading availability..."
              : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
