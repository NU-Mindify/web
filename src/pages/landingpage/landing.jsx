import "../../css/Landingpage/landing.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import phone1 from "../../assets/landingpage/phone1.png";
import phone2 from "../../assets/landingpage/phone2.png";
import Apple from  "../../assets/landingpage/Apple.png";
import Google from  "../../assets/landingpage/Google.png";
import mindify from  "../../assets/landingpage/mindify.png";
import developmental from  "../../assets/landingpage/developmental.png";
import abnormal from  "../../assets/landingpage/abnormal.png";
import industrial from  "../../assets/landingpage/industrial.png";
import psychological from  "../../assets/landingpage/psychological.png";
import general from  "../../assets/landingpage/general.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");

useEffect(() => {
  const handleScroll = () => {
    const hero = document.getElementById("home");
    if (hero) {
      const { top, bottom } = hero.getBoundingClientRect();
      const inView = top <= 100 && bottom >= 100;
      if (inView) setActiveSection("home");
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

const phones = [
  { src: developmental, label: 'Developmental Psychology' },
  { src: abnormal, label: 'Abnormal Psychology' },
  { src: industrial, label: 'Industrial Psychology' },
  { src: psychological, label: 'Psychological Assessment' },
  { src: general, label: 'General Psychology' },
];

const LOOP_COUNT = 500;
const clonedPhones = Array(LOOP_COUNT)
  .fill(phones)
  .flat();
  useEffect(() => {
  const container = scrollRef.current;
  const phoneCount = phones.length;
  const items = container.querySelectorAll(".phone-item");

  const startIndex = phoneCount * Math.floor(LOOP_COUNT / 2);
  const initialScroll = items[startIndex].offsetLeft + items[startIndex].offsetWidth / 2 - container.offsetWidth / 2;
  container.scrollLeft = initialScroll;

  let scrollTimeout = null;

  const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;

      let closest = 0;
      let minDist = Infinity;

      items.forEach((item, index) => {
        const center = item.offsetLeft + item.offsetWidth / 2;
        const dist = Math.abs(containerCenter - center);
        if (dist < minDist) {
          minDist = dist;
          closest = index;
        }
      });

      const realIndex = closest % phoneCount;
      setActiveIndex(realIndex);

      const buffer = items[0].offsetWidth * phoneCount;
      if (container.scrollLeft <= buffer / 2) {
        container.scrollLeft += buffer;
      } else if (container.scrollLeft >= container.scrollWidth - buffer) {
        container.scrollLeft -= buffer;
      }
    }, 20); 
  };

  container.addEventListener("scroll", handleScroll);
  return () => {
    container.removeEventListener("scroll", handleScroll);
    clearTimeout(scrollTimeout);
  };
}, []);


  return (
    <div className="landing-container">
        
    {/* Header */}
      <header className="landing-header">
        
        <img src={mindify} alt="Mindify Logo" className="mindify-img" />

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#features">Features</a>
          <a href="#download">Download</a>
        </nav>

        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </header>

    {/* Hero Section */}
        <section id="home" className="hero-section">
        <div className="md:w-1/2 space-y-6 h-full flex flex-col justify-center pl-5">
            <h1>
            Explore the <span className="text-yellow">mind</span>.<br />
            Level up your <span className="text-indigo">knowledge</span>.
            </h1>
            <p>
            Prepare with purpose. Review with confidence. Join <span className="highlight">NU Mindify.</span>
            </p>

            <div className="store-buttons">
            <img src={Google} alt="Google Play" />
            <img src={Apple} alt="App Store" />
            </div>

        </div>

        <div className="image-container relative md:w-1/2 flex justify-center h-[500px]">
            <img
            src={phone1}
            alt="Phone 1"
            className="phone-image phone1 transition-all duration-700 ease-in-out"
            />
            <img
            src={phone2}
            alt="Phone 2"
            className="phone-image phone2 transition-all duration-700 ease-in-out"
            />
        </div>
        </section>

    {/* NU Campuses Section */} 

        <section className="nu-campuses-section">
        <h2 className="campus-title">NU Philippines</h2>
        <div className="campus-marquee">
            <ul className="campus-list">
            {[
                "NU Manila", "NU MOA", "NU Fairview", "NU Laguna", "NU Lipa",
                "NU Dasmariñas", "NU Baliwag"
            ].map((campus, index) => (
                <li key={index}>{campus}</li>
            ))}
            {/* Duplicate for loop */}
            {[
                "NU Manila", "NU MOA", "NU Fairview", "NU Laguna", "NU Lipa",
                "NU Dasmariñas", "NU Baliwag"
            ].map((campus, index) => (
                <li key={index + 100}>{campus}</li>
            ))}
            </ul>
        </div>
        </section>

    {/* About Us Section */} 

        <section id="about" className="about-nu-section">
          <h2 className="about-title">About NU Mindify</h2>
          <h2 className="text-center text-2xl md:text-3xl font-semibold leading-relaxed">
            Where <span style={{ color: "#FFC300" }}>learning</span> meets <span style={{ color: "#444EB2" }}>understanding</span>.
          </h2>

          <p className="text-gray-800 max-w-2xl text-lg pt-2">
            NU Mindify is a modern, student-focused review platform created to enhance your learning journey.
            Prepare smarter, study better, and succeed with confidence.
          </p>

        <div ref={scrollRef} className="phone-scroll-wrapper">
          {clonedPhones.map((phone, index) => {
            const isActive = phone.label === phones[activeIndex].label;
            return (
              <div key={index} className={`phone-item ${isActive ? "active" : ""}`}>
                <img src={phone.src} alt={phone.label} />
                <p className="phone-label">{phone.label}</p>
              </div>
            );
          })}
        </div>

        </section>

    {/* App Features */} 
        <section id="features" className="features-section">
          <h2 className="features-title">App Features</h2>
          <h2 className="text-center text-2xl md:text-3xl font-semibold leading-relaxed">
            Your <span style={{ color: "#FFC300" }}>Study Tools</span>, <span style={{ color: "#444EB2" }}>Leveled Up</span>.
          </h2>

        </section>


    </div>


  );
};

export default LandingPage;
