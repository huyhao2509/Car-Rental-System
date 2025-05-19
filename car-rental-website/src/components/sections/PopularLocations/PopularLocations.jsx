import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Import các hình ảnh địa điểm
// Trong dự án thực tế, bạn cần thêm các hình ảnh vào thư mục public hoặc assets
// và import chúng đúng cách, ví dụ:
// import hcmImage from '../../assets/locations/hcm.jpg';

const PopularLocations = () => {
  // Dữ liệu các địa điểm
  const locations = [
    {
      id: 1,
      name: 'TP Hồ Chí Minh',
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1000&auto=format&fit=crop',
      carCount: 1500
    },
    {
      id: 2,
      name: 'Hà Nội',
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop',
      carCount: 850
    },
    {
      id: 3,
      name: 'Đà Nẵng',
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop',
      carCount: 600
    },
    {
      id: 4,
      name: 'Bình Dương',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop',
      carCount: 300
    },
    {
      id: 5,
      name: 'Nha Trang',
      image: 'https://images.unsplash.com/photo-1540874150572-3eec2b485662?q=80&w=1000&auto=format&fit=crop',
      carCount: 250
    },
    {
      id: 6,
      name: 'Đà Lạt',
      image: 'https://images.unsplash.com/photo-1558459654-c4e459754fa4?q=80&w=1000&auto=format&fit=crop',
      carCount: 280
    }
  ];

  // Refs để scroll carousel
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      if (direction === 'left') {
        current.scrollLeft -= 340;
      } else {
        current.scrollLeft += 340;
      }
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Địa Điểm Nổi Bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá dịch vụ thuê xe tự lái tại các thành phố lớn với đa dạng lựa chọn xe và giá cả cạnh tranh
          </p>
        </div>

        <div className="relative">
          {/* Nút scroll trái */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-colors duration-300 focus:outline-none hidden md:block"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-gray-700" size={20} />
          </button>

          {/* Container chứa các địa điểm */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide scroll-smooth snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {locations.map((location) => (
              <div 
                key={location.id}
                className="min-w-[300px] h-[400px] bg-gray-100 rounded-2xl overflow-hidden snap-start shrink-0 relative shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
              >
                {/* Hình ảnh */}
                <img 
                  src={location.image} 
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay và thông tin */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-5">
                  <h3 className="text-white text-2xl font-bold">{location.name}</h3>
                  <p className="text-white text-opacity-80">{location.carCount}+ xe</p>
                </div>
              </div>
            ))}
          </div>

          {/* Nút scroll phải */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-colors duration-300 focus:outline-none hidden md:block"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-gray-700" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularLocations;
