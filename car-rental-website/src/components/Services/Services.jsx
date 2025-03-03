import React from "react";
import { FaTag, FaCarSide, FaUserTie } from "react-icons/fa";

const servicesData = [
  {
    name: "Giá Tốt Nhất",
    icon: <FaTag className="text-5xl text-red-700 group-hover:text-white duration-300" />,
    link: "#",
    description: "Chúng tôi cam kết cung cấp mức giá cạnh tranh nhất, không phí ẩn.",
  },
  {
    name: "Nhanh Chóng & An Toàn",
    icon: <FaCarSide className="text-5xl text-red-700 group-hover:text-white duration-300" />,
    link: "#",
    description: "Dịch vụ thuê xe nhanh chóng, đảm bảo an toàn trên mọi hành trình.",
  },
  {
    name: "Tài Xế Kinh Nghiệm",
    icon: <FaUserTie className="text-5xl text-red-700 group-hover:text-white duration-300" />,
    link: "#",
    description: "Đội ngũ tài xế giàu kinh nghiệm, phục vụ tận tâm và chuyên nghiệp.",
  },
];

const Services = () => {
  return (
    <>
      <span id="about"></span>
      <div className="bg-rose-50 py-14 sm:min-h-[600px] sm:grid sm:place-items-center">
        <div className="container">
          <div className="pb-12">
            <h1 className="text-3xl font-semibold text-center sm:text-4xl font-serif">
              Tại Sao Chọn Chúng Tôi
            </h1>
            <div className="w-24 h-1 bg-red-700 rounded-full mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {servicesData.map((service) => (
              <div
                key={service.name}
                className="card text-center group space-y-3 sm:space-y-6 p-6 sm:py-16 bg-white border border-rose-200 hover:bg-red-700 duration-300 text-gray-700 hover:text-white rounded-lg shadow-md"
              >
                <div className="grid place-items-center">{service.icon}</div>
                <h2 className="text-2xl font-bold">{service.name}</h2>
                <p className="text-sm sm:text-base">{service.description}</p>
                <a
                  href={service.link}
                  className="inline-block text-lg font-semibold py-3 text-red-700 group-hover:text-white group-hover:underline duration-300"
                  aria-label={`Tìm hiểu thêm về ${service.name}`}
                >
                  Tìm hiểu thêm
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
