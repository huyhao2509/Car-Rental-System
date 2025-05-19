import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout';

// Auth Pages
import LoginPage from '@/pages/client/auth/LoginPage';
import RegisterPage from '@/pages/client/auth/RegisterPage';

// Client Pages
import HomePage from '@/pages/client/home/Home';
import CarList from '@/pages/client/cars/CarList';
import CarDetail from '@/pages/client/cars/CarDetail';
import ContactPage from '@/pages/client/contact/ContactPage';
import Services from '@/pages/client/services/Services';

// Client Account Pages
import ProfilePage from '@/pages/client/profile/Profile';
import BookingPage from '@/pages/client/reservations/Booking';
import MomoPayment from '@/pages/client/payment/MomoPayment';
import DonHang from '@/pages/client/donHang';
import Cart from '@/pages/client/cars/Cart';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import DashboardBookings from '@/pages/admin/DashboardBookings';
import DashboardCars from '@/pages/admin/DashboardCars';
import DashboardPromotions from '@/pages/admin/DashboardPromotions';
import DashboardReports from '@/pages/admin/DashboardReports';
import DashboardUsers from '@/pages/admin/DashboardUsers';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Main Layout Routes */}
            <Route path="/" element={<DefaultLayout />}>
                <Route index element={<HomePage />} />
                <Route path="cars">
                    <Route index element={<CarList />} />
                    <Route path=":id" element={<CarDetail />} />
                </Route>
                <Route path="contact" element={<ContactPage />} />
                <Route path="services" element={<Services />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="bookings" element={<BookingPage />} />
                    <Route path="payment" element={<MomoPayment />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="donhang" element={<DonHang />} />
                </Route>
            </Route>

            <Route path="/admin" element={<ProtectedRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="bookings" element={<DashboardBookings />} />
                <Route path="cars" element={<DashboardCars />} />
                <Route path="promotions" element={<DashboardPromotions />} />
                <Route path="reports" element={<DashboardReports />} />
                <Route path="users" element={<DashboardUsers />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
