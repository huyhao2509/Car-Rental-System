import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/client/Home";
import CarList from "./pages/client/CarList";
import CarDetail from "./pages/client/CarDetail";
import Booking from "./pages/client/Booking";
import Profile from "./pages/client/Profile";

import Dashboard from "./pages/admin/Dashboard";
import DashboardCars from "./pages/admin/DashboardCars";
import DashboardUsers from "./pages/admin/DashboardUsers";
import DashboardBookings from "./pages/admin/DashboardBookings";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Giao diện khách hàng */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/profile" element={<Profile />} />

        {/* Giao diện quản trị */}
        {/* <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/cars" element={<DashboardCars />} />
        <Route path="/admin/users" element={<DashboardUsers />} />
        <Route path="/admin/bookings" element={<DashboardBookings />} /> */} 
      </Routes>
    </Router>
  );
};

export default App;
