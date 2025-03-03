import React, { useState, useEffect } from "react";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";

export const Navlinks = [
  { id: 1, name: "Trang Chủ", link: "/" },
  { id: 2, name: "Xe", link: "/cars" },
  { id: 3, name: "Dịch Vụ", link: "/services" }, // Đã sửa từ "/#about" thành "/services"
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <>
      <div className="h-16"></div>

      <div
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300
        ${
          scrolled
            ? "py-2 bg-gray-200 shadow-md"
            : "py-3 bg-white backdrop-blur-md"
        }`}
      >
        <div className="w-full max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-start w-full md:w-auto">
              <Link to="/" className="text-xl font-bold text-gray-900 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AutoDrive
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
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      showLocations ? "rotate-180" : ""
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

              {/* Signup button - Changed to white with black border */}
              <Link
                to="/signup"
                className="ml-8 px-5 py-2 bg-white text-gray-900 border-2 border-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-300 shadow-sm"
              >
                Đăng Ký
              </Link>
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
          navlinks={Navlinks} // Truyền Navlinks đã cập nhật vào ResponsiveMenu
        />
      </div>
    </>
  );
};

export default Navbar;
