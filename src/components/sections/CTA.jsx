import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { createCustomOrderLink } from "../../utils/whatsapp";
import { useTheme } from "../../context/ThemeContext";
import GradientText from "../ui/GradientText";

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const { isDark } = useTheme();

  // ── THEME TOKENS ──────────────────────────────────────────
  const accent = isDark ? "#b8f7e4" : "#6b1d2e";
  const accentDeep = isDark ? "#7ee8c8" : "#4e1220";
  const sectionBg = isDark ? "#25272c" : "#fffdf7";
  const textPrimary = isDark ? "#ffffff" : "#1a0a0e";
  const textSub = isDark ? "rgba(255,255,255,0.45)" : "rgba(26,10,14,0.50)";

  const badgeBg = isDark ? "rgba(184,247,228,0.08)" : "rgba(107,29,46,0.08)";
  const badgeBorder = isDark
    ? "rgba(184,247,228,0.20)"
    : "rgba(107,29,46,0.20)";

  const circleColor = accent;
  const gridColor = isDark ? "rgba(184,247,228,1)" : "rgba(107,29,46,1)";
  const ringBorder = isDark ? "rgba(184,247,228,0.4)" : "rgba(107,29,46,0.3)";

  const btnText = isDark ? "#25272c" : "#fffdf7";
  const btnShadow = isDark ? "rgba(184,247,228,0.25)" : "rgba(107,29,46,0.20)";

  const btn2Bg = isDark ? "rgba(255,255,255,0.04)" : "rgba(107,29,46,0.04)";
  const btn2Border = isDark ? "rgba(184,247,228,0.20)" : "rgba(107,29,46,0.20)";
  const btn2Shine = isDark ? "rgba(184,247,228,0.06)" : "rgba(107,29,46,0.06)";

  const pillBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(107,29,46,0.03)";
  const pillBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(107,29,46,0.10)";
  const pillText = isDark ? "rgba(255,255,255,0.45)" : "rgba(26,10,14,0.50)";

  const stripBorder = isDark
    ? "rgba(184,247,228,0.06)"
    : "rgba(107,29,46,0.10)";
  const stripBrand = isDark ? "rgba(255,255,255,0.15)" : "rgba(26,10,14,0.18)";
  const stripTag = isDark ? "rgba(255,255,255,0.10)" : "rgba(26,10,14,0.12)";

  const labelLineL = isDark
    ? "linear-gradient(90deg, transparent, #b8f7e4)"
    : "linear-gradient(90deg, transparent, #6b1d2e)";
  const labelLineR = isDark
    ? "linear-gradient(90deg, #b8f7e4, transparent)"
    : "linear-gradient(90deg, #6b1d2e, transparent)";

  // ── MOUSE PARALLAX ON BG ──────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      gsap.to(bgRef.current, { x, y, duration: 1.5, ease: "power2.out" });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ── ENTRANCE ANIMATIONS ───────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      tl.fromTo(
        ".cta-badge",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
      )
        .fromTo(
          ".cta-line",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
          "-=0.3",
        )
        .fromTo(
          ".cta-heading",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(
          ".cta-sub",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.5",
        )
        .fromTo(
          ".cta-btn",
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: "back.out(2)",
          },
          "-=0.4",
        )
        .fromTo(
          ".cta-feature",
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── MAGNETIC BUTTONS ──────────────────────────────────────
  const handleBtnMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleBtnMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  const features = [
    "Ships to 50+ countries",
    "100% handcrafted",
    "Direct tailor communication",
    "Perfect fit guaranteed",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: sectionBg, transition: "background 0.5s ease" }}
    >
      {/* ── BACKGROUND ELEMENTS ────────────────────────────── */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{
            background: circleColor,
            transition: "background 0.5s ease",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: circleColor,
            transition: "background 0.5s ease",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            transition: "background-image 0.5s ease",
          }}
        />
        <div className="absolute top-20 right-20 opacity-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
                border: `1px solid ${ringBorder}`,
                top: `${-i * 40}px`,
                left: `${-i * 40}px`,
                transition: "border-color 0.5s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── TOP LABEL ──────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div
            className="cta-line h-px flex-1 max-w-16"
            style={{
              background: labelLineL,
              transition: "background 0.5s ease",
            }}
          />
          <div
            className="cta-badge inline-flex items-center gap-2 px-4 py-1.5
                       rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: badgeBg,
              border: `1px solid ${badgeBorder}`,
              color: accent,
              transition: "all 0.5s ease",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: accent, transition: "background 0.5s ease" }}
            />
            Ready To Order
          </div>
          <div
            className="cta-line h-px flex-1 max-w-16"
            style={{
              background: labelLineR,
              transition: "background 0.5s ease",
            }}
          />
        </div>

        {/* ── HEADING ──────────────────────────────────────── */}
        <div className="text-center mb-6">
          <h2 className="font-display font-bold leading-tight">
            <div
              className="cta-heading text-4xl md:text-6xl lg:text-7xl mb-2"
              style={{ color: textPrimary, transition: "color 0.5s ease" }}
            >
              Your Perfect Outfit
            </div>
            <div className="cta-heading text-4xl md:text-6xl lg:text-7xl italic">
              <GradientText isDark={isDark}>Starts Here.</GradientText>
            </div>
          </h2>
        </div>

        {/* ── SUBTEXT ──────────────────────────────────────── */}
        <p
          className="cta-sub text-center text-base md:text-lg max-w-xl
                     mx-auto mb-12 leading-relaxed"
          style={{ color: textSub, transition: "color 0.5s ease" }}
        >
          Whether it's a custom order or a ready-made piece — chat with our
          tailor directly and we'll make it happen, and ship it anywhere in the
          world.
        </p>

        {/* ── BUTTONS ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          {/* Primary */}
          <Link
            to="/shop"
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            className="cta-btn group relative w-full sm:w-auto
                       inline-flex items-center justify-center gap-3
                       px-10 py-5 rounded-2xl font-bold text-base
                       overflow-hidden transition-shadow duration-300
                       hover:shadow-2xl active:scale-95"
            style={{
              background: accent,
              color: btnText,
              boxShadow: "none",
              transition: "background 0.5s ease, color 0.5s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 25px 50px -12px ${btnShadow}`;
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100
                         transition-opacity duration-300 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%)",
                animation: "shimmer-slide 0.6s ease forwards",
              }}
            />
            <span className="relative z-10">Browse Collection</span>
            <span
              className="relative z-10 w-7 h-7 rounded-full flex items-center
                         justify-center group-hover:translate-x-1
                         transition-transform duration-300"
              style={{ background: `${btnText}1a` }}
            >
              →
            </span>
          </Link>

          {/* Secondary — WhatsApp */}
          <a
            href={createCustomOrderLink()}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            className="cta-btn group relative w-full sm:w-auto
                       inline-flex items-center justify-center gap-3
                       px-10 py-5 rounded-2xl font-semibold text-base
                       overflow-hidden transition-all duration-300
                       hover:shadow-xl active:scale-95"
            style={{
              background: btn2Bg,
              border: `1px solid ${btn2Border}`,
              backdropFilter: "blur(12px)",
              color: textPrimary,
              transition: "all 0.5s ease",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100
                         transition-opacity duration-500 pointer-events-none"
              style={{
                background: `linear-gradient(105deg, transparent 35%, ${btn2Shine} 50%, transparent 65%)`,
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Chat With Tailor</span>
            </span>
            <span
              className="relative z-10 group-hover:rotate-45 transition-transform duration-300"
              style={{ color: accent, transition: "color 0.5s ease" }}
            >
              ✦
            </span>
          </a>
        </div>

        {/* ── FEATURE PILLS ────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="cta-feature inline-flex items-center gap-2
                         px-4 py-2 rounded-full text-xs font-medium"
              style={{
                background: pillBg,
                border: `1px solid ${pillBorder}`,
                color: pillText,
                transition: "all 0.5s ease",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: accent,
                  transition: "background 0.5s ease",
                }}
              />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BRAND STRIP ─────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t py-4 px-6"
        style={{
          borderColor: stripBorder,
          transition: "border-color 0.5s ease",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span
            className="font-display font-bold text-sm"
            style={{ color: stripBrand, transition: "color 0.5s ease" }}
          >
            Grandeur Tailors
          </span>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: stripTag, transition: "color 0.5s ease" }}
          >
            Premium · Worldwide · Handcrafted
          </span>
        </div>
      </div>

      <style>{`
        @keyframes shimmer-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
};

export default CTA;
