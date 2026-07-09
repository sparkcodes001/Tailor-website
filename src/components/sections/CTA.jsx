import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { createCustomOrderLink, createGeneralLink } from "../../utils/whatsapp";

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  // ── MOUSE PARALLAX ON BG ──────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      gsap.to(bgRef.current, {
        x,
        y,
        duration: 1.5,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ── ENTRANCE ANIMATIONS ───────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
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
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
          },
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

  // ── BUTTON MAGNETIC EFFECT ────────────────────────────────
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
      style={{ background: "#25272c" }}
    >
      {/* ── BACKGROUND ELEMENTS ────────────────────────────── */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        {/* Big mint circle top left */}
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px]
                     rounded-full opacity-[0.06]"
          style={{ background: "#b8f7e4" }}
        />

        {/* Big mint circle bottom right */}
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px]
                     rounded-full opacity-[0.04]"
          style={{ background: "#b8f7e4" }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(184,247,228,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,247,228,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Diagonal lines decoration */}
        <div className="absolute top-20 right-20 opacity-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
                border: "1px solid rgba(184,247,228,0.4)",
                top: `${-i * 40}px`,
                left: `${-i * 40}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── TOP LINE ───────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div
            className="cta-line h-px flex-1 max-w-16"
            style={{
              background: "linear-gradient(90deg, transparent, #b8f7e4)",
            }}
          />
          <div
            className="cta-badge inline-flex items-center gap-2 px-4 py-1.5
                       rounded-full text-xs font-semibold tracking-widest
                       uppercase"
            style={{
              background: "rgba(184,247,228,0.08)",
              border: "1px solid rgba(184,247,228,0.2)",
              color: "#b8f7e4",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#b8f7e4]
                         animate-pulse"
            />
            Ready To Order
          </div>
          <div
            className="cta-line h-px flex-1 max-w-16"
            style={{
              background: "linear-gradient(90deg, #b8f7e4, transparent)",
            }}
          />
        </div>

        {/* ── HEADING ──────────────────────────────────────── */}
        <div className="text-center mb-6">
          <h2 className="font-display font-bold leading-tight">
            <div
              className="cta-heading text-4xl md:text-6xl lg:text-7xl
                         text-white mb-2"
            >
              Your Perfect Outfit
            </div>
            <div
              className="cta-heading text-4xl md:text-6xl lg:text-7xl
                         italic"
              style={{
                background: "linear-gradient(135deg, #b8f7e4, #7ee8c8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Starts Here.
            </div>
          </h2>
        </div>

        {/* ── SUBTEXT ──────────────────────────────────────── */}
        <p
          className="cta-sub text-center text-white/45 text-base
                     md:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Whether it's a custom order or a ready-made piece — chat with our
          tailor directly and we'll make it happen, and ship it anywhere in the
          world.
        </p>

        {/* ── BUTTONS ──────────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row items-center
                     justify-center gap-4 mb-14"
        >
          {/* Primary */}
          <Link
            to="/shop"
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            className="cta-btn group relative w-full sm:w-auto
                       inline-flex items-center justify-center gap-3
                       px-10 py-5 rounded-2xl font-bold text-base
                       text-[#25272c] overflow-hidden
                       transition-shadow duration-300
                       hover:shadow-2xl hover:shadow-[#b8f7e4]/25
                       active:scale-95"
            style={{ background: "#b8f7e4" }}
          >
            {/* Shimmer */}
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
              className="relative z-10 w-7 h-7 rounded-full
                         bg-[#25272c]/10 flex items-center justify-center
                         group-hover:translate-x-1 transition-transform
                         duration-300"
            >
              →
            </span>
          </Link>

          {/* Secondary - WhatsApp */}
          <a
            href={createCustomOrderLink()}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            className="cta-btn group relative w-full sm:w-auto
                       inline-flex items-center justify-center gap-3
                       px-10 py-5 rounded-2xl font-semibold text-base
                       text-white overflow-hidden transition-all duration-300
                       hover:shadow-xl hover:shadow-black/20
                       active:scale-95"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(184,247,228,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              className="absolute inset-0 opacity-0
                         group-hover:opacity-100 transition-opacity
                         duration-500 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(184,247,228,0.06) 50%, transparent 65%)",
              }}
            />
            {/* WhatsApp live dot */}
            <span className="relative z-10 flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full bg-green-400
                           animate-pulse"
              />
              <span>Chat With Tailor</span>
            </span>
            <span
              className="relative z-10 text-[#b8f7e4]
                         group-hover:rotate-45 transition-transform
                         duration-300"
            >
              ✦
            </span>
          </a>
        </div>

        {/* ── FEATURE PILLS ────────────────────────────────── */}
        <div
          className="flex flex-wrap items-center justify-center
                     gap-3 md:gap-4"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="cta-feature inline-flex items-center gap-2
                         px-4 py-2 rounded-full text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#b8f7e4" }}
              />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BRAND STRIP ─────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t
                   py-4 px-6"
        style={{ borderColor: "rgba(184,247,228,0.06)" }}
      >
        <div
          className="max-w-7xl mx-auto flex items-center
                     justify-between"
        >
          <span
            className="font-display font-bold text-sm"
            style={{ color: "rgba(255,255,255,0.15)" }}
          >
            Grandeur Tailors
          </span>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.1)" }}
          >
            Premium · Worldwide · Handcrafted
          </span>
        </div>
      </div>

      {/* Shimmer keyframe */}
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
