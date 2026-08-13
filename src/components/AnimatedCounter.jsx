import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Counts up from 0 to `value` once it scrolls into view. Purely presentational -
 * doesn't refetch or re-trigger on re-render, just plays once per mount.
 */
const AnimatedCounter = ({ value, duration = 1.5, suffix = "", prefix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const numericTarget = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
    const start = performance.now();

    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(numericTarget * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(numericTarget);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration]);

  const isDecimal = String(value).includes(".");
  const formatted = isDecimal ? display.toFixed(1) : Math.round(display).toLocaleString();

  return (
    <motion.span ref={ref} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {prefix}
      {formatted}
      {suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
