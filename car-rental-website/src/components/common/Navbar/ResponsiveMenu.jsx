import React from "react";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { FiUser, FiLogOut, FiShoppingCart, FiShoppingBag } from "react-icons/fi";

const ResponsiveMenu = ({
    showMenu,
    toggleMenu,
    locations,
    currentLocation,
    selectLocation,
    navlinks,
    isAuthenticated,
    user,
    logout,
    showLoginModal
}) => {
    return (
        <div
            className={`md:hidden fixed top-[60px] left-0 w-full h-screen bg-white transform ${showMenu ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out z-50`}
        >
            <div className="p-4">
                {/* User Profile Section khi đã đăng nhập */}
                {isAuthenticated && (
                    <div className="mb-4 p-4 border-b border-gray-200">
                        <div className="flex items-center">
                            {/* Avatar người dùng */}
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-red-800 flex items-center justify-center text-white font-medium">
                                    {user?.name ? user.name.charAt(0).toUpperCase() :
                                        user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}

                            <div className="ml-3">
                                <p className="text-base font-medium text-gray-900">{user?.name || 'Người dùng'}</p>
                                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <ul className="flex flex-col gap-4 py-4 border-b border-gray-200">
                    {navlinks.map(({ id, name, link }) => (
                        <li key={id} className="py-2">
                            {/* Sử dụng Link hoặc a tùy thuộc vào loại link */}
                            {link.startsWith("/#") ? (
                                <a
                                    href={link}
                                    className="text-lg text-gray-800 block hover:text-gray-600 transition-colors duration-300 font-medium"
                                    onClick={toggleMenu}
                                >
                                    {name}
                                </a>
                            ) : (
                                <Link
                                    to={link}
                                    className="text-lg text-gray-800 block hover:text-gray-600 transition-colors duration-300 font-medium"
                                    onClick={toggleMenu}
                                >
                                    {name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="py-4 border-b border-gray-200">
                    <p className="text-gray-500 mb-3 flex items-center">
                        <IoLocationOutline className="mr-2 text-lg" />
                        Thành phố hiện tại: {currentLocation}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                        {locations.map((location) => (
                            <button
                                key={location.id}
                                onClick={() => {
                                    selectLocation(location.name);
                                    toggleMenu();
                                }}
                                className={`text-left px-4 py-2 rounded-lg transition-colors duration-200 ${currentLocation === location.name
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {location.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="py-4">
                    {isAuthenticated ? (
                        <div className="flex flex-col gap-3">
                            {/* Thêm Link đến trang profile */}
                            <Link
                                to="/profile"
                                onClick={toggleMenu}
                                className="flex items-center w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300"
                            >
                                <FiUser className="mr-2" />
                                Thông tin cá nhân
                            </Link>

                            <Link
                                to="/cart"
                                onClick={toggleMenu}
                                className="flex items-center w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300"
                            >
                                <FiShoppingCart className="mr-2" />
                                Giỏ hàng
                            </Link>
                            <Link
                                to="/donhang"
                                onClick={toggleMenu}
                                className="flex items-center w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300"
                            >
                                <FiShoppingBag className="mr-2" />
                                Đơn hàng
                            </Link>

                            

                            {/* Nút đăng xuất */}
                            <button
                                onClick={() => {
                                    logout();
                                    toggleMenu();
                                }}
                                className="flex items-center justify-center w-full py-3 bg-white text-red-800 border-2 border-red-800 rounded-lg text-base font-medium hover:bg-red-50 transition-all duration-300"
                            >
                                <FiLogOut className="mr-2" />
                                Đăng Xuất
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                showLoginModal();
                                toggleMenu();
                            }}
                            className="block w-full text-center py-3 bg-white text-gray-900 border-2 border-gray-900 rounded-lg text-base font-medium hover:bg-gray-100 transition-all duration-300"
                        >
                            Đăng Nhập
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResponsiveMenu;
