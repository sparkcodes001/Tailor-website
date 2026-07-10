import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useTheme } from "../../context/ThemeContext";
import { createCustomOrderLink } from "../../utils/whatsapp";

import heroBgDark from "../../assets/images/hero/hero-bg-dark.jpg";
import heroBgLight from "../../assets/images/hero/hero-bg-light.jpg";

const Hero = () => {
  const heroRef = useRef(null);
  const darkImgRef = useRef(null);
  const lightImgRef = useRef(null);
  const bgWrapperRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const { isDark } = useTheme();

  // ── THEME TOKENS ──────────────────────────────────────────
  const accent = isDark ? "#b8f7e4" : "#6b1d2e";
  const accentDeep = isDark ? "#7ee8c8" : "#4e1220";
  const accentBg06 = isDark ? "rgba(184,247,228,0.06)" : "rgba(107,29,46,0.06)";
  const accentBg10 = isDark ? "rgba(184,247,228,0.10)" : "rgba(107,29,46,0.10)";
  const accentBg15 = isDark ? "rgba(184,247,228,0.15)" : "rgba(107,29,46,0.15)";
  const accentBg20 = isDark ? "rgba(184,247,228,0.20)" : "rgba(107,29,46,0.20)";
  const accentBg08 = isDark ? "rgba(184,247,228,0.08)" : "rgba(107,29,46,0.08)";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(107,29,46,0.03)";
  const cardBorder = isDark ? "rgba(184,247,228,0.12)" : "rgba(107,29,46,0.12)";
  const textPrimary = isDark ? "#ffffff" : "#1a0a0e";
  const textSub = isDark ? "rgba(255,255,255,0.55)" : "rgba(26,10,14,0.55)";
  const textFaint = isDark ? "rgba(255,255,255,0.22)" : "rgba(26,10,14,0.22)";
  const btnText = isDark ? "#25272c" : "#fffdf7";
  const btn2Bg = isDark ? "rgba(255,255,255,0.05)" : "rgba(107,29,46,0.05)";
  const btn2Border = isDark ? "rgba(184,247,228,0.20)" : "rgba(107,29,46,0.20)";
  const btn2Text = isDark ? "#ffffff" : "#1a0a0e";
  const divider = isDark ? "rgba(255,255,255,0.10)" : "rgba(26,10,14,0.10)";
  const progressBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(107,29,46,0.08)";
  const flagBg = isDark ? "rgba(255,255,255,0.10)" : "rgba(107,29,46,0.06)";
  const flagBorder = isDark ? "#25272c" : "#fffdf7";
  const scrollBdr = isDark ? "rgba(255,255,255,0.15)" : "rgba(26,10,14,0.15)";
  const marqClr = isDark ? "rgba(255,255,255,0.14)" : "rgba(26,10,14,0.18)";
  const barBorder = isDark ? "rgba(184,247,228,0.08)" : "rgba(107,29,46,0.08)";
  const heroBase = isDark ? "#15171a" : "#fffdf7";
  const cursorClr = isDark ? "rgba(184,247,228,0.60)" : "rgba(107,29,46,0.60)";

  const overlayGrad = isDark
    ? "linear-gradient(110deg,rgba(15,17,20,0.98) 0%,rgba(15,17,20,0.93) 30%,rgba(15,17,20,0.60) 58%,rgba(15,17,20,0.10) 100%)"
    : "linear-gradient(110deg,rgba(255,253,247,0.97) 0%,rgba(255,253,247,0.92) 30%,rgba(255,253,247,0.55) 58%,rgba(255,253,247,0.05) 100%)";

  const bottomFade = isDark
    ? "linear-gradient(to top,#25272c,transparent)"
    : "linear-gradient(to top,#fffdf7,transparent)";

  const radialGlow = isDark
    ? "radial-gradient(circle,rgba(184,247,228,0.32) 0%,transparent 65%)"
    : "radial-gradient(circle,rgba(232,180,188,0.38) 0%,transparent 65%)";

  const gridClr = isDark ? "rgba(184,247,228,0.7)" : "rgba(107,29,46,0.7)";

  // ── BG CROSSFADE ON THEME SWITCH ─────────────────────────
  // Both images live in the DOM at once.
  // We GSAP-fade the opacity so the transition is silky smooth.
  useEffect(() => {
    if (isDark) {
      gsap.to(darkImgRef.current, {
        opacity: 1,
        duration: 0.9,
        ease: "power2.inOut",
      });
      gsap.to(lightImgRef.current, {
        opacity: 0,
        duration: 0.9,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(lightImgRef.current, {
        opacity: 1,
        duration: 0.9,
        ease: "power2.inOut",
      });
      gsap.to(darkImgRef.current, {
        opacity: 0,
        duration: 0.9,
        ease: "power2.inOut",
      });
    }
  }, [isDark]);

  // ── CONTINUOUS SLOW BG DRIFT (no mouse needed) ────────────
  // The image gently drifts in a figure-8 pattern all the time.
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(bgWrapperRef.current, {
      x: 18,
      y: -10,
      duration: 7,
      ease: "sine.inOut",
    })
      .to(bgWrapperRef.current, {
        x: -14,
        y: 12,
        duration: 8,
        ease: "sine.inOut",
      })
      .to(bgWrapperRef.current, {
        x: 10,
        y: 6,
        duration: 6,
        ease: "sine.inOut",
      })
      .to(bgWrapperRef.current, {
        x: -8,
        y: -14,
        duration: 7,
        ease: "sine.inOut",
      });

    return () => tl.kill();
  }, []);

  // // ── EXTRA PARALLAX ON MOUSE MOVE (adds on top of drift) ───
  // useEffect(() => {
  //   const onMove = (e) => {
  //     const { innerWidth, innerHeight } = window;
  //     const px = (e.clientX / innerWidth - 0.5) * 22;
  //     const py = (e.clientY / innerHeight - 0.5) * 12;
  //     // We nudge the wrapper a bit extra; drift continues underneath
  //     gsap.to(bgWrapperRef.current, {
  //       x: `+=${px * 0.08}`,
  //       y: `+=${py * 0.08}`,
  //       duration: 1.4,
  //       ease: "power2.out",
  //       overwrite: false,
  //     });
  //   };
  //   window.addEventListener("mousemove", onMove);
  //   return () => window.removeEventListener("mousemove", onMove);
  // }, []);

  // ── CUSTOM CURSOR ─────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      const { clientX: x, clientY: y } = e;
      gsap.to(cursorRef.current, {
        x: x - 20,
        y: y - 20,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(cursorDotRef.current, {
        x: x - 4,
        y: y - 4,
        duration: 0.1,
        ease: "none",
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── ENTRANCE ANIMATIONS (run once on mount) ───────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(
        ".line-reveal",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, ease: "power3.inOut", stagger: 0.1 },
      )
        .fromTo(
          ".hero-badge",
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(
          ".heading-line",
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power4.out",
          },
          "-=0.4",
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.5",
        )
        .fromTo(
          ".hero-btn",
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "back.out(2)",
          },
          "-=0.4",
        )
        .fromTo(
          ".hero-stat",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .fromTo(
          ".side-card",
          { opacity: 0, x: 50, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.8",
        )
        .fromTo(
          ".float-el",
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(2)",
          },
          "-=0.5",
        );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // ── FLOATING CARDS ANIMATION ──────────────────────────────
  useEffect(() => {
    gsap.to(".float-card-1", {
      y: -12,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
    gsap.to(".float-card-2", {
      y: -8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: 0.5,
    });
    gsap.to(".float-card-3", {
      y: -10,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: 1,
    });
    gsap.to(".scroll-dot", {
      y: 10,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  // ── MAGNETIC BUTTONS ──────────────────────────────────────
  const onBtnMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(e.currentTarget, {
      x: (e.clientX - r.left - r.width / 2) * 0.3,
      y: (e.clientY - r.top - r.height / 2) * 0.3,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const onBtnLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1,0.5)",
    });
  };

  // ── GRADIENT TEXT HELPER ──────────────────────────────────
  // Isolating gradient text in inline-block prevents the
  // "solid colour block" rendering bug on theme switch.
  const GradText = ({ children, className = "" }) => (
    <span
      className={className}
      style={{
        display: "inline-block",
        background: `linear-gradient(135deg, ${accent} 0%, ${accentDeep} 50%, ${accent} 100%)`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );

  return (
    <>
      {/* ── CURSOR ─────────────────────────────────────────── */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full z-[999]
                   pointer-events-none hidden lg:block"
        style={{
          border: `1px solid ${cursorClr}`,
          position: "fixed",
          mixBlendMode: isDark ? "difference" : "multiply",
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full z-[999]
                   pointer-events-none hidden lg:block"
        style={{ background: accent, position: "fixed" }}
      />

      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: heroBase, transition: "background 0.7s ease" }}
      >
        {/* ── BACKGROUND LAYER ───────────────────────────── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/*
            bgWrapperRef wraps BOTH images + decorative layers.
            The drift / parallax GSAP animates this wrapper.
            scale-110 gives room to move without showing edges.
          */}
          <div
            ref={bgWrapperRef}
            className="absolute inset-0 scale-110"
            style={{ willChange: "transform" }}
          >
            {/* DARK image - starts fully visible */}
            <img
              ref={darkImgRef}
              src={heroBgDark}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ opacity: isDark ? 1 : 0 }}
            />

            {/* LIGHT image - starts hidden unless light mode */}
            <img
              ref={lightImgRef}
              src={heroBgLight}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ opacity: isDark ? 0 : 1 }}
            />
          </div>

          {/* Overlay gradient - smooth theme transition */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: overlayGrad,
              transition: "background 0.7s ease",
            }}
          />

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-48 z-10"
            style={{
              background: bottomFade,
              transition: "background 0.7s ease",
            }}
          />

          {/* Radial glow */}
          <div
            className="absolute top-20 right-40 w-[500px] h-[500px]
                       rounded-full opacity-[0.15] pointer-events-none z-10"
            style={{
              background: radialGlow,
              transition: "background 0.7s ease",
            }}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.025] z-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(${gridClr} 1px, transparent 1px),
                linear-gradient(90deg, ${gridClr} 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              transition: "background-image 0.7s ease",
            }}
          />
        </div>

        {/* ── CONTENT ────────────────────────────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* ── LEFT ─────────────────────────────────── */}
            <div>
              {/* Badge */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="line-reveal h-[1px] w-12"
                  style={{ background: accent }}
                />
                <div
                  className="hero-badge flex items-center gap-2 text-xs
                                font-semibold tracking-[0.2em] uppercase"
                  style={{ color: accent }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: accent }}
                  />
                  Est. Premium Tailoring
                </div>
              </div>

              {/* Heading */}
              <h1 className="font-display font-bold leading-[1.05] mb-8">
                <div className="overflow-hidden mb-2">
                  <div
                    className="heading-line text-5xl md:text-6xl lg:text-[5.5rem]"
                    style={{
                      color: textPrimary,
                      transition: "color 0.5s ease",
                    }}
                  >
                    Crafted
                  </div>
                </div>

                <div className="overflow-hidden mb-2">
                  <div
                    className="heading-line text-5xl md:text-6xl
                                  lg:text-[5.5rem] flex items-center gap-4"
                  >
                    <span
                      style={{
                        color: textPrimary,
                        transition: "color 0.5s ease",
                      }}
                    >
                      For
                    </span>
                    {/*
                      KEY FIX: inline-block + no animation prop inline.
                      The shimmer-text class in index.css does the animation.
                      This stops the "solid block" rendering bug.
                    */}
                    <GradText className="italic shimmer-text">You</GradText>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <div
                    className="heading-line text-4xl md:text-5xl lg:text-6xl
                                  font-light tracking-widest"
                    style={{ color: textFaint, transition: "color 0.5s ease" }}
                  >
                    · Worldwide ·
                  </div>
                </div>
              </h1>

              {/* Sub */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="line-reveal h-[1px] flex-1 max-w-[80px]"
                  style={{
                    background: `linear-gradient(90deg, ${accent}, transparent)`,
                  }}
                />
                <p
                  className="hero-sub text-base md:text-lg leading-relaxed max-w-md"
                  style={{ color: textSub, transition: "color 0.5s ease" }}
                >
                  Your exact measurements, your style, your fabric. We sew it
                  perfectly and ship it to your doorstep — anywhere on earth.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mb-14">
                {/* Primary */}
                <Link
                  to="/shop"
                  onMouseMove={onBtnMove}
                  onMouseLeave={onBtnLeave}
                  className="hero-btn group relative inline-flex items-center
                             gap-3 px-8 py-4 rounded-2xl font-bold text-sm
                             overflow-hidden hover:shadow-2xl active:scale-95"
                  style={{
                    background: accent,
                    color: btnText,
                    transition:
                      "background 0.5s ease, color 0.5s ease, box-shadow 0.3s ease",
                  }}
                >
                  {/* shimmer sweep */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100
                               transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.35) 50%,transparent 60%)",
                    }}
                  />
                  <span className="relative z-10 tracking-wide">
                    Browse Collection
                  </span>
                  <span
                    className="relative z-10 w-7 h-7 rounded-full flex items-center
                               justify-center group-hover:translate-x-1
                               transition-transform duration-300"
                    style={{ background: `${btnText}22` }}
                  >
                    →
                  </span>
                </Link>

                {/* Secondary */}
                <a
                  href={createCustomOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseMove={onBtnMove}
                  onMouseLeave={onBtnLeave}
                  className="hero-btn group relative inline-flex items-center
                             gap-3 px-8 py-4 rounded-2xl font-semibold text-sm
                             overflow-hidden hover:shadow-xl active:scale-95"
                  style={{
                    background: btn2Bg,
                    border: `1px solid ${btn2Border}`,
                    backdropFilter: "blur(12px)",
                    color: btn2Text,
                    transition: "all 0.5s ease",
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100
                               transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `linear-gradient(105deg,transparent 40%,${accent}14 50%,transparent 60%)`,
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="tracking-wide">Custom Order</span>
                  </span>
                  <span
                    className="relative z-10 group-hover:rotate-45
                               transition-transform duration-300"
                    style={{ color: accent }}
                  >
                    ✦
                  </span>
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 flex-wrap">
                {[
                  { number: "500+", label: "Customers" },
                  { number: "50+", label: "Countries" },
                  { number: "100%", label: "Handmade" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="hero-stat flex items-center gap-3"
                  >
                    {i !== 0 && (
                      <div
                        className="w-px h-8"
                        style={{
                          background: divider,
                          transition: "background 0.5s ease",
                        }}
                      />
                    )}
                    <div>
                      {/* inline-block fix for gradient text */}
                      <p className="text-2xl font-bold font-display">
                        <GradText>{stat.number}</GradText>
                      </p>
                      <p
                        className="text-xs tracking-wider uppercase mt-0.5"
                        style={{
                          color: textFaint,
                          transition: "color 0.5s ease",
                        }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT - FLOATING CARDS ────────────────── */}
            <div className="hidden lg:flex flex-col items-end gap-5 relative pr-4">
              {/* Card 1 - Custom Fit */}
              <div
                className="float-card-1 side-card w-64 rounded-3xl p-5
                           relative overflow-hidden"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(20px)",
                  transition: "background 0.5s ease, border-color 0.5s ease",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center
                               justify-center text-lg"
                    style={{
                      background: accentBg10,
                      transition: "background 0.5s ease",
                    }}
                  >
                    ✂️
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: textPrimary,
                        transition: "color 0.5s ease",
                      }}
                    >
                      Custom Fit
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: textSub, transition: "color 0.5s ease" }}
                    >
                      Your measurements
                    </p>
                  </div>
                </div>

                {["Fabric", "Stitching", "Fitting"].map((label, i) => (
                  <div key={label} className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs w-14"
                      style={{ color: textSub, transition: "color 0.5s ease" }}
                    >
                      {label}
                    </span>
                    <div
                      className="flex-1 h-1 rounded-full"
                      style={{
                        background: progressBg,
                        transition: "background 0.5s ease",
                      }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${[85, 92, 78][i]}%`,
                          background: `linear-gradient(90deg,${accent},${accentDeep})`,
                          transition: "background 0.5s ease",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: accent, transition: "color 0.5s ease" }}
                    >
                      {[85, 92, 78][i]}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Card 2 - Shipping */}
              <div
                className="float-card-2 side-card w-56 rounded-3xl p-4 ml-12 relative"
                style={{
                  background: accentBg06,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(20px)",
                  transition: "all 0.5s ease",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: accentBg15,
                      transition: "background 0.5s ease",
                    }}
                  >
                    🌍
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{
                        color: textPrimary,
                        transition: "color 0.5s ease",
                      }}
                    >
                      Ships Worldwide
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: accent, transition: "color 0.5s ease" }}
                    >
                      50+ countries reached
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="flex -space-x-2">
                    {["🇬🇧", "🇺🇸", "🇨🇦", "🇦🇺"].map((f, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full flex items-center
                                   justify-center text-xs border"
                        style={{
                          background: flagBg,
                          borderColor: flagBorder,
                          transition: "all 0.5s ease",
                        }}
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: textSub, transition: "color 0.5s ease" }}
                  >
                    +46 more
                  </span>
                </div>
              </div>

              {/* Card 3 - Rating */}
              <div
                className="float-card-3 side-card w-52 rounded-3xl p-4"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(20px)",
                  transition: "all 0.5s ease",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="text-sm"
                        style={{ color: accent, transition: "color 0.5s ease" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: textPrimary,
                      transition: "color 0.5s ease",
                    }}
                  >
                    5.0
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: textSub, transition: "color 0.5s ease" }}
                >
                  "Absolutely perfect fit. Better than any store I've visited!"
                </p>
                <p
                  className="text-xs mt-2 font-medium"
                  style={{ color: accent, transition: "color 0.5s ease" }}
                >
                  — Sarah J, London 🇬🇧
                </p>
              </div>

              {/* Decorative dots */}
              <div className="float-el absolute -top-8 right-0 flex gap-1.5">
                {[1, 2, 3].map((d) => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: accentBg20,
                      transition: "background 0.5s ease",
                    }}
                  />
                ))}
              </div>

              {/* Decorative circle */}
              <div
                className="float-el absolute bottom-0 right-0 w-32 h-32
                           rounded-full opacity-10"
                style={{
                  border: `1px solid ${accent}`,
                  transition: "border-color 0.5s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ─────────────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 border-t"
          style={{
            borderColor: barBorder,
            transition: "border-color 0.5s ease",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-9 rounded-full border flex items-start
                           justify-center p-1"
                style={{
                  borderColor: scrollBdr,
                  transition: "border-color 0.5s ease",
                }}
              >
                <div
                  className="scroll-dot w-1 h-2.5 rounded-full"
                  style={{
                    background: accent,
                    transition: "background 0.5s ease",
                  }}
                />
              </div>
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: textFaint, transition: "color 0.5s ease" }}
              >
                Scroll to explore
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {[
                "Custom Tailoring",
                "·",
                "Ready Made",
                "·",
                "Alterations",
                "·",
                "Worldwide Shipping",
                "·",
                "Premium Quality",
              ].map((item, i) => (
                <span
                  key={i}
                  className="text-xs tracking-widest uppercase"
                  style={{ color: marqClr, transition: "color 0.5s ease" }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── STYLES ─────────────────────────────────────── */}
        <style>{`
          .shimmer-text {
            animation: gradientShimmer 3s linear infinite;
          }
          @keyframes gradientShimmer {
            0%   { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          @keyframes shimmer-btn {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(200%);  }
          }
        `}</style>
      </section>
    </>
  );
};

export default Hero;
