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
import front from  "../../assets/landingpage/front.png";
import worlds from  "../../assets/landingpage/worlds.png";
import glossary from  "../../assets/landingpage/glossary.png";
import mindmap from  "../../assets/landingpage/mindmap.png";
import mindi from  "../../assets/landingpage/mindi.png";
import shop from  "../../assets/landingpage/shop.png";
import phone4 from "../../assets/landingpage/phone4.png";
import phone5 from "../../assets/landingpage/phone5.png";
import phone6 from "../../assets/landingpage/phone6.png";


const LandingPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
 
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

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

const Feature = ({ icon, title, description, align = "left", className = "" }) => {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <div className={`feature-box ${alignment} ${className}`}>
      <img src={icon} alt={title} className="feature-icon" />
      <div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
      </div>
    </div>
  );
};


const faqs = [
  {
    question: "What is NU Mindify?",
    answer: "NU Mindify is a student-focused psychology review app designed to help learners master key concepts and prepare for exams efficiently.",
  },
  {
    question: "Is NU Mindify available in all NU Campuses?",
    answer: "Yes! NU Mindify is available to students from all NU campuses across the Philippines.",
  },
  {
    question: "Is NU Mindify free to use?",
    answer: "Yes, NU Mindify is completely free to download and use for NU Psychology students.",
  },
  {
    question: "Who is NU Mindify for?",
    answer: "NU Mindify is designed for psychology students looking to review topics, master concepts, and prepare confidently for board exams.",
  },
  {
    question: "Can all Psychology students download NU Mindify?",
    answer: "Yes, all NU Psychology students are welcome to download and use the app to aid their studies.",
  },
  {
    question: "Do I need to sign up to use the app?",
    answer: "You will need to create an account to track your progress, customize your avatar, and access AI-powered features like Mindi.",
  },
];


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
          <a href="#faq">FAQs</a>
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
          <h2 className="features-subtitle">
            Your <span className="yellow">Study Tools</span>,{" "}
            <span className="blue">Leveled Up</span>.
          </h2>
          
        <div className="features-grid">
          {/* Left column */}
        <div className="features-left">
          <Feature
            icon={worlds}
            title="Worlds to Explore"
            description="Journey through 5 psychology fields with Classic and Mastery modes to sharpen your knowledge."
            align="right"
          />
          <Feature
            icon={glossary}
            title="Glossary"
            description="Quickly access key terms and definitions — your go-to reference for fast, focused review."
            align="right"
          />
        </div>

          {/* Center (Phone + Avatar) */}
          <div className="features-center">
            <div className="features-image">
              <img src={front} alt="App Preview" className="animate-float" />
            </div>
            <div className="features-avatar">
              <Feature
                icon={shop}
                title="Avatar Customization"
                description="Personalize your learning journey with avatars that grow and evolve as you do."
                align="center"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="features-right">
            <Feature
              icon={mindmap}
              title="Mindmap"
              description="Visually explore connections between psychological concepts to deepen understanding."
            />
            <Feature
              icon={mindi}
              title="Ask Mindi"
              description="Your personal AI review companion. Ask questions, clarify topics, and study smarter."
            />
          </div>
        </div>

      </section>

  {/* Download */} 
      <section id="download" className="download-section">
        <div className="download-content">
          <h2 className="download-title">Download App Now</h2>

          {/* Phone Images */}
          <div className="relative flex justify-center items-end h-[360px] mb-10 w-full max-w-4xl mx-auto mt-25">
            <img src={phone4} alt="Phone Left" className="phone phone-left" />
            <img src={phone5} alt="Phone Center" className="phone phone-center z-20" />
            <img src={phone6} alt="Phone Right" className="phone phone-right" />

          <div className="absolute bottom-0 left-0 w-full h-[320px] bg-gradient-to-t from-white via-white to-transparent z-20 translate-y-20 pointer-events-none" />

          </div>

          <h3 className="download-heading -mt-15 ">
            Download <span style={{ color: "#FFC300" }}>NU Mindify</span> and <span style={{ color: "#444EB2" }}>Learn Today</span>.
          </h3>

          <p className="download-description">
            Download NU Mindify now and take the first step toward mastering psychology and passing your board exam.
          </p>

        
          <div className="store-buttons pb-10">
                  <img src={Google} alt="Google Play" />
                  <img src={Apple} alt="App Store" />
          </div>
        </div>
      </section>

  {/* FAQs */} 
      <section id="faq" className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <h2 className="faq-subtitle">
          <span className="yellow">Learn More</span> about{" "}
          <span className="blue">NU Mindify</span>.
        </h2>

          <div className="faq-items space-y-4 max-w-3xl mx-auto mt-8">
            {faqs.map((item, index) => {
          const isOpen = openFAQIndex === index;
          return (
            <div
              key={index}
              onClick={() => toggleFAQ(index)}
              className={`rounded-xl px-5 py-4 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md mb-5 ${
                isOpen ? "bg-[#444EB2]" : "bg-[#F3F3F3]"
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`font-medium text-sm md:text-base ${
                    isOpen ? "text-white !text-white" : "text-black"
                  }`}
                >
                  {item.question}
                </span>
                <span
                  className={`text-xl font-bold transition-all duration-200 ${
                    isOpen ? "text-white !text-white" : "text-gray-500"
                  }`}
                  style={{ fontWeight: 400 }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </div>

              <div
                className={`transition-all overflow-hidden duration-500 ease-in-out ${
                  isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed border-t pt-3 border-white !text-white">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
        </div>
      </section>



      <footer className="footer-section bg-[#444EB2] text-white py-6 mt-16">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm !text-white">
          © {new Date().getFullYear()} NU Mindify. All rights reserved.
        </div>
      </footer>
  


    </div>


  );
};

export default LandingPage;
