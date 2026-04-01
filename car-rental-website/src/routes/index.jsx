import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
const DefaultLayout = lazy(() => import('@/layouts/DefaultLayout'));

// Auth Pages
const LoginPage = lazy(() => import('@/pages/client/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/client/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/client/auth/ForgotPasswordPage'));

// Client Pages
const HomePage = lazy(() => import('@/pages/client/home/Home'));
const CarList = lazy(() => import('@/pages/client/cars/CarList'));
const CarDetail = lazy(() => import('@/pages/client/cars/CarDetail'));
const ContactPage = lazy(() => import('@/pages/client/contact/ContactPage'));
const Services = lazy(() => import('@/pages/client/services/Services'));

// Client Account Pages
const ProfilePage = lazy(() => import('@/pages/client/profile/Profile'));
const BookingPage = lazy(() => import('@/pages/client/reservations/Booking'));
const MomoPayment = lazy(() => import('@/pages/client/payment/MomoPayment'));
const DonHang = lazy(() => import('@/pages/client/donHang'));
const Cart = lazy(() => import('@/pages/client/cars/Cart'));
const PaymentPage = lazy(() => import('@/pages/client/donHang/PaymentPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const DashboardBookings = lazy(() => import('@/pages/admin/DashboardBookings'));
const DashboardCars = lazy(() => import('@/pages/admin/DashboardCars'));
const DashboardPromotions = lazy(() => import('@/pages/admin/DashboardPromotions'));
const DashboardReports = lazy(() => import('@/pages/admin/DashboardReports'));
const DashboardUsers = lazy(() => import('@/pages/admin/DashboardUsers'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="p-4 text-center">Dang tai...</div>}>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Test route for homepage without layout */}
                <Route path="/home-test" element={<HomePage />} />

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
                        <Route path="don-hang/thanh-toan" element={<PaymentPage />} />
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
        </Suspense>
    );
};

export default AppRoutes;
