import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className="flex justify-between items-center px-12 py-6 bg-white shadow-sm fixed w-full top-0 z-50"
    >
      <div
        className="font-bold text-3xl text-blue-600"
        style={{ fontFamily: "cursive" }}
      >
        HireON
      </div>
      <nav>
        <a
          href="#about"
          className="mr-6 font-medium text-gray-800 no-underline hover:text-blue-600 transition-colors"
        >
          About Us
        </a>
        <a
          href="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded-md no-underline font-medium hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          Login
        </a>
      </nav>
    </header>
  );
};

export default Header;
