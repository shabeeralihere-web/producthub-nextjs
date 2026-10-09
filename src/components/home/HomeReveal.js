"use client";

import { useEffect, useRef } from "react";

export default function HomeReveal({
  children,
  className = "",
  delay = "0ms",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`home-reveal ${className}`}
      style={{ "--reveal-delay": delay }}
    >
      {children}
    </div>
  );
}