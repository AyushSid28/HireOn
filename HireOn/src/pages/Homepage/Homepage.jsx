import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Header from "../../components/Header";
import About from "../../components/About";
import Footer from "../../components/Footer";

const Homepage = () => (
  
  <div>
    <Header />

    <section
      className="bg-slate-50 min-h-[520px] flex items-center justify-center relative bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-16 z-10 mt-32">
        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
          Stop Manual Job Hunting.
          <br />
          <span className="text-blue-600">Start Smart Applying.</span>
        </h1>
        <p className="text-xl text-slate-700 mb-10">
          Automate your internship and job search across Internshala, Indeed,
          and Naukri. Track applications, get personalized matches, and never
          miss an opportunity again.
        </p>
        <div className="flex gap-4 mb-6">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg no-underline hover:bg-blue-700 transition-colors"
          >
            SignUp
          </a>
        </div>
      </div>
    </section>

    <About />
    <Footer />
  </div>
);

export default Homepage;
