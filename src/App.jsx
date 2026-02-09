import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Layout */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PageWrapper from "./components/PageWrapper";

/* Guards */
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

/* Public Pages */
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Gallery from "./pages/public/Gallery";
import Contact from "./pages/public/Contact";

/* Attractions */
import Attractions from "./pages/attractions/Attractions";

/* Waterfalls */
import Waterfalls from "./pages/waterfalls/Waterfalls";
import WaterfallDetails from "./pages/waterfalls/WaterfallDetails";

/* Temples */
import Temples from "./pages/temples/Temples";
import TempleDetails from "./pages/temples/TempleDetails";

/* View Points */
import ViewPoints from "./pages/Viewpoints/ViewPoints";
import ViewPointDetails from "./pages/Viewpoints/ViewpointDetails";

/* Festivals */
import Festivals from "./pages/festivals/Festivals";
import FestivalDetails from "./pages/festivals/FestivalDetails";

/* Booking */
import Booking from "./pages/Booking/Booking";
import MyBookings from "./pages/Booking/MyBookings";
import BookingSuccess from "./pages/Booking/BookingSuccess";
import BookingPay from "./pages/Booking/BookingPay";
import HotelDetails from "./pages/Booking/HotelDetails";

/* Dashboards */
import AdminDashboard from "./pages/admin/Dashboard";
import AddHotel from "./pages/admin/AddHotel";
import Hotels from "./pages/admin/HotelsList";
import HotelDashboard from "./pages/hotel/Dashboard";
import HotelBookings from "./pages/hotel/Bookings";
import HotelProfile from "./pages/hotel/HotelProfile";

/* Dev */
import RoleSwitch from "./pages/dev/RoleSwitch";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <PageWrapper>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* Attractions */}
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/attractions/waterfalls" element={<Waterfalls />} />
          <Route path="/waterfalls/:slug" element={<WaterfallDetails />} />

          <Route path="/attractions/temples" element={<Temples />} />
          <Route path="/temples/:slug" element={<TempleDetails />} />

          <Route path="/attractions/viewpoints" element={<ViewPoints />} />
          <Route path="/viewpoints/:slug" element={<ViewPointDetails />} />

          <Route path="/attractions/festivals" element={<Festivals />} />
          <Route path="/festivals/:slug" element={<FestivalDetails />} />

          {/* Booking */}
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

          {/* Admin */}
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

          {/* Hotel */}
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
            path="/hotel/bookings"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRole="hotel">
                  <HotelBookings />
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

          {/* Dev */}
          <Route path="/dev-role" element={<RoleSwitch />} />
        </Routes>
      </PageWrapper>

      <Footer />
    </Router>
  );
}

export default App;
