import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";

// Client pages
import Home from "./pages/client/Home";
import CarList from "./pages/client/CarList";
import CarDetail from "./pages/client/CarDetail";
import Booking from "./pages/client/Booking";
import Profile from "./pages/client/Profile";
import Services from "./pages/client/Services";
import Cart from "./pages/client/Cart";

// Admin pages
import Dashboard from "./pages/admin/AdminDashboard";
import DashboardCars from "./pages/admin/DashboardCars";
import DashboardUsers from "./pages/admin/DashboardUsers";
import DashboardBookings from "./pages/admin/DashboardBookings";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Client interface with DefaultLayout */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        {/* Admin interface - could use a different layout */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/cars" element={<DashboardCars />} />
        <Route path="/admin/users" element={<DashboardUsers />} />
        <Route path="/admin/bookings" element={<DashboardBookings />} />
      </Routes>
    </Router>
  );
};

export default App;
