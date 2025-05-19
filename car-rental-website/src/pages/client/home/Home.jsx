import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Component import (đã sửa lại đường dẫn)
import Hero from "../../../components/common/Hero/Hero";
import About from "../../../components/sections/About/About";
import Services from "../../../components/sections/Services/Services";
import CarList from "../../../features/cars/CarList/CarList";
import Testimonial from "../../../components/sections/Testimonial/Testimonial";
import PromotionSection from "../../../components/sections/PromotionSection/PromotionSection";
import PopularLocations from "../../../components/sections/PopularLocations/PopularLocations";

const Home = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white text-black overflow-x-hidden">
      <Hero />
      <About />
      <Services />
      <CarList />
      <Testimonial />
      <PromotionSection />
      <PopularLocations />
      {/* <AppStoreBanner /> */}
    </div>
  );
};

export default Home;
