import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddHotel from "./pages/admin/AddHotel";
import Hotels from "./pages/admin/HotelsList";
import HotelBookings from "./pages/hotel/Bookings";
import MyBookings from "./pages/Booking/MyBookings";
import HotelDetails from "./pages/Booking/HotelDetails";

import HotelProfile from "./pages/hotel/HotelProfile";

import BookingSuccess from "./pages/Booking/BookingSuccess";

/* ===== Common Layout ===== */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PageWrapper from "./components/PageWrapper";
import BookingPay from "./pages/Booking/BookingPay";

/* ===== Guards ===== */
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

/* ===== Pages ===== */
import Home from "./pages/public/Home";

/* Auth */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* Attractions */
import Attractions from "./pages/attractions/Attractions";

/* Waterfalls */
import Waterfalls from "./pages/waterfalls/Waterfalls";
import WaterfallDetails from "./pages/waterfalls/WaterfallDetails";

/* Temples */
import Temples from "./pages/temples/Temples";
import TempleDetails from "./pages/temples/TempleDetails";

/* Festivals */
import Festivals from "./pages/festivals/Festivals";

/* Booking */
import Booking from "./pages/Booking/Booking";
import RoleSwitch from "./pages/dev/RoleSwitch";

/* Dashboards */
import AdminDashboard from "./pages/admin/Dashboard";
import HotelDashboard from "./pages/hotel/Dashboard";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <PageWrapper>
       <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

<Route
  path="/hotel/profile"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRole="hotel">
        <HotelProfile />
      </RoleGuard>
    </ProtectedRoute>
  }
/>


<Route
  path="/hotel/profile"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRole="hotel">
        <HotelProfile />
      </RoleGuard>
    </ProtectedRoute>
  }
/>

        {/* Attractions */}
        <Route path="/attractions" element={<Attractions />} />
        <Route path="/attractions/waterfalls" element={<Waterfalls />} />
        <Route path="/waterfalls/:slug" element={<WaterfallDetails />} />
        <Route path="/attractions/temples" element={<Temples />} />
        <Route path="/temples/:slug" element={<TempleDetails />} />
        <Route path="/attractions/festivals" element={<Festivals />} />

        {/* Booking (user only later) */}
<Route
  path="/booking"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRole="user">
        <Booking />
      </RoleGuard>
    </ProtectedRoute>
  }
/>


<Route
  path="/my-bookings"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRole="user">
        <MyBookings />
      </RoleGuard>
    </ProtectedRoute>
  }
/>

<Route
  path="/booking/success/:bookingId"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRole="user">
        <BookingSuccess />
      </RoleGuard>
    </ProtectedRoute>
  }
/>
<Route
  path="/booking/pay/:bookingId"
  element={
    <ProtectedRoute>
      <BookingPay />
    </ProtectedRoute>
  }
/>


        {/* Dev */}
        <Route path="/dev-role" element={<RoleSwitch />} />
<Route
  path="/hotel/bookings"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRole="hotel">
        <HotelBookings />
      </RoleGuard>
    </ProtectedRoute>
  }
/>
        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRole="admin">
                <AdminDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* HOTEL */}
        <Route
          path="/hotel/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRole="hotel">
                <HotelDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/add-hotel"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRole="admin">
        <AddHotel />
      </RoleGuard>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/hotels"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRole="admin">
        <Hotels />
      </RoleGuard>
    </ProtectedRoute>
  }
/>
<Route
  path="/booking/:id"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRole="user">
        <HotelDetails />
      </RoleGuard>
    </ProtectedRoute>
  }
/>


      </Routes>
</PageWrapper>
      <Footer />
    </Router>
  );
}

export default App;
