import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";


const About = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const stepsRef = useRef(null);
  const featuresRef = useRef(null);
  const featuresTitleRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    // Animate main title
    gsap.fromTo(
      titleRef.current,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          end: "bottom 20%",
        },
      }
    );

    
    gsap.fromTo(
      subtitleRef.current,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      }
    );

    gsap.fromTo(
      stepsRef.current.children,
      { y: 100, opacity: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      }
    );


    gsap.fromTo(
      featuresTitleRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: featuresTitleRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      }
    );


    gsap.fromTo(
      cardsRef.current.children,
      { y: 100, opacity: 0, rotateY: -15 },
      {
        y: 0,
        opacity: 1,
        rotateY: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.3,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      }
    );


    const cards = cardsRef.current.children;
    Array.from(cards).forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });
  }, []);

  return (
    <section id="about" className="bg-gray-50 ">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 ref={titleRef} className="text-5xl font-bold text-center mb-4">
          How HireON Works
        </h1>
        <p
          ref={subtitleRef}
          className="text-center text-slate-600 text-xl mb-14"
        >
          From profile setup to landing interviews, our platform simplifies
          every step of your job search journey.
        </p>

        <div ref={stepsRef} className="flex justify-between gap-8 mb-20">
          <div className="flex-1 text-center">
            <div className="bg-blue-600 text-white rounded-full w-24 h-24 mx-auto flex items-center justify-center text-4xl mb-4 transform transition-transform hover:rotate-12">
              <span role="img" aria-label="profile">
                👤
              </span>
            </div>
            <h3 className="font-bold text-xl mb-2">Create Your Profile</h3>
            <p className="text-slate-600">
              Set up your professional profile with skills, preferences,
              location, and career goals. Upload your resume and connect your
              existing job platform accounts.
            </p>
          </div>

          <div className="flex-1 text-center">
            <div className="bg-blue-600 text-white rounded-full w-24 h-24 mx-auto flex items-center justify-center text-4xl mb-4 transform transition-transform hover:rotate-12">
              <span role="img" aria-label="search">
                🔍
              </span>
            </div>
            <h3 className="font-bold text-xl mb-2">AI Finds Perfect Matches</h3>
            <p className="text-slate-600">
              Our smart algorithm continuously scans job boards to find
              internships and jobs that perfectly match your criteria and career
              aspirations.
            </p>
          </div>

          <div className="flex-1 text-center">
            <div className="bg-blue-600 text-white rounded-full w-24 h-24 mx-auto flex items-center justify-center text-4xl mb-4 transform transition-transform hover:rotate-12">
              <span role="img" aria-label="send">
                ✉️
              </span>
            </div>
            <h3 className="font-bold text-xl mb-2">
              Auto-Apply with Personalization
            </h3>
            <p className="text-slate-600">
              Automatically submit applications with personalized cover letters
              and resumes tailored to each position. Track every submission in
              real-time.
            </p>
          </div>

          <div className="flex-1 text-center">
            <div className="bg-blue-600 text-white rounded-full w-24 h-24 mx-auto flex items-center justify-center text-4xl mb-4 transform transition-transform hover:rotate-12">
              <span role="img" aria-label="dashboard">
                📊
              </span>
            </div>
            <h3 className="font-bold text-xl mb-2">Monitor & Manage</h3>
            <p className="text-slate-600">
              Get instant notifications about application status, interview
              invitations, and new opportunities. Manage everything from your
              centralized dashboard.
            </p>
          </div>
        </div>

        <div ref={featuresRef}>
          <h2
            ref={featuresTitleRef}
            className="text-4xl font-bold text-center mb-4"
          >
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-center text-slate-600 text-xl mb-12">
            Our comprehensive platform automates every aspect of your job
            search, from finding opportunities to tracking applications and
            scheduling interviews.
          </p>
        </div>

        <div ref={cardsRef} className="flex gap-8 justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-80 cursor-pointer transform transition-transform">
            <div className="text-5xl mb-4">🔗</div>
            <h4 className="font-bold text-xl mb-2">Smart Job Matching</h4>
            <p className="text-slate-600">
              AI-powered algorithm matches you with relevant internships and
              jobs based on your skills, preferences, and location.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 w-80 cursor-pointer transform transition-transform">
            <div className="text-5xl mb-4">🤖</div>
            <h4 className="font-bold text-xl mb-2">Auto Application</h4>
            <p className="text-slate-600">
              Automatically apply to matched positions across multiple platforms
              with personalized cover letters.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 w-80 cursor-pointer transform transition-transform">
            <div className="text-5xl mb-4">📋</div>
            <h4 className="font-bold text-xl mb-2">Application Tracking</h4>
            <p className="text-slate-600">
              Keep track of all your applications in one centralized dashboard.
              Monitor status updates, interview schedules, and follow-ups.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
