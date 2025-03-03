import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Component import (loại bỏ Navbar và Footer)
import Hero from "../../components/Hero/Hero";
import About from "../../components/About/About";
import Services from "../../components/Services/Services";
import CarList from "../../components/CarList/CarList";
import Testimonial from "../../components/Testimonial/Testimonial";
import Contact from "../../components/Contact/Contact";

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
      {/* <Contact /> */}
    </div>
  );
};

export default Home;
