import React, { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, Clock, ChevronDown, ArrowRight } from "lucide-react";

const CarSearchForm = ({ className = "" }) => {
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
  
  // Form values
  const [location, setLocation] = useState("Đà Nẵng");
  const [pickupDate, setPickupDate] = useState("04/03/2025");
  const [pickupTime, setPickupTime] = useState("23:00");
  const [returnDate, setReturnDate] = useState("07/03/2025");
  const [returnTime, setReturnTime] = useState("03:00");

  // Calendar state and helpers
  const currentDate = new Date();
  const [calendarMonth, setCalendarMonth] = useState(currentDate.getMonth());
  const [calendarYear, setCalendarYear] = useState(currentDate.getFullYear());
  const [activeCalendarType, setActiveCalendarType] = useState('pickup'); // 'pickup' or 'return'

  // Month names
  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  // Generate days for calendar
  const generateCalendarDays = (month, year) => {
    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const days = generateCalendarDays(calendarMonth, calendarYear);
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();

  // Calendar navigation handlers
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    const selectedDate = `${day < 10 ? '0' + day : day}/${(calendarMonth + 1) < 10 ? '0' + (calendarMonth + 1) : (calendarMonth + 1)}/${calendarYear}`;
    
    if (activeCalendarType === 'pickup') {
      setPickupDate(selectedDate);
      setShowPickupDateDropdown(false);
    } else {
      setReturnDate(selectedDate);
      setShowReturnDateDropdown(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (city) => {
    setLocation(city);
    setShowLocationDropdown(false);
  };

  // Handle form submission - redirects to /cars with search parameters
  const handleSearch = (e) => {
    e.preventDefault();
    const searchData = {
      location,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime
    };
    console.log("Search form submitted:", searchData);
    
    // Redirect to cars page using window.location
    window.location.href = '/cars';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (pickupDateDropdownRef.current && !pickupDateDropdownRef.current.contains(event.target)) {
        setShowPickupDateDropdown(false);
      }
      if (returnDateDropdownRef.current && !returnDateDropdownRef.current.contains(event.target)) {
        setShowReturnDateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calendar component
  const CalendarComponent = () => (
    <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <button 
          type="button" 
          onClick={handlePrevMonth}
          className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          &lt;
        </button>
        <div className="font-medium text-sm">{monthNames[calendarMonth]} {calendarYear}</div>
        <button 
          type="button" 
          onClick={handleNextMonth}
          className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-100 rounded transition-colors" 
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
          <div key={index} className="text-xs font-medium text-gray-500 mb-1">{day}</div>
        ))}
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`}></div>
        ))}
        {days.map(day => {
          // Format date for comparison
          const formattedDay = `${day < 10 ? '0' + day : day}/${(calendarMonth + 1) < 10 ? '0' + (calendarMonth + 1) : (calendarMonth + 1)}/${calendarYear}`;
          const isSelected = activeCalendarType === 'pickup' 
            ? formattedDay === pickupDate 
            : formattedDay === returnDate;
          
          return (
            <div 
              key={day} 
              className={`w-8 h-8 flex items-center justify-center text-sm cursor-pointer
                        hover:bg-red-50 rounded-full transition-colors
                        ${isSelected ? 'bg-red-800 text-white hover:bg-red-700' : ''}`}
              onClick={() => handleDateSelect(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`${className} bg-white rounded-lg shadow-sm p-4 mb-4`}>
      <form className="flex flex-wrap items-center gap-4" onSubmit={handleSearch}>
        {/* Location Selection */}
        <div className="relative flex-1 min-w-[200px]" ref={locationDropdownRef}>
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
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg">
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
        <div className="relative flex-1 min-w-[150px]" ref={pickupDateDropdownRef}>
          <label className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar className="w-4 h-4 mr-1 text-red-800" />
            Ngày nhận xe
          </label>
          <div 
            className="border border-gray-300 rounded p-2 flex items-center justify-between cursor-pointer hover:border-red-300 transition-colors"
            onClick={() => {
              setActiveCalendarType('pickup');
              setShowPickupDateDropdown(!showPickupDateDropdown);
              setShowReturnDateDropdown(false);
            }}
          >
            <span>{pickupDate}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
          
          {showPickupDateDropdown && (
            <div className="absolute z-10 mt-1">
              <CalendarComponent />
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
            type="text"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
          />
        </div>
        
        {/* Return Date */}
        <div className="relative flex-1 min-w-[150px]" ref={returnDateDropdownRef}>
          <label className="flex items-center text-sm text-gray-600 mb-1">
            <Calendar className="w-4 h-4 mr-1 text-red-800" />
            Ngày trả xe
          </label>
          <div 
            className="border border-gray-300 rounded p-2 flex items-center justify-between cursor-pointer hover:border-red-300 transition-colors"
            onClick={() => {
              setActiveCalendarType('return');
              setShowReturnDateDropdown(!showReturnDateDropdown);
              setShowPickupDateDropdown(false);
            }}
          >
            <span>{returnDate}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
          
          {showReturnDateDropdown && (
            <div className="absolute z-10 mt-1">
              <CalendarComponent />
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
            type="text"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
          />
        </div>
        
        {/* Search Button - changed to red-800 */}
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
