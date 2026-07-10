import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import GradientText from "../ui/GradientText";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    icon: "📐",
    title: "Custom Tailoring",
    description:
      "Send your measurements and style vision. We craft your perfect outfit from scratch using premium fabrics.",
    features: [
      "Your exact measurements",
      "Fabric of your choice",
      "Any style or design",
      "Ships to your door",
    ],
    cta: "Order Custom",
    link: "/custom-order",
  },
  {
    id: 2,
    icon: "👔",
    title: "Ready Made",
    description:
      "Browse our curated collection of premium ready-to-ship pieces. Multiple sizes, instant availability.",
    features: [
      "Ships immediately",
      "Multiple sizes",
      "Premium quality",
      "Easy exchange",
    ],
    cta: "Browse Shop",
    link: "/shop",
    featured: true,
    badge: "Most Popular",
  },
  {
    id: 3,
    icon: "✂️",
    title: "Alterations",
    description:
      "Have a garment that needs adjusting? We alter, fix and perfect any piece to fit you flawlessly.",
    features: [
      "Any garment type",
      "Perfect fit guaranteed",
      "Fast turnaround",
      "Global shipping",
    ],
    cta: "Chat Tailor",
    link: null,
    whatsapp: true,
  },
];

const ServiceCard = ({ service, index, tokens }) => {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const ctaRef = useRef(null);
  const {
    accent,
    accentDeep,
    accentBg10,
    accentBg15,
    cardBg,
    cardBorder,
    featuredBg,
    featuredBorder,
    textPrimary,
    textSub,
    shineColor,
    btnText,
  } = tokens;

  const isFeatured = service.featured;

  // ── 3D TILT ──────────────────────────────────────────────
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -7;
    const rotateY = ((x - rect.width / 2) / rect.width) * 7;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: isFeatured ? 1.03 : 1.02,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });

    const shine = card.querySelector(".card-shine");
    if (shine) {
      const sx = (x / rect.width) * 100;
      const sy = (y / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${sx}% ${sy}%, ${shineColor} 0%, transparent 60%)`;
    }
  };

  const handleMouseEnter = () => {
    gsap.to(iconRef.current, {
      rotate: 12,
      scale: 1.1,
      duration: 0.4,
      ease: "back.out(2)",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: isFeatured ? 1.02 : 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.6)",
      transformPerspective: 1000,
    });
    gsap.to(iconRef.current, {
      rotate: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
    const shine = cardRef.current.querySelector(".card-shine");
    if (shine) shine.style.background = "transparent";
  };

  // ── MAGNETIC CTA ───────────────────────────────────────────
  const handleCtaMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    gsap.to(btn, {
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.25,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const handleCtaLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  };

  const CtaButton = () => (
    <a
      ref={ctaRef}
      href={
        service.whatsapp
          ? `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`
          : undefined
      }
      target={service.whatsapp ? "_blank" : undefined}
      rel={service.whatsapp ? "noopener noreferrer" : undefined}
      onMouseMove={handleCtaMove}
      onMouseLeave={handleCtaLeave}
      className="group/cta relative inline-flex items-center justify-center
                 gap-2 w-full py-3.5 rounded-xl text-sm font-bold
                 overflow-hidden transition-all duration-300 active:scale-95"
      style={{
        background: isFeatured ? accent : "transparent",
        border: isFeatured ? "none" : `1.5px solid ${accent}`,
        color: isFeatured ? btnText : accent,
      }}
    >
      {isFeatured && (
        <span
          className="absolute inset-0 opacity-0 group-hover/cta:opacity-100
                     transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.35) 50%,transparent 60%)",
          }}
        />
      )}
      <span className="relative z-10">{service.cta}</span>
      <span className="relative z-10 group-hover/cta:translate-x-1 transition-transform duration-300">
        →
      </span>
    </a>
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="service-card relative rounded-3xl p-8 cursor-default flex flex-col"
      style={{
        background: isFeatured ? featuredBg : cardBg,
        border: `1.5px solid ${isFeatured ? featuredBorder : cardBorder}`,
        transformStyle: "preserve-3d",
        transform: isFeatured ? "scale(1.02)" : "scale(1)",
        boxShadow: isFeatured ? `0 20px 60px -15px ${accent}30` : "none",
        transition:
          "background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
      }}
    >
      {/* Shine overlay */}
      <div className="card-shine absolute inset-0 rounded-3xl pointer-events-none transition-all duration-300" />

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-4 h-4 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-[1.5px]"
          style={{ background: accent, opacity: 0.3 }}
        />
        <div
          className="absolute top-0 left-0 h-full w-[1.5px]"
          style={{ background: accent, opacity: 0.3 }}
        />
      </div>
      <div className="absolute bottom-4 right-4 w-4 h-4 pointer-events-none">
        <div
          className="absolute bottom-0 right-0 w-full h-[1.5px]"
          style={{ background: accent, opacity: 0.3 }}
        />
        <div
          className="absolute bottom-0 right-0 h-full w-[1.5px]"
          style={{ background: accent, opacity: 0.3 }}
        />
      </div>

      {/* Featured badge ribbon */}
      {isFeatured && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1
                     rounded-full text-[10px] font-bold tracking-widest uppercase
                     whitespace-nowrap"
          style={{ background: accent, color: btnText }}
        >
          ⭐ {service.badge}
        </div>
      )}

      {/* Watermark number */}
      <div
        className="absolute top-6 right-6 text-6xl font-bold font-display
                   select-none pointer-events-none leading-none"
        style={{ color: accent, opacity: 0.06 }}
      >
        0{index + 1}
      </div>

      {/* Icon */}
      <div
        ref={iconRef}
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
        style={{
          background: isFeatured ? accentBg15 : accentBg10,
          border: isFeatured ? `1px solid ${accent}40` : "none",
          transition: "background 0.5s ease, border-color 0.5s ease",
        }}
      >
        {service.icon}
      </div>

      {/* Title */}
      <h3
        className="text-xl font-bold font-display mb-3"
        style={{ color: textPrimary, transition: "color 0.5s ease" }}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed mb-6"
        style={{ color: textSub, transition: "color 0.5s ease" }}
      >
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-2.5 mb-8 flex-1">
        {service.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm">
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold"
              style={{
                background: accentBg15,
                color: accent,
                transition: "background 0.5s ease, color 0.5s ease",
              }}
            >
              ✓
            </span>
            <span style={{ color: textSub, transition: "color 0.5s ease" }}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {service.whatsapp || service.link === "/shop" ? (
        <CtaButton />
      ) : (
        <Link to={service.link}>
          <div
            onMouseMove={handleCtaMove}
            onMouseLeave={handleCtaLeave}
            className="group/cta relative inline-flex items-center justify-center
                       gap-2 w-full py-3.5 rounded-xl text-sm font-bold
                       overflow-hidden transition-all duration-300 active:scale-95"
            style={{
              background: isFeatured ? accent : "transparent",
              border: isFeatured ? "none" : `1.5px solid ${accent}`,
              color: isFeatured ? btnText : accent,
            }}
          >
            <span className="relative z-10">{service.cta}</span>
            <span className="relative z-10 group-hover/cta:translate-x-1 transition-transform duration-300">
              →
            </span>
          </div>
        </Link>
      )}
    </div>
  );
};

const Services = () => {
  const sectionRef = useRef(null);
  const { isDark } = useTheme();

  // ── THEME TOKENS ──────────────────────────────────────────
  const accent = isDark ? "#b8f7e4" : "#6b1d2e";
  const accentDeep = isDark ? "#7ee8c8" : "#4e1220";
  const accentBg10 = isDark ? "rgba(184,247,228,0.10)" : "rgba(107,29,46,0.10)";
  const accentBg15 = isDark ? "rgba(184,247,228,0.15)" : "rgba(107,29,46,0.15)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.80)";
  const cardBorder = isDark ? "rgba(184,247,228,0.10)" : "rgba(107,29,46,0.12)";
  const featuredBg = isDark ? "rgba(184,247,228,0.05)" : "rgba(107,29,46,0.04)";
  const featuredBorder = accent;
  const sectionBg = isDark ? "#25272c" : "#fffdf7";
  const textPrimary = isDark ? "#ffffff" : "#1a0a0e";
  const textSub = isDark ? "rgba(255,255,255,0.50)" : "rgba(26,10,14,0.55)";
  const textMuted = isDark ? "rgba(255,255,255,0.35)" : "rgba(26,10,14,0.35)";
  const dividerTop = isDark ? "rgba(184,247,228,0.30)" : "rgba(107,29,46,0.20)";
  const shineColor = isDark ? "rgba(184,247,228,0.08)" : "rgba(107,29,46,0.06)";
  const btnText = isDark ? "#25272c" : "#fffdf7";
  const labelLineL = isDark
    ? "linear-gradient(90deg, transparent, #b8f7e4)"
    : "linear-gradient(90deg, transparent, #6b1d2e)";
  const labelLineR = isDark
    ? "linear-gradient(90deg, #b8f7e4, transparent)"
    : "linear-gradient(90deg, #6b1d2e, transparent)";

  const tokens = {
    accent,
    accentDeep,
    accentBg10,
    accentBg15,
    cardBg,
    cardBorder,
    featuredBg,
    featuredBorder,
    textPrimary,
    textSub,
    shineColor,
    btnText,
  };

  // ── SCROLL ANIMATIONS ─────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".services-title", start: "top 85%" },
        },
      );

      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".service-card", start: "top 85%" },
          onComplete: () => {
            // restore featured card's resting scale after entrance
            gsap.set(".service-card", { clearProps: "scale" });
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: sectionBg, transition: "background 0.5s ease" }}
    >
      {/* Top divider line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24"
        style={{
          background: `linear-gradient(to bottom, transparent, ${dividerTop}, transparent)`,
          transition: "background 0.5s ease",
        }}
      />

      {/* Ambient glow behind featured card */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px]
                   rounded-full blur-[100px] opacity-[0.08] pointer-events-none"
        style={{ background: accent, transition: "background 0.5s ease" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Section Header ─────────────────────────────── */}
        <div className="services-title text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8" style={{ background: labelLineL }} />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase flex items-center gap-2"
              style={{ color: accent, transition: "color 0.5s ease" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: accent }}
              />
              What We Offer
            </span>
            <div className="h-px w-8" style={{ background: labelLineR }} />
          </div>

          <h2
            className="font-display text-4xl md:text-5xl font-bold mb-4"
            style={{ color: textPrimary, transition: "color 0.5s ease" }}
          >
            Our <GradientText isDark={isDark}>Services</GradientText>
          </h2>

          <p
            className="max-w-md mx-auto text-base"
            style={{ color: textMuted, transition: "color 0.5s ease" }}
          >
            From custom to ready-made, we cover everything you need to look your
            absolute best.
          </p>
        </div>

        {/* ── Cards Grid ─────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 items-stretch"
          style={{ perspective: "1200px" }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              tokens={tokens}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
