import React from "react";
import { FaTag, FaCarSide, FaUserTie } from "react-icons/fa";

const servicesData = [
  {
    name: "Giá Tốt Nhất",
    icon: <FaTag className="text-5xl text-primary group-hover:text-black duration-300" />,
    link: "#",
    description: "Chúng tôi cam kết cung cấp mức giá cạnh tranh nhất, không phí ẩn.",
    aosDelay: "0",
  },
  {
    name: "Nhanh Chóng & An Toàn",
    icon: <FaCarSide className="text-5xl text-primary group-hover:text-black duration-300" />,
    link: "#",
    description: "Dịch vụ thuê xe nhanh chóng, đảm bảo an toàn trên mọi hành trình.",
    aosDelay: "500",
  },
  {
    name: "Tài Xế Kinh Nghiệm",
    icon: <FaUserTie className="text-5xl text-primary group-hover:text-black duration-300" />,
    link: "#",
    description: "Đội ngũ tài xế giàu kinh nghiệm, phục vụ tận tâm và chuyên nghiệp.",
    aosDelay: "1000",
  },
];

const Services = () => {
  return (
    <>
      <span id="about"></span>
      <div className="dark:bg-black dark:text-white py-14 sm:min-h-[600px] sm:grid sm:place-items-center">
        <div className="container">
          <div className="pb-12">
            <h1 data-aos="fade-up" className="text-3xl font-semibold text-center sm:text-4xl font-serif">
              Tại Sao Chọn Chúng Tôi
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {servicesData.map((service) => (
              <div
                key={service.name}
                data-aos="fade-up"
                data-aos-delay={service.aosDelay}
                className="card text-center group space-y-3 sm:space-y-6 p-6 sm:py-16 bg-dark hover:bg-primary duration-300 text-white hover:text-black rounded-lg shadow-lg"
              >
                <div className="grid place-items-center">{service.icon}</div>
                <h2 className="text-2xl font-bold">{service.name}</h2>
                <p className="text-sm sm:text-base">{service.description}</p>
                <a
                  href={service.link}
                  className="inline-block text-lg font-semibold py-3 text-primary group-hover:text-black group-hover:underline duration-300"
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
