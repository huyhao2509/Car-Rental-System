import AppStoreImg from "../../../assets/website/app_store.png";
import PlayStoreImg from "../../../assets/website/play_store.png";
// Bạn có thể giữ lại hoặc bỏ pattern.jpeg tùy vào việc bạn muốn dùng ảnh nền hay không
// import pattern from "../../../assets/website/pattern.jpeg";

const AppStoreBanner = () => {
  return (
    <div className="w-full mt-8 mb-8">
      <div
        // Thay đổi màu nền sang xám đậm (ví dụ: bg-gray-800)
        // và màu chữ thành trắng hoặc trắng nhạt
        className="bg-red-700 text-white py-10 sm:py-20 lg:py-24 sm:min-h-[400px] sm:grid sm:place-items-center rounded-xl overflow-hidden"
        // Nếu không dùng ảnh nền pattern, bỏ style này đi
        // style={{
        //   backgroundImage: `url(${pattern})`,
        //   backgroundPosition: "center",
        //   backgroundRepeat: "no-repeat",
        //   backgroundSize: "cover",
        // }}
      >
        {/* Nếu bạn dùng ảnh pattern và muốn thêm lớp phủ màu xám */}
        {/* <div className="absolute inset-0 bg-gray-800 opacity-80 z-0"></div> */}

        <div className="space-y-6 max-w-xl mx-auto px-4 text-center z-10 relative">
          <h1
            // data-aos="fade-up" // <--- XÓA DÒNG NÀY để tắt hiệu ứng
            className="text-2xl sm:text-3xl md:text-4xl font-semibold font-serif leading-tight"
          >
            Tải ứng dụng CarRental ngay
          </h1>
          <p
            // data-aos="fade-up" // <--- XÓA DÒNG NÀY để tắt hiệu ứng
            className="text-sm sm:text-base px-2 sm:px-10 md:px-20 text-gray-300"
          >
            {" "}
            {/* Màu văn bản mô tả */}
            Thuê xe tự lái dễ dàng chỉ với vài thao tác. Đặt xe, thanh toán và
            quản lý lịch trình mọi lúc mọi nơi.
          </p>
          <div
            // data-aos="fade-up" // <--- XÓA DÒNG NÀY để tắt hiệu ứng
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-6"
          >
            <a
              href="https://play.google.com/store/apps/details?id=your.app.id"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={PlayStoreImg}
                alt="Download on Google Play Store"
                className="max-w-[140px] sm:max-w-[150px] md:max-w-[180px] hover:scale-105 transition-transform duration-300"
              />
            </a>
            <a
              href="https://apps.apple.com/us/app/your-app-name/idYOURAPPID"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={AppStoreImg}
                alt="Download on Apple App Store"
                className="max-w-[140px] sm:max-w-[150px] md:max-w-[180px] hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppStoreBanner;
