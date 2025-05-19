import React from "react";
import AppStoreImg from "../../assets/website/app_store.png";
import PlayStoreImg from "../../assets/website/play_store.png";
import pattern from "../../assets/website/pattern.jpeg";

const AppStoreBanner = () => {
  return (
    <div className="w-full">
      <div
        className="text-black py-10 sm:min-h-[400px] sm:grid sm:place-items-center rounded-xl"
        style={{
          backgroundImage: `url(${pattern})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="space-y-6 max-w-xl mx-auto px-4">
          <h1
            data-aos="fade-up"
            className="text-2xl text-center sm:text-4xl font-semibold font-serif"
          >
            Tải ứng dụng CarRental ngay
          </h1>
          <p data-aos="fade-up" className="text-center sm:px-20">
            Thuê xe tự lái dễ dàng chỉ với vài thao tác. 
            Đặt xe, thanh toán và quản lý lịch trình mọi lúc mọi nơi.
          </p>
          <div
            data-aos="fade-up"
            className="flex flex-wrap justify-center items-center gap-4"
          >
            <a href="#">
              <img
                src={PlayStoreImg}
                alt="Google Play Store"
                className="max-w-[150px] sm:max-w-[120px] md:max-w-[200px]"
              />
            </a>
            <a href="#">
              <img
                src={AppStoreImg}
                alt="Apple App Store"
                className="max-w-[150px] sm:max-w-[120px] md:max-w-[200px]"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppStoreBanner;
