import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Calendar, Clock, ChevronDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "flatpickr/dist/flatpickr.min.css";

// --- Calendar Component (Nên tách ra file riêng như Calendar.jsx) ---
const CalendarComponent = ({
  currentMonth,
  currentYear,
  onDateSelect,
  selectedDate,
  minSelectableDate, // Thêm prop này để vô hiệu hóa ngày trong quá khứ
  onMonthChange, // Callback khi tháng/năm thay đổi
}) => {
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 for Sunday, 6 for Saturday

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      onMonthChange(11, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      onMonthChange(0, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-100 min-w-[280px]">
      <div className="flex justify-between items-center mb-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          &lt;
        </button>
        <div className="font-medium text-sm">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
          <div key={index} className="text-xs font-medium text-gray-500 mb-1">
            {day}
          </div>
        ))}
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="w-8 h-8"></div> // Empty div for spacing
          ))}
        {days.map((day) => {
          const dayDate = new Date(currentYear, currentMonth, day);
          const isSelected =
            selectedDate &&
            dayDate.toDateString() === selectedDate.toDateString();
          const isDisabled = minSelectableDate && dayDate < minSelectableDate;

          return (
            <button
              type="button" // Change div to button for better accessibility
              key={day}
              className={`w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors
                ${
                  isSelected
                    ? "bg-red-800 text-white hover:bg-red-700"
                    : isDisabled
                      ? "text-gray-400 cursor-not-allowed" // Style for disabled dates
                      : "hover:bg-red-50 cursor-pointer"
                }`}
              onClick={() => !isDisabled && onDateSelect(dayDate)}
              disabled={isDisabled}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- CarSearchForm Component ---
const CarSearchForm = ({ className = "" }) => {
  const navigate = useNavigate(); // Hook từ React Router

  // Refs for closing dropdowns when clicking outside
  const locationDropdownRef = useRef(null);
  const pickupDateDropdownRef = useRef(null);
  const returnDateDropdownRef = useRef(null);

  // Cities list
  const cities = ["Đà Nẵng", "Hồ Chí Minh", "Hà Nội", "Nha Trang", "Đà Lạt"];

  // State to manage dropdowns
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showPickupDateDropdown, setShowPickupDateDropdown] = useState(false);
  const [showReturnDateDropdown, setShowReturnDateDropdown] = useState(false);

  // Form values - Use Date objects for dates
  const [location, setLocation] = useState("Đà Nẵng");
  const [pickupDate, setPickupDate] = useState(new Date()); // Default to current date
  const [pickupTime, setPickupTime] = useState("09:00"); // Default time
  const [returnDate, setReturnDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 3)),
  ); // Default to 3 days from now
  const [returnTime, setReturnTime] = useState("17:00"); // Default time

  // Calendar state for controlling displayed month/year
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [activeCalendarFor, setActiveCalendarFor] = useState(null); // 'pickup' or 'return'

  // Update calendar month/year when a date picker is opened
  useEffect(() => {
    if (showPickupDateDropdown && pickupDate) {
      setCalendarMonth(pickupDate.getMonth());
      setCalendarYear(pickupDate.getFullYear());
      setActiveCalendarFor("pickup");
    } else if (showReturnDateDropdown && returnDate) {
      setCalendarMonth(returnDate.getMonth());
      setCalendarYear(returnDate.getFullYear());
      setActiveCalendarFor("return");
    }
  }, [showPickupDateDropdown, showReturnDateDropdown, pickupDate, returnDate]);

  // Handle date selection from calendar
  const handleDateSelect = useCallback(
    (selectedDayDate) => {
      if (activeCalendarFor === "pickup") {
        setPickupDate(selectedDayDate);
        setShowPickupDateDropdown(false);
        // Ensure return date is not before pickup date
        if (selectedDayDate > returnDate) {
          setReturnDate(selectedDayDate);
        }
      } else if (activeCalendarFor === "return") {
        // Prevent selecting return date before pickup date
        if (selectedDayDate < pickupDate) {
          alert("Ngày trả xe không thể sớm hơn ngày nhận xe!");
          return;
        }
        setReturnDate(selectedDayDate);
        setShowReturnDateDropdown(false);
      }
    },
    [activeCalendarFor, pickupDate, returnDate],
  );

  // Handle location selection
  const handleLocationSelect = useCallback((city) => {
    setLocation(city);
    setShowLocationDropdown(false);
  }, []);

  // Handle form submission - redirects to /cars with search parameters
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const searchData = {
        location,
        pickupDate: pickupDate.toLocaleDateString("en-GB"), // Format for URL if needed
        pickupTime,
        returnDate: returnDate.toLocaleDateString("en-GB"), // Format for URL if needed
        returnTime,
      };
      console.log("Search form submitted:", searchData);

      // Redirect to cars page using navigate
      // You can also pass state or query parameters like this:
      navigate("/cars", { state: searchData });
      // Or with query params:
      // navigate(`/cars?location=${location}&pickupDate=${pickupDate.toISOString()}&pickupTime=${pickupTime}&returnDate=${returnDate.toISOString()}&returnTime=${returnTime}`);
    },
    [location, pickupDate, pickupTime, returnDate, returnTime, navigate],
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setShowLocationDropdown(false);
      }
      if (
        pickupDateDropdownRef.current &&
        !pickupDateDropdownRef.current.contains(event.target)
      ) {
        setShowPickupDateDropdown(false);
      }
      if (
        returnDateDropdownRef.current &&
        !returnDateDropdownRef.current.contains(event.target)
      ) {
        setShowReturnDateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${className} bg-white rounded-lg shadow-sm p-4 mb-4`}>
      <form
        className="flex flex-wrap items-center gap-4"
        onSubmit={handleSearch}
      >
        {/* Location Selection */}
        <div
          className="relative flex-1 min-w-[200px]"
          ref={locationDropdownRef}
        >
          <label className="flex items-center text-sm text-gray-600 mb-1">
            <MapPin className="w-4 h-4 mr-1 text-red-800" />
            Địa điểm nhận xe
          </label>
          <div
            className="border border-gray-300 rounded p-2 flex items-center justify-between cursor-pointer hover:border-red-300 transition-colors"
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
          >
            <span>{location}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {showLocationDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
              {cities.map((city) => (
                <div
                  key={city}
                  className="p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleLocationSelect(city)}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pickup Date */}
        <div
          className="relative flex-1 min-w-[150px]"
          ref={pickupDateDropdownRef}
        >
          <label className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar className="w-4 h-4 mr-1 text-red-800" />
            Ngày nhận xe
          </label>
          <div
            className="border border-gray-300 rounded p-2 flex items-center justify-between cursor-pointer hover:border-red-300 transition-colors"
            onClick={() => {
              setShowPickupDateDropdown(!showPickupDateDropdown);
              setShowReturnDateDropdown(false); // Close other dropdown
            }}
          >
            <span>{pickupDate.toLocaleDateString("vi-VN")}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {showPickupDateDropdown && (
            <div className="absolute z-10 mt-1 left-0 top-full">
              {" "}
              {/* Position calendar */}
              <CalendarComponent
                currentMonth={calendarMonth}
                currentYear={calendarYear}
                onMonthChange={setCalendarMonth} // Pass setter for month/year
                onDateSelect={handleDateSelect}
                selectedDate={pickupDate}
                minSelectableDate={new Date(new Date().setHours(0, 0, 0, 0))} // Can't select past dates
              />
            </div>
          )}
        </div>

        {/* Pickup Time */}
        <div className="flex-1 min-w-[120px]">
          <label className="flex items-center text-sm text-gray-600 mb-1">
            <Clock className="w-4 h-4 mr-1 text-red-800" />
            Giờ nhận xe
          </label>
          <input
            type="time" // Changed to type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
          />
        </div>

        {/* Return Date */}
        <div
          className="relative flex-1 min-w-[150px]"
          ref={returnDateDropdownRef}
        >
          <label className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar className="w-4 h-4 mr-1 text-red-800" />
            Ngày trả xe
          </label>
          <div
            className="border border-gray-300 rounded p-2 flex items-center justify-between cursor-pointer hover:border-red-300 transition-colors"
            onClick={() => {
              setShowReturnDateDropdown(!showReturnDateDropdown);
              setShowPickupDateDropdown(false); // Close other dropdown
            }}
          >
            <span>{returnDate.toLocaleDateString("vi-VN")}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {showReturnDateDropdown && (
            <div className="absolute z-10 mt-1 left-0 top-full">
              {" "}
              {/* Position calendar */}
              <CalendarComponent
                currentMonth={calendarMonth}
                currentYear={calendarYear}
                onMonthChange={setCalendarMonth} // Pass setter for month/year
                onDateSelect={handleDateSelect}
                selectedDate={returnDate}
                minSelectableDate={
                  pickupDate
                    ? new Date(pickupDate.setHours(0, 0, 0, 0))
                    : new Date(new Date().setHours(0, 0, 0, 0))
                } // Can't select before pickup date
              />
            </div>
          )}
        </div>

        {/* Return Time */}
        <div className="flex-1 min-w-[120px]">
          <label className="flex items-center text-sm text-gray-600 mb-1">
            <Clock className="w-4 h-4 mr-1 text-red-800" />
            Giờ trả xe
          </label>
          <input
            type="time" // Changed to type="time"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="bg-red-800 hover:bg-red-700 text-white font-medium px-4 py-2 rounded transition-colors flex items-center"
          >
            TÌM XE
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarSearchForm;
