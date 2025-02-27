import React, { useState, useEffect } from "react"; 
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi"; 
import ResponsiveMenu from "./ResponsiveMenu";  

export const Navlinks = [   
  { id: 1, name: "Trang Chủ", link: "/#" },   
  { id: 2, name: "Xe", link: "/#cars" },   
  { id: 3, name: "Dịch Vụ", link: "/#about" }, 
];  

const Navbar = () => {   
  const [showMenu, setShowMenu] = useState(false);   
  const [scrolled, setScrolled] = useState(false);    
  
  useEffect(() => {     
    const handleScroll = () => {       
      setScrolled(window.scrollY > 20);     
    };     
    window.addEventListener("scroll", handleScroll);     
    return () => window.removeEventListener("scroll", handleScroll);   
  }, []);    
  
  const toggleMenu = () => {     
    setShowMenu(!showMenu);   
  };    
  
  return (     
    <>       
      {/* Spacer div to prevent content from hiding under navbar */}       
      <div className="h-16"></div>              
      
      <div         
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300          
        ${scrolled           
          ? "py-2 bg-gray-800 shadow-lg"           
          : "py-4 bg-gray-700"}`}       
      >         
        <div className="container mx-auto px-4">           
          <div className="flex justify-between items-center">             
            <div className="flex items-center">               
              <span className="text-2xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">                 
                AutoDrive               
              </span>             
            </div>                          
            
            <nav className="hidden md:flex items-center">               
              <ul className="flex items-center gap-6">                 
                {Navlinks.map(({ id, name, link }) => (                   
                  <li key={id} className="py-2">                     
                    <a                       
                      href={link}                       
                      className="text-base font-medium text-white relative overflow-hidden group"                     
                    >                     
                      <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full group-hover:text-teal-300">                       
                        {name}                     
                      </span>                     
                    </a>                   
                  </li>                 
                ))}               
              </ul>                              
              
              {/* Signup button for desktop */}               
              <a                  
                href="/#signup"                  
                className="ml-6 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full text-sm font-medium hover:from-cyan-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-300"               
              >                 
                Đăng Ký               
              </a>             
            </nav>                          
            
            {/* Mobile view */}             
            <div className="flex items-center gap-4 md:hidden">               
              <button                 
                className="p-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-md transition-all duration-300"                 
                onClick={toggleMenu}               
              >                 
                {showMenu ? (                   
                  <HiMenuAlt1 className="text-lg" />                 
                ) : (                   
                  <HiMenuAlt3 className="text-lg" />                 
                )}               
              </button>             
            </div>           
          </div>         
        </div>         
        <ResponsiveMenu showMenu={showMenu} />       
      </div>     
    </>   
  ); 
};  

export default Navbar;
