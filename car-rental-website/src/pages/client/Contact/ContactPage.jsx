import React, { useState } from "react";
import { 
  IoLocationOutline, 
  IoCallOutline, 
  IoMailOutline,
  IoTimeOutline,
  IoSendOutline,
  IoCheckmarkCircle 
} from "react-icons/io5";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Giả lập gửi dữ liệu
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      
      // Reset thông báo thành công sau 5 giây
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-800 to-red-700 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-md">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi nếu bạn có thắc mắc hoặc cần trợ giúp về dịch vụ thuê xe.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Thông Tin Liên Hệ</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full text-red-800 mr-4">
                    <IoLocationOutline className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Địa Chỉ</h3>
                    <p className="text-gray-600 mt-1">123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full text-red-800 mr-4">
                    <IoCallOutline className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Điện Thoại</h3>
                    <p className="text-gray-600 mt-1">0123 456 789</p>
                    <p className="text-gray-600">0987 654 321</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full text-red-800 mr-4">
                    <IoMailOutline className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Email</h3>
                    <p className="text-gray-600 mt-1">info@carrental.vn</p>
                    <p className="text-gray-600">support@carrental.vn</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full text-red-800 mr-4">
                    <IoTimeOutline className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Giờ Làm Việc</h3>
                    <p className="text-gray-600 mt-1">Thứ 2 - Thứ 6: 8:00 - 19:00</p>
                    <p className="text-gray-600">Thứ 7 - Chủ Nhật: 9:00 - 17:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4">Kết Nối Với Chúng Tôi</h3>
                <div className="flex space-x-3">
                  <a href="#" className="bg-gray-100 hover:bg-red-100 text-red-800 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="bg-gray-100 hover:bg-red-100 text-red-800 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="bg-gray-100 hover:bg-red-100 text-red-800 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="bg-gray-100 hover:bg-red-100 text-red-800 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Gửi Tin Nhắn</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex flex-col items-center text-center">
                  <IoCheckmarkCircle className="text-green-500 text-5xl mb-4" />
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Gửi Thành Công!</h3>
                  <p className="text-green-600 mb-4">
                    Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi sớm nhất có thể.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                        placeholder="Nhập địa chỉ email"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                        Chủ đề
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                        placeholder="Nhập chủ đề"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Nội dung
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                      placeholder="Nhập nội dung tin nhắn"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-red-800 hover:bg-red-900 text-white rounded-lg font-medium transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <IoSendOutline className="text-lg" />
                        Gửi tin nhắn
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12">
        <div className="bg-white shadow-md py-6">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Vị Trí Của Chúng Tôi</h2>
            {/* Map iframe - Thay thế bằng Google Maps API hoặc thư viện maps khác trong dự án thực tế */}
            <div className="h-96 w-full rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580567047!2d106.7002681152164!3d10.771594092323403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3c586421ef%3A0xb606461945b00477!2zVHJ1bmcgdMOibSBUaMawxqFuZyBt4bqhaSBTYWlnb24gQ2VudHJl!5e0!3m2!1svi!2s!4v1662047862370!5m2!1svi!2s"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
