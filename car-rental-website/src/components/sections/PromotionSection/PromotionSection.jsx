import { useState } from "react";
import {
  Gift,
  Calendar,
  Users,
  Tag,
  Clock,
  CreditCard,
  ArrowRight,
  CheckCircle,
  X,
} from "lucide-react";

// Modal component hiển thị chi tiết khuyến mãi
const PromotionModal = ({ promo, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className={`${promo.bgColor} p-5 relative`}>
          <div className="flex justify-between items-center">
            <h3 className="text-white text-2xl font-bold">{promo.title}</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-white text-opacity-90 mt-2">{promo.description}</p>
          <div className="text-white text-5xl absolute right-5 bottom-5 opacity-20">
            {promo.icon}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-5 border-b pb-4">
            <div className="flex items-center">
              <Tag className="text-red-800 mr-2" size={20} />
              <span className="text-gray-800 font-medium text-xl">
                Giảm {promo.discount}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="text-red-800 mr-2" size={16} />
              <span className="text-gray-600">Đến {promo.validUntil}</span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">
              Điều kiện áp dụng:
            </h4>
            <div className="space-y-3">
              {promo.conditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-start bg-gray-50 p-3 rounded-md"
                >
                  <CheckCircle
                    className="text-green-500 mt-1 mr-3 flex-shrink-0"
                    size={16}
                  />
                  <span className="text-gray-700">{condition}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-2">Mã khuyến mãi:</h4>
            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
              <span className="font-mono font-bold text-lg text-gray-800">
                {promo.code}
              </span>
              <button
                onClick={copyCode}
                className="bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm"
              >
                {copied ? "Đã sao chép" : "Sao chép"}
              </button>
            </div>

            <div className="mt-6">
              <p className="text-gray-600 text-sm mb-4">
                * Vui lòng đọc kỹ điều kiện áp dụng trước khi sử dụng mã khuyến
                mãi
              </p>
              <button className="w-full py-3 bg-red-800 hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center font-medium">
                <span>Áp dụng ngay</span>
                <ArrowRight className="ml-2" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Card khuyến mãi
const PromotionCard = ({ promo, onClick }) => {
  const { title, description, discount, validUntil, icon, bgColor } = promo;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <div className={`${bgColor} p-4 flex justify-between items-center`}>
        <div>
          <h3 className="text-white text-xl font-bold">{title}</h3>
          <p className="text-white text-opacity-90 text-sm mt-1">
            {description}
          </p>
        </div>
        <div className="text-white text-4xl">{icon}</div>
      </div>

      <div className="p-4 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Tag className="text-red-800 mr-2" size={16} />
            <span className="text-gray-700 font-medium">Giảm {discount}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="text-red-800 mr-2" size={16} />
            <span className="text-gray-600 text-sm">Đến {validUntil}</span>
          </div>
        </div>

        <button className="w-full py-2 bg-red-800 hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center mt-4">
          <span>Xem chi tiết</span>
          <ArrowRight className="ml-2" size={16} />
        </button>
      </div>
    </div>
  );
};

// Component chính hiển thị danh sách khuyến mãi
const PromotionSection = () => {
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPromoModal = (promo) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const closePromoModal = () => {
    setIsModalOpen(false);
  };

  const promotions = [
    {
      id: 1,
      title: "Khách Hàng Mới",
      description: "Ưu đãi cho khách hàng lần đầu thuê xe",
      discount: "15%",
      code: "WELCOME15",
      validUntil: "31/05/2025",
      conditions: [
        "Áp dụng cho lần đầu thuê xe",
        "Thời gian thuê tối thiểu 2 ngày",
        "Không áp dụng ngày lễ, Tết",
        "Giảm trực tiếp 15% trên tổng hóa đơn",
      ],
      icon: <Users size={48} />,
      bgColor: "bg-red-800",
    },
    {
      id: 2,
      title: "Thuê Dài Hạn",
      description: "Ưu đãi cho hợp đồng thuê xe dài ngày",
      discount: "20%",
      code: "LONG20",
      validUntil: "31/05/2025",
      conditions: [
        "Áp dụng cho thuê xe từ 7 ngày trở lên",
        "Áp dụng tất cả các loại xe",
        "Được áp dụng cùng ưu đãi khác",
        "Cần đặt cọc trước ít nhất 30% giá trị đơn hàng",
      ],
      icon: <Calendar size={48} />,
      bgColor: "bg-blue-700",
    },
    {
      id: 3,
      title: "Giờ Vàng",
      description: "Ưu đãi đặc biệt trong khung giờ vàng",
      discount: "10%",
      code: "GOLDEN10",
      validUntil: "31/05/2025",
      conditions: [
        "Áp dụng khi đặt xe từ 22:00 - 06:00",
        "Không giới hạn số lần sử dụng",
        "Không áp dụng cho các dòng xe cao cấp",
        "Cần xác nhận đặt xe trước ít nhất 2 giờ",
      ],
      icon: <Clock size={48} />,
      bgColor: "bg-amber-600",
    },
    {
      id: 4,
      title: "Thanh Toán Online",
      description: "Ưu đãi khi thanh toán trực tuyến",
      discount: "5%",
      code: "ONLINE5",
      validUntil: "31/05/2025",
      conditions: [
        "Áp dụng khi thanh toán 100% trực tuyến",
        "Áp dụng cho mọi phương thức thanh toán online",
        "Được áp dụng cùng với các ưu đãi khác",
        "Hoàn tiền trong vòng 24h nếu hủy đặt xe",
      ],
      icon: <CreditCard size={48} />,
      bgColor: "bg-emerald-600",
    },
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full font-medium text-sm mb-3">
            TIẾT KIỆM HƠN
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Chương Trình Khuyến Mãi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tận hưởng những ưu đãi đặc biệt khi thuê xe tại CarRental. Áp dụng
            ngay các mã giảm giá để có được mức giá tốt nhất cho chuyến đi của
            bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo) => (
            <PromotionCard
              key={promo.id}
              promo={promo}
              onClick={() => openPromoModal(promo)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <div className="flex items-center justify-center text-red-800 text-4xl mb-4">
              <Gift size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Đăng Ký Nhận Khuyến Mãi
            </h3>
            <p className="text-gray-600 mb-6">
              Nhập email để nhận thông tin về các chương trình khuyến mãi mới
              nhất của chúng tôi
            </p>

            <div className="flex items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300"
              />
              <button className="bg-red-700 text-white px-6 py-2 rounded-r-md hover:bg-red-600 transition-colors font-medium whitespace-nowrap">
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedPromo && (
        <PromotionModal
          promo={selectedPromo}
          isOpen={isModalOpen}
          onClose={closePromoModal}
        />
      )}
    </div>
  );
};

export default PromotionSection;
