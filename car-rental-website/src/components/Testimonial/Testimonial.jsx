import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const testimonialData = [
  {
    name: "Nguyễn Văn An",
    position: "Doanh nhân",
    image: "https://picsum.photos/id/1/200",
    description: "Dịch vụ tuyệt vời, xe chất lượng cao và rất tiện lợi!",
  },
  {
    name: "Trần Thị Minh",
    position: "Giảng viên",
    image: "https://picsum.photos/id/2/200",
    description: "Giá cả hợp lý, thủ tục nhanh chóng, nhân viên tư vấn nhiệt tình.",
  },
  {
    name: "Lê Hoàng Nam",
    position: "Kỹ sư",
    image: "https://picsum.photos/id/3/200",
    description: "Trải nghiệm thuê xe rất tốt, tôi sẽ tiếp tục sử dụng dịch vụ này!",
  },
];

const Testimonial = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-gray-800">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <div className="w-24 h-1 bg-red-700 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">
            Chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất cho khách hàng.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialData.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-16 bg-red-700"></div>
              <div className="absolute top-4 left-4 text-white text-4xl opacity-30">
                <FaQuoteLeft />
              </div>

              <div className="pt-12 px-6 pb-8 relative flex flex-col items-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-6 mt-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Stars */}
                <div className="flex justify-center space-x-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className="w-5 h-5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-600 text-center mb-6 italic">"{testimonial.description}"</p>
                
                {/* Footer */}
                <div className="mt-auto text-center">
                  <h4 className="font-bold text-lg text-gray-800">{testimonial.name}</h4>
                  <p className="text-red-700 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
