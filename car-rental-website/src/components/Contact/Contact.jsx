import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    rentalDate: "",
    carType: "economy"
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đã gửi biểu mẫu:", formData);
    setIsSubmitted(true);
    // Đặt lại biểu mẫu sau 5 giây
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        rentalDate: "",
        carType: "economy"
      });
    }, 5000);
  };

  return (
    <>
      <span id="contact"></span>
      <div data-aos="zoom-in" className="dark:bg-black dark:text-white py-14">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-800 py-8 px-6">
            <div className="col-span-2 space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Hãy cùng hợp tác trong dự án thuê xe sắp tới của bạn
              </h1>
              <p className="text-gray-400">
                Chúng tôi sẵn sàng hỗ trợ nhu cầu di chuyển của bạn. Điền vào mẫu dưới đây và đội ngũ của chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
              </p>
            </div>
            <div className="sm:grid sm:place-items-center">
              <a
                href="#contact-form"
                className="inline-block font-semibold py-2 px-6 bg-primary text-white hover:bg-primary/80 duration-200 tracking-widest uppercase"
              >
                Liên Hệ
              </a>
            </div>
          </div>
          
          <div id="contact-form" className="mt-10 bg-gray-900 p-6 rounded-lg shadow-xl">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="bg-green-600 inline-flex p-2 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Cảm ơn bạn đã gửi tin nhắn!</h2>
                <p className="text-gray-400">Chúng tôi sẽ sớm liên hệ lại về yêu cầu thuê xe của bạn.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-white font-medium">Họ và Tên</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tên của bạn"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-white font-medium">Địa chỉ Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Email của bạn"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-white font-medium">Số Điện Thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Số điện thoại của bạn"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="rentalDate" className="text-white font-medium">Ngày Thuê Xe</label>
                  <input
                    type="date"
                    id="rentalDate"
                    name="rentalDate"
                    value={formData.rentalDate}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="carType" className="text-white font-medium">Loại Xe</label>
                  <select
                    id="carType"
                    name="carType"
                    value={formData.carType}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="economy">Xe Tiết Kiệm</option>
                    <option value="compact">Xe Nhỏ Gọn</option>
                    <option value="midsize">Xe Cỡ Trung</option>
                    <option value="suv">SUV</option>
                    <option value="luxury">Xe Sang</option>
                    <option value="van">Xe Van</option>
                  </select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="message" className="text-white font-medium">Tin Nhắn Của Bạn</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Hãy cho chúng tôi biết về nhu cầu thuê xe của bạn"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-block font-semibold py-3 px-8 bg-primary text-white hover:bg-primary/80 duration-200 tracking-widest uppercase"
                  >
                    Gửi Tin Nhắn
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
