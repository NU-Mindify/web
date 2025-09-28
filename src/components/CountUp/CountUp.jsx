import { useState, useEffect, useContext } from "react";
import "../CountUp/CountUp.css"
import { ActiveContext } from "../../contexts/Contexts";



export default function CountUp({ end, duration = 700 }) {
  const {theme} = useContext(ActiveContext)
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stepTime = 16;
    const steps = Math.ceil(duration / stepTime);
    const increment = end / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        clearInterval(interval);
        setCount(end);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [end, duration]);

  return (
    <span className={`fade-in ${theme === "#202024" || theme === "#1D1F79" ? "!text-white" : "!text-black"}`}>
      {count?.toLocaleString()}
    </span>
  );
}
