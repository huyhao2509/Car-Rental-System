import React from "react";
import { Link } from "react-router-dom";
import { 
  FaCarSide, 
  FaShieldAlt, 
  FaHandshake, 
  FaRegClock,
  FaPhone,
  FaEnvelope,
  FaLongArrowAltRight,
  FaCalendarAlt,
  FaCreditCard
} from "react-icons/fa";

const Services = () => {
  // Danh sách dịch vụ
  const servicesList = [
    {
      id: 1,
      icon: <FaCarSide className="text-4xl text-red-800 mb-4" />,
      title: "Thuê xe tự lái ngắn hạn",
      description: "Dịch vụ thuê xe tự lái theo ngày phù hợp cho chuyến đi ngắn ngày hoặc cuối tuần với nhiều lựa chọn xe đa dạng.",
      features: [
        "Thủ tục đơn giản, nhanh chóng", 
        "Giá cả linh hoạt theo thời gian", 
        "Hỗ trợ giao nhận xe tận nơi"
      ]
    },
    {
      id: 2,
      icon: <FaRegClock className="text-4xl text-red-800 mb-4" />,
      title: "Thuê xe theo giờ",
      description: "Dịch vụ thuê xe theo giờ linh hoạt, phù hợp với nhu cầu di chuyển ngắn trong thành phố và tiết kiệm chi phí.",
      features: [
        "Tính phí theo giờ thực tế", 
        "Quy trình đặt xe nhanh chóng", 
        "Phù hợp cho các cuộc họp, sự kiện"
      ]
    },
    {
      id: 3,
      icon: <FaHandshake className="text-4xl text-red-800 mb-4" />,
      title: "Thuê xe dài hạn",
      description: "Giải pháp thuê xe dài hạn từ 1 tháng trở lên với chi phí tối ưu và nhiều ưu đãi đặc biệt.",
      features: [
        "Giảm giá cho hợp đồng dài hạn", 
        "Bảo dưỡng định kỳ miễn phí", 
        "Hỗ trợ thay xe nhanh chóng khi cần"
      ]
    },
    {
      id: 4,
      icon: <FaShieldAlt className="text-4xl text-red-800 mb-4" />,
      title: "Bảo hiểm toàn diện",
      description: "Mọi xe đều được mua bảo hiểm đầy đủ, đảm bảo an toàn cho khách hàng trong suốt quá trình sử dụng.",
      features: [
        "Bảo hiểm vật chất xe", 
        "Bảo hiểm trách nhiệm dân sự", 
        "Hỗ trợ xử lý sự cố 24/7"
      ]
    },
    {
      id: 5,
      icon: <FaHandshake className="text-4xl text-red-800 mb-4" />,
      title: "Dịch vụ doanh nghiệp",
      description: "Cung cấp giải pháp thuê xe dài hạn cho doanh nghiệp với nhiều ưu đãi đặc biệt và dịch vụ riêng biệt.",
      features: [
        "Hợp đồng dài hạn linh hoạt", 
        "Giá ưu đãi cho số lượng lớn", 
        "Hỗ trợ quản lý đội xe"
      ]
    },
    {
      id: 6,
      icon: <FaCarSide className="text-4xl text-red-800 mb-4" />,
      title: "Đa dạng phương tiện",
      description: "Cung cấp đầy đủ các loại xe từ phổ thông đến hạng sang, đáp ứng mọi nhu cầu di chuyển của khách hàng.",
      features: [
        "Xe 4 chỗ, 7 chỗ, 16 chỗ", 
        "Xe sang và xe thể thao", 
        "Xe điện thân thiện môi trường"
      ]
    },
  ];

  // Các câu hỏi thường gặp
  const faqs = [
    {
      question: "Thủ tục thuê xe tự lái cần những giấy tờ gì?",
      answer: "Để thuê xe tự lái, quý khách cần cung cấp CMND/CCCD, giấy phép lái xe còn hiệu lực (thời hạn tối thiểu 1 năm), hộ khẩu hoặc KT3, và một khoản đặt cọc (tiền mặt hoặc chuyển khoản). Đối với doanh nghiệp, cần thêm giấy phép kinh doanh và giấy giới thiệu."
    },
    {
      question: "Chính sách giới hạn số km được phép chạy trong ngày?",
      answer: "Chúng tôi áp dụng giới hạn 300km/ngày đối với mọi loại xe. Nếu quý khách chạy vượt quá số km quy định, sẽ phụ thu thêm theo từng loại xe (thông thường từ 3.000đ - 5.000đ/km)."
    },
    {
      question: "Chính sách về nhiên liệu như thế nào?",
      answer: "Xe được giao với bình xăng đầy và quý khách cần trả xe với bình xăng ở mức tương tự. Nếu trả xe với lượng nhiên liệu ít hơn, chúng tôi sẽ tính phí nhiên liệu bổ sung theo giá thị trường cộng với phí dịch vụ."
    },
    {
      question: "Làm sao để đặt xe trực tuyến?",
      answer: "Quý khách có thể đặt xe trực tuyến thông qua website hoặc ứng dụng di động của chúng tôi. Chọn loại xe, thời gian thuê, điền thông tin cá nhân và thanh toán đặt cọc. Sau khi xác nhận, chúng tôi sẽ liên hệ để hoàn tất thủ tục."
    },
    {
      question: "Có được hủy đặt xe không và chính sách hoàn tiền?",
      answer: "Quý khách có thể hủy đặt xe trước 24 giờ so với thời điểm nhận xe và được hoàn 90% tiền cọc. Hủy trong vòng 24 giờ sẽ được hoàn 50% tiền cọc. Trường hợp không đến nhận xe mà không thông báo, tiền cọc sẽ không được hoàn trả."
    },
    {
      question: "Làm gì khi xe gặp sự cố trên đường?",
      answer: "Khi xe gặp sự cố, quý khách vui lòng gọi ngay đến số hotline hỗ trợ 24/7 của chúng tôi. Chúng tôi sẽ cử nhân viên kỹ thuật đến hỗ trợ hoặc cung cấp xe thay thế trong thời gian sớm nhất có thể, tùy thuộc vào vị trí của quý khách."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-800 to-red-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-md">Dịch Vụ Thuê Xe</h1>
          <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
            Chúng tôi cung cấp đa dạng dịch vụ thuê xe với chất lượng cao và giá cả hợp lý,
            đáp ứng mọi nhu cầu di chuyển của khách hàng cá nhân và doanh nghiệp.
          </p>
        </div>
      </div>

      {/* Dịch vụ của chúng tôi */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Dịch Vụ Của Chúng Tôi</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Với đội xe hiện đại và đa dạng, chúng tôi cam kết mang đến cho khách hàng
              trải nghiệm thuê xe tự lái chất lượng cao với giá cả cạnh tranh nhất trên thị trường.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex flex-col items-center text-center mb-4">
                    {service.icon}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaLongArrowAltRight className="text-red-800 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 border-t">
                  <Link 
                    to="/contact" 
                    className="block w-full py-2 px-4 bg-red-800 text-white text-center rounded-md hover:bg-red-900 transition-colors duration-300"
                  >
                    Tìm hiểu thêm
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quy trình thuê xe */}
      <div className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quy Trình Thuê Xe</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Chúng tôi đơn giản hóa quy trình thuê xe để mang đến trải nghiệm thuận tiện và nhanh chóng cho khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center relative">
              <div className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Chọn xe</h3>
              <p className="text-gray-600">Lựa chọn loại xe phù hợp với nhu cầu sử dụng của bạn</p>
              {/* Mũi tên kết nối (ẩn trên mobile) */}
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center relative">
              <div className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Đặt lịch</h3>
              <p className="text-gray-600">Chọn thời gian nhận và trả xe phù hợp với lịch trình của bạn</p>
              {/* Mũi tên kết nối (ẩn trên mobile) */}
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center relative">
              <div className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Xác nhận</h3>
              <p className="text-gray-600">Cung cấp thông tin cá nhân và hoàn tất đặt cọc</p>
              {/* Mũi tên kết nối (ẩn trên mobile) */}
              <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-xl font-semibold mb-3">Nhận xe</h3>
              <p className="text-gray-600">Kiểm tra xe và ký hợp đồng trước khi bắt đầu hành trình</p>
            </div>
          </div>
        </div>
      </div>

      {/* Câu hỏi thường gặp */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Câu Hỏi Thường Gặp</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Giải đáp những thắc mắc phổ biến nhất của khách hàng về dịch vụ thuê xe tại công ty chúng tôi.
            </p>
          </div>

          <div className="max-w-4xl mx-auto divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="py-5">
                <details className="group onClick={(e) => e.preventDefault()}">
                  <summary className="flex justify-between items-center font-semibold cursor-pointer list-none">
                    <span className="text-gray-800 text-lg">{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                    {faq.answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Sẵn sàng trải nghiệm dịch vụ thuê xe của chúng tôi?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Liên hệ ngay để được tư vấn và báo giá nhanh chóng.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center mr-4">
                <FaPhone className="text-white text-xl" />
              </div>
              <div className="text-left">
                <p className="text-gray-400 text-sm">Gọi cho chúng tôi</p>
                <p className="text-white text-xl font-semibold">0123 456 789</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center mr-4">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <div className="text-left">
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white text-xl font-semibold">contact@rentacar.vn</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/cars" className="bg-red-800 hover:bg-red-900 text-white font-semibold py-3 px-8 rounded-md transition-colors">
              Xem danh sách xe
            </Link>
            <Link to="/contact" className="bg-transparent hover:bg-white/10 text-white border border-white font-semibold py-3 px-8 rounded-md transition-colors">
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
