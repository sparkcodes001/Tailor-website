// src/components/ui/ThemeToggle.jsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const iconRef = useRef(null);
  const glowRef = useRef(null);

  // ── Position thumb correctly whenever theme changes ───────
  useEffect(() => {
    gsap.to(thumbRef.current, {
      x: isDark ? 2 : 26,
      duration: 0.5,
      ease: "back.out(2.2)",
    });
    gsap.to(glowRef.current, {
      opacity: isDark ? 0.5 : 0.35,
      duration: 0.5,
    });
  }, [isDark]);

  const handleToggle = () => {
    const tl = gsap.timeline();

    // squash
    tl.to(thumbRef.current, {
      scaleX: 1.3,
      scaleY: 0.75,
      duration: 0.15,
      ease: "power2.in",
    })
      // spin icon out
      .to(
        iconRef.current,
        {
          rotate: isDark ? -90 : 90,
          opacity: 0,
          duration: 0.15,
          ease: "power2.in",
        },
        "<",
      )
      // flip state mid-animation
      .add(() => toggleTheme())
      // pop back + spin icon in
      .to(thumbRef.current, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.35,
        ease: "elastic.out(1, 0.6)",
      })
      .fromTo(
        iconRef.current,
        { rotate: isDark ? 90 : -90, opacity: 0 },
        { rotate: 0, opacity: 1, duration: 0.3, ease: "back.out(2)" },
        "-=0.2",
      );
  };

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="relative flex items-center w-14 h-7 rounded-full
                 flex-shrink-0 focus:outline-none group"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1a1c20, #25272c)"
          : "linear-gradient(135deg, #fdeef0, #f5d0d6)",
        border: `1px solid ${isDark ? "rgba(184,247,228,0.25)" : "rgba(107,29,46,0.25)"}`,
        transition: "background 0.5s ease, border-color 0.5s ease",
      }}
    >
      {/* ambient glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-full blur-md pointer-events-none"
        style={{
          background: isDark ? "#b8f7e4" : "#6b1d2e",
          opacity: 0.4,
        }}
      />

      {/* stars (dark mode) */}
      <div
        className="absolute inset-0 transition-opacity duration-500 overflow-hidden rounded-full"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        {[
          { top: "20%", left: "60%" },
          { top: "60%", left: "70%" },
          { top: "35%", left: "80%" },
        ].map((pos, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-white animate-pulse"
            style={{ ...pos, animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      {/* sun rays (light mode) */}
      <div
        className="absolute inset-0 transition-opacity duration-500 overflow-hidden rounded-full"
        style={{ opacity: isDark ? 0 : 1 }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full"
            style={{
              background: "#6b1d2e",
              top: `${25 + i * 20}%`,
              left: "18%",
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* track ring */}
      <div
        ref={trackRef}
        className="absolute inset-0.5 rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "rgba(184,247,228,0.04)"
            : "rgba(107,29,46,0.04)",
        }}
      />

      {/* Thumb */}
      <div
        ref={thumbRef}
        className="relative w-5 h-5 rounded-full flex items-center
                   justify-center shadow-lg z-10"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #b8f7e4, #7ee8c8)"
            : "linear-gradient(135deg, #6b1d2e, #8a3245)",
          transform: `translateX(${isDark ? 2 : 26}px)`,
        }}
      >
        <span ref={iconRef} className="text-[10px] leading-none select-none">
          {isDark ? "🌙" : "☀️"}
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;
