import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";


const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      footerRef.current,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          end: "bottom 20%",
        },
      }
    );
  }, []);

  return (
    <footer ref={footerRef} className="bg-slate-900 text-white pt-16 pb-6">
      <div className="max-w-6xl mx-auto flex justify-between flex-wrap px-6">
        <div className="flex-1 min-w-56">
          <div
            className="font-bold text-3xl text-blue-400 mb-4"
            style={{ fontFamily: "cursive" }}
          >
            HireON
          </div>
          <p className="text-slate-300 mb-6">
            Automate your internship and job search across multiple platforms.
            Smart matching, auto-applications, and comprehensive tracking.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-white text-xl hover:scale-125 transform transition-transform"
            >
              🐦
            </a>
            <a
              href="#"
              className="text-white text-xl hover:scale-125 transform transition-transform"
            >
              💼
            </a>
            <a
              href="#"
              className="text-white text-xl hover:scale-125 transform transition-transform"
            >
              📘
            </a>
            <a
              href="#"
              className="text-white text-xl hover:scale-125 transform transition-transform"
            >
              📸
            </a>
          </div>
        </div>

        <div className="flex-1 min-w-40">
          <h4 className="font-bold mb-3">Product</h4>
          <ul className="list-none p-0 text-slate-300 space-y-1">
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Features
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Pricing
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Demo
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Integrations
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              API
            </li>
          </ul>
        </div>

        <div className="flex-1 min-w-40">
          <h4 className="font-bold mb-3">Support</h4>
          <ul className="list-none p-0 text-slate-300 space-y-1">
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Help Center
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Contact Us
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Tutorials
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Community
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              System Status
            </li>
          </ul>
        </div>

        <div className="flex-1 min-w-40">
          <h4 className="font-bold mb-3">Company</h4>
          <ul className="list-none p-0 text-slate-300 space-y-1">
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              About Us
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Careers
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Blog
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Press
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">
              Partners
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-8 pt-6 px-6 flex justify-between items-center max-w-6xl mx-auto">
        <span className="text-slate-300">
          © 2025 HireON. All rights reserved.
        </span>
        <div>
          <a
            href="#"
            className="text-slate-300 mr-6 hover:text-blue-400 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-slate-300 hover:text-blue-400 transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
