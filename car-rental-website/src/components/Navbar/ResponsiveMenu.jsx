import React from "react";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";

const ResponsiveMenu = ({ 
  showMenu, 
  toggleMenu, 
  locations, 
  currentLocation,
  selectLocation,
  navlinks
}) => {
  return (
    <div
      className={`md:hidden fixed top-[60px] left-0 w-full h-screen bg-white transform ${
        showMenu ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4">
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
                className={`text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentLocation === location.name
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
          <Link
            to="/signup"
            className="block w-full text-center py-3 bg-white text-gray-900 border-2 border-gray-900 rounded-lg text-base font-medium hover:bg-gray-100 transition-all duration-300"
            onClick={toggleMenu}
          >
            Đăng Ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
