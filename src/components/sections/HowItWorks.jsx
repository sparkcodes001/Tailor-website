import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";import GradientText from "../ui/GradientText";
import { useTheme } from "../../context/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: "01",
    title: "Browse & Choose",
    description:
      "Explore our collection of ready-made pieces or start a custom order. Pick your style, fabric and design.",
    icon: "🛍️",
  },
  {
    step: "02",
    title: "Chat With Tailor",
    description:
      "Talk directly with our expert tailor on WhatsApp. Share your measurements, preferences and any special requests.",
    icon: "💬",
  },
  {
    step: "03",
    title: "We Craft It",
    description:
      "Our master tailor handcrafts your outfit with premium fabrics and precision stitching. Every detail perfected.",
    icon: "✂️",
  },
  {
    step: "04",
    title: "Delivered To You",
    description:
      "Your order is carefully packaged and shipped straight to your door — anywhere in the world.",
    icon: "🌍",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const { isDark } = useTheme();

  // ── TOKENS — same pattern as Hero / Services ──────────────
  const accent = isDark ? "#b8f7e4" : "#6b1d2e";
  const accentDeep = isDark ? "#7ee8c8" : "#4e1220";
  const accentBg06 = isDark ? "rgba(184,247,228,0.06)" : "rgba(107,29,46,0.06)";
  const accentBg10 = isDark ? "rgba(184,247,228,0.10)" : "rgba(107,29,46,0.10)";
  const accentBorder20 = isDark
    ? "rgba(184,247,228,0.20)"
    : "rgba(107,29,46,0.20)";
  const accentBorder30 = isDark
    ? "rgba(184,247,228,0.30)"
    : "rgba(107,29,46,0.30)";
  const accentFaint = isDark
    ? "rgba(184,247,228,0.40)"
    : "rgba(107,29,46,0.40)";

  const sectionBg = isDark ? "#25272c" : "#fffdf7";
  const textPrimary = isDark ? "#ffffff" : "#1a0a0e";
  const textSub = isDark ? "rgba(255,255,255,0.45)" : "rgba(26,10,14,0.50)";
  const textMuted = isDark ? "rgba(255,255,255,0.40)" : "rgba(26,10,14,0.40)";

  const btnText = isDark ? "#25272c" : "#fffdf7";
  const btn2Bg = isDark ? "rgba(255,255,255,0.05)" : "rgba(107,29,46,0.05)";
  const btn2Border = isDark ? "rgba(184,247,228,0.20)" : "rgba(107,29,46,0.20)";
  const btn2Text = isDark ? "#ffffff" : "#1a0a0e";

  const dotPattern = isDark ? "rgba(184,247,228,1)" : "rgba(107,29,46,1)";
  const topFadeBg = isDark ? "#25272c" : "#fffdf7";

  const connectorLine = isDark
    ? "linear-gradient(90deg,transparent,rgba(184,247,228,0.30),rgba(184,247,228,0.30),transparent)"
    : "linear-gradient(90deg,transparent,rgba(107,29,46,0.20),rgba(107,29,46,0.20),transparent)";

  const headingGrad = isDark
    ? "linear-gradient(135deg, #b8f7e4, #7ee8c8)"
    : "linear-gradient(135deg, #6b1d2e, #4e1220)";

  const labelLineL = isDark
    ? "linear-gradient(90deg, transparent, #b8f7e4)"
    : "linear-gradient(90deg, transparent, #6b1d2e)";
  const labelLineR = isDark
    ? "linear-gradient(90deg, #b8f7e4, transparent)"
    : "linear-gradient(90deg, #6b1d2e, transparent)";

  // ── SCROLL ANIMATIONS ─────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hiw-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hiw-title", start: "top 85%" },
        },
      );
      gsap.fromTo(
        ".hiw-step",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hiw-step", start: "top 85%" },
        },
      );
      gsap.fromTo(
        ".hiw-line",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".hiw-line", start: "top 85%" },
        },
      );
      gsap.fromTo(
        ".step-number",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".step-number", start: "top 85%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden"
      style={{
        background: sectionBg,
        transition: "background 0.5s ease",
      }}
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${dotPattern} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          transition: "background-image 0.5s ease",
        }}
      />

      {/* Top fade — blends with section above */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${topFadeBg}, transparent)`,
          transition: "background 0.5s ease",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── HEADER ────────────────────────────────────── */}
        <div className="hiw-title text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div
              className="h-px w-8"
              style={{
                background: labelLineL,
                transition: "background 0.5s ease",
              }}
            />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: accent, transition: "color 0.5s ease" }}
            >
              Simple Process
            </span>
            <div
              className="h-px w-8"
              style={{
                background: labelLineR,
                transition: "background 0.5s ease",
              }}
            />
          </div>

          <h2
            className="font-display text-3xl md:text-5xl font-bold mb-4"
            style={{ color: textPrimary, transition: "color 0.5s ease" }}
          >
            How It <GradientText isDark={isDark}>Works</GradientText>
          </h2>

          <p
            className="max-w-md mx-auto text-sm md:text-base"
            style={{ color: textMuted, transition: "color 0.5s ease" }}
          >
            From your first message to your door — a seamless experience
            designed around you.
          </p>
        </div>

        {/* ── STEPS ─────────────────────────────────────── */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 px-32 pointer-events-none">
            <div
              className="hiw-line h-px w-full"
              style={{
                background: connectorLine,
                transition: "background 0.5s ease",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className="hiw-step flex flex-col items-center
                           md:items-start lg:items-center text-center
                           md:text-left lg:text-center"
              >
                {/* Circle */}
                <div className="relative mb-6">
                  <div
                    className="step-number w-20 h-20 rounded-full
                               flex items-center justify-center relative z-10"
                    style={{
                      background: accentBg06,
                      border: `1px solid ${accentBorder20}`,
                      transition:
                        "background 0.5s ease, border-color 0.5s ease",
                    }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                  </div>

                  {/* Badge */}
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full
                               flex items-center justify-center z-20"
                    style={{
                      background: accent,
                      transition: "background 0.5s ease",
                    }}
                  >
                    <span
                      className="text-xs font-black"
                      style={{ color: btnText, transition: "color 0.5s ease" }}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Glow */}
                  <div
                    className="absolute inset-0 rounded-full opacity-20 blur-xl"
                    style={{
                      background: accent,
                      transition: "background 0.5s ease",
                    }}
                  />
                </div>

                {/* Step label */}
                <span
                  className="text-xs font-bold tracking-[0.3em] uppercase mb-2"
                  style={{ color: accentFaint, transition: "color 0.5s ease" }}
                >
                  Step {item.step}
                </span>

                {/* Title */}
                <h3
                  className="font-display font-bold text-xl mb-3"
                  style={{ color: textPrimary, transition: "color 0.5s ease" }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed max-w-[220px]"
                  style={{ color: textSub, transition: "color 0.5s ease" }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ────────────────────────────────── */}
        <div
          className="mt-16 md:mt-20 flex flex-col sm:flex-row
                     items-center justify-center gap-4"
        >
          {/* Primary */}
          <Link
            to="/custom-order"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                       font-bold text-sm hover:opacity-90 transition-all
                       duration-300 hover:scale-105 active:scale-95"
            style={{
              background: accent,
              color: btnText,
              transition: "background 0.5s ease, color 0.5s ease",
            }}
          >
            Start Your Order
            <span>→</span>
          </Link>

          {/* Secondary */}
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                       font-semibold text-sm transition-all duration-300
                       active:scale-95"
            style={{
              background: btn2Bg,
              border: `1px solid ${btn2Border}`,
              color: btn2Text,
              transition: "all 0.5s ease",
            }}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Ask A Question
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
