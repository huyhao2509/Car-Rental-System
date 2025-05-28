import React, { useState, useEffect, useRef } from "react";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import { FiUser, FiLogOut, FiShoppingCart, FiShoppingBag } from "react-icons/fi"; // Import icons cho profile và logout
import { Link } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/features/auth/LoginModal';

export const Navlinks = [
    { id: 1, name: "Dịch Vụ", link: "/services" },
    { id: 2, name: "Liên Hệ", link: "/contact" },
];

export const Locations = [
    { id: 1, name: "Hà Nội", link: "/#hanoi" },
    { id: 2, name: "Đà Nẵng", link: "/#danang" },
    { id: 3, name: "Hồ Chí Minh", link: "/#hochiminh" },
];

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showLocations, setShowLocations] = useState(false);
    const [currentLocation, setCurrentLocation] = useState("Hồ Chí Minh");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false); // State mới cho dropdown

    const userDropdownRef = useRef(null); // Ref để xử lý click outside
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Xử lý click outside để đóng user dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const toggleLocations = () => {
        setShowLocations(!showLocations);
    };

    const selectLocation = (locationName) => {
        setCurrentLocation(locationName);
        setShowLocations(false);
    };

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown);
    };

    const handleLogout = () => {
        setShowUserDropdown(false);
        logout();
    };

    return (
        <>
            <div className="h-16"></div>

            <div
                className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300
        ${scrolled
                        ? "py-2 bg-gray-200 shadow-md"
                        : "py-3 bg-white backdrop-blur-md"
                    }`}
            >
                <div className="w-full max-w-screen-xl mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center justify-start w-full md:w-auto">
                            <Link to="/" className="flex items-center">
                                <div className="mr-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 64 64"
                                        className="h-11 w-11"
                                    >
                                        <rect x="0" y="0" width="64" height="64" rx="12" fill="#991b1b" />
                                        <path
                                            d="M51.5,28.5h-39c-1.1,0-2,0.9-2,2v8c0,1.1,0.9,2,2,2h39c1.1,0,2-0.9,2-2v-8C53.5,29.4,52.6,28.5,51.5,28.5z"
                                            fill="#ffffff"
                                        />
                                        <path
                                            d="M17,25l3-9c0.5-1.5,1.9-2.5,3.5-2.5h17c1.6,0,3,1,3.5,2.5l3,9"
                                            fill="#ffffff"
                                            stroke="#ffffff"
                                            strokeWidth="2"
                                        />
                                        <rect x="14.5" y="25.5" width="35" height="3" rx="1" fill="#ffffff" />
                                        <circle cx="20" cy="34.5" r="4" fill="#1e293b" />
                                        <circle cx="20" cy="34.5" r="1.5" fill="#94a3b8" />
                                        <circle cx="44" cy="34.5" r="4" fill="#1e293b" />
                                        <circle cx="44" cy="34.5" r="1.5" fill="#94a3b8" />
                                    </svg>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-red-800 font-extrabold text-3xl tracking-tight mr-0.5">Car</span>
                                    <span className="text-gray-800 font-extrabold text-3xl tracking-tight">Rental</span>
                                </div>
                            </Link>
                        </div>

                        <nav className="hidden md:flex items-center ml-auto">
                            <ul className="flex items-center gap-8">
                                {Navlinks.map(({ id, name, link }) => (
                                    <li key={id} className="py-1">
                                        {/* Sử dụng Link hoặc a tùy thuộc vào loại link */}
                                        {link.startsWith("/#") ? (
                                            <a
                                                href={link}
                                                className="text-base text-gray-800 hover:text-gray-600 transition-colors duration-300 font-medium"
                                            >
                                                {name}
                                            </a>
                                        ) : (
                                            <Link
                                                to={link}
                                                className="text-base text-gray-800 hover:text-gray-600 transition-colors duration-300 font-medium"
                                            >
                                                {name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {/* Location Selector */}
                            <div className="flex items-center ml-8 relative">
                                <button
                                    onClick={toggleLocations}
                                    className="flex items-center text-gray-800 bg-gray-100 border border-gray-200 hover:border-gray-300 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm transition-all duration-300"
                                >
                                    <IoLocationOutline className="mr-1 text-lg text-gray-700" />
                                    {currentLocation}
                                    <svg
                                        className={`ml-1 h-4 w-4 transition-transform duration-300 ${showLocations ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Locations Dropdown */}
                                {showLocations && (
                                    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-md py-2 w-40 z-50 border border-gray-100">
                                        {Locations.map((location) => (
                                            <button
                                                key={location.id}
                                                onClick={() => selectLocation(location.name)}
                                                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                {location.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* User info or Login button */}
                            {isAuthenticated ? (
                                <div className="ml-8 relative" ref={userDropdownRef}>
                                    <button
                                        onClick={toggleUserDropdown}
                                        className="flex items-center focus:outline-none"
                                    >
                                        {/* Avatar người dùng */}
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt="User Avatar"
                                                className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-red-800 flex items-center justify-center text-white">
                                                {user?.name ? user.name.charAt(0).toUpperCase() :
                                                    user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                        )}

                                        <svg
                                            className={`ml-1 h-4 w-4 text-gray-600 transition-transform duration-300 ${showUserDropdown ? "rotate-180" : ""}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {showUserDropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{user?.name || 'Người dùng'}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>

                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <FiUser className="mr-2 text-gray-500" />
                                                Thông tin cá nhân
                                            </Link>
                                            <Link
                                                to="/cart"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <FiShoppingCart className="mr-2 text-gray-500" />
                                                Giỏ hàng
                                            </Link>

                                            <Link
                                                to="/donhang"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <FiShoppingBag className="mr-2 text-gray-500" />
                                                Đơn hàng
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <FiLogOut className="mr-2 text-gray-500" />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="ml-8 px-5 py-2 bg-white text-red-800 border-2 border-red-800 rounded-full text-sm font-medium hover:bg-red-50 transition-all duration-300 shadow-sm"
                                >
                                    Đăng Nhập
                                </button>
                            )}
                        </nav>

                        {/* Mobile menu button */}
                        <div className="absolute right-4 md:hidden">
                            <button
                                className="p-1.5 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-300 border border-gray-200"
                                onClick={toggleMenu}
                            >
                                {showMenu ? (
                                    <HiMenuAlt1 className="text-lg" />
                                ) : (
                                    <HiMenuAlt3 className="text-lg" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <ResponsiveMenu
                    showMenu={showMenu}
                    toggleMenu={toggleMenu}
                    locations={Locations}
                    currentLocation={currentLocation}
                    selectLocation={selectLocation}
                    navlinks={Navlinks}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    logout={logout}
                    showLoginModal={() => setShowLoginModal(true)}
                />
            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
};

export default Navbar;
