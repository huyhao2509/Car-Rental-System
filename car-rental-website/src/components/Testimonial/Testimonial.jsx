import React from "react";

const testimonialData = [
  {
    name: "Nguyễn Văn An",
    image: "",
    description: "Dịch vụ tuyệt vời, xe chất lượng cao và rất tiện lợi!",
    aosDelay: "0",
  },
  {
    name: "Trần Thị Minh",
    image: "",
    description: "Giá cả hợp lý, thủ tục nhanh chóng, nhân viên tư vấn nhiệt tình.",
    aosDelay: "300",
  },
  {
    name: "Lê Hoàng Nam",
    image: "",
    description: "Trải nghiệm thuê xe rất tốt, tôi sẽ tiếp tục sử dụng dịch vụ này!",
    aosDelay: "1000",
  },
];

const Testimonial = () => {
  return (
    <>
      <span id="about"></span>
      <div className="bg-white dark:bg-gray-200 text-black dark:text-gray-900 py-14 sm:pb-24">
        <div className="container">
          {/* Tiêu đề */}
          <div className="space-y-4 pb-12">
            <p data-aos="fade-up" className="text-3xl font-semibold text-center sm:text-4xl font-serif">
              Khách Hàng Nói Gì Về Chúng Tôi
            </p>
            <p data-aos="fade-up" className="text-center sm:px-44">
              Chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất cho khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {testimonialData.map((testimonial) => (
              <div
                key={testimonial.name}
                data-aos="fade-up"
                data-aos-delay={testimonial.aosDelay}
                className="card text-center group space-y-3 sm:space-y-6 p-4 sm:py-12 bg-gray-50 dark:bg-white duration-300 rounded-lg shadow-lg"
              >
                <div className="grid place-items-center">
                  <img
                    src="https://picsum.photos/200"
                    alt={testimonial.name}
                    className="rounded-full w-20 h-20"
                  />
                </div>
                <div className="text-2xl text-yellow-500">⭐⭐⭐⭐⭐</div>
                <p className="text-sm sm:text-base">{testimonial.description}</p>
                <p className="text-center font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonial;
