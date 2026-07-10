import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../context/ThemeContext";
import GradientText from "../ui/GradientText";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "London, UK 🇬🇧",
    review:
      "I was skeptical about ordering custom clothing online but Grandeur Tailors completely changed my mind. The agbada arrived perfectly fitted and the embroidery detail was stunning. Will order again!",
    rating: 5,
    initials: "SJ",
  },
  {
    id: 2,
    name: "Marcus Williams",
    location: "New York, USA 🇺🇸",
    review:
      "Best tailoring experience I've ever had — and I've used tailors in three countries. The quality of fabric and stitching is world class. My senator outfit was delivered in perfect condition.",
    rating: 5,
    initials: "MW",
  },
  {
    id: 3,
    name: "Amara Osei",
    location: "Toronto, Canada 🇨🇦",
    review:
      "Grandeur Tailors made my wedding outfit and it was absolutely breathtaking. Every measurement was exact, every stitch was perfect. The tailor communicated through every step.",
    rating: 5,
    initials: "AO",
  },
  {
    id: 4,
    name: "Khalid Al-Rashid",
    location: "Dubai, UAE 🇦🇪",
    review:
      "Ordered a custom agbada for Eid and I received so many compliments. The quality rivals anything I've seen locally. Shipping was faster than expected too!",
    rating: 5,
    initials: "KA",
  },
  {
    id: 5,
    name: "James Okafor",
    location: "Lagos, Nigeria 🇳🇬",
    review:
      "I've been a customer for 2 years now. Every single piece has been perfect. The attention to detail and craftsmanship is unmatched. Grandeur by name, Grandeur by nature!",
    rating: 5,
    initials: "JO",
  },
  {
    id: 6,
    name: "Priya Sharma",
    location: "Melbourne, Australia 🇦🇺",
    review:
      "Found Grandeur Tailors through a friend and I'm so glad I did. My custom dress was made exactly to my description. The WhatsApp communication made everything so easy.",
    rating: 5,
    initials: "PS",
  },
];

const infiniteTestimonials = [
  ...testimonials,
  ...testimonials,
  ...testimonials,
];

// ── STAR RATING ───────────────────────────────────────────────
const StarRating = ({ rating, accent, dimColor }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className="text-sm"
        style={{
          color: star <= rating ? accent : dimColor,
          transition: "color 0.5s ease",
        }}
      >
        ★
      </span>
    ))}
  </div>
);

// ── SHARED CARD UI ─────────────────────────────────────────────
const CardContent = ({ item, tokens }) => {
  const { accent, quoteColor, textPrimary, textSub, textFaint, dimColor } =
    tokens;
  return (
    <>
      {/* Quote */}
      <div
        className="text-6xl font-display leading-none mb-2 select-none"
        style={{ color: quoteColor, transition: "color 0.5s ease" }}
      >
        "
      </div>

      {/* Review */}
      <p
        className="text-sm leading-relaxed flex-1 mb-6"
        style={{ color: textSub, transition: "color 0.5s ease" }}
      >
        {item.review}
      </p>

      {/* Stars */}
      <StarRating rating={item.rating} accent={accent} dimColor={dimColor} />

      {/* Author */}
      <div className="flex items-center gap-3 mt-4">
        <div
          className="w-10 h-10 rounded-full flex items-center
                     justify-center text-sm font-bold flex-shrink-0"
          style={{
            background: `${accent}20`,
            border: `1px solid ${accent}40`,
            color: accent,
            transition: "all 0.5s ease",
          }}
        >
          {item.initials}
        </div>
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: textPrimary, transition: "color 0.5s ease" }}
          >
            {item.name}
          </p>
          <p
            className="text-xs"
            style={{ color: textFaint, transition: "color 0.5s ease" }}
          >
            {item.location}
          </p>
        </div>
      </div>
    </>
  );
};

// ── DESKTOP INFINITE CARD ─────────────────────────────────────
const InfiniteCard = ({ item, tokens }) => {
  const [hovered, setHovered] = useState(false);
  const { cardBgHover, cardBg, cardBorderHover, cardBorder, glowShadow } =
    tokens;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-shrink-0 rounded-3xl p-6 flex flex-col
                 transition-all duration-500 cursor-default"
      style={{
        width: "360px",
        minHeight: "280px",
        background: hovered ? cardBgHover : cardBg,
        border: hovered
          ? `1px solid ${cardBorderHover}`
          : `1px solid ${cardBorder}`,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? glowShadow : "none",
      }}
    >
      <CardContent item={item} tokens={tokens} />
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────
const Testimonials = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const { isDark } = useTheme();

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = testimonials.length;

  // ── THEME TOKENS ──────────────────────────────────────────
  const accent = isDark ? "#b8f7e4" : "#6b1d2e";
  const accentDeep = isDark ? "#7ee8c8" : "#4e1220";
  const sectionBg = isDark ? "#1a1c20" : "#fdf5f6";
  const textPrimary = isDark ? "#ffffff" : "#1a0a0e";
  const textSub = isDark ? "rgba(255,255,255,0.60)" : "rgba(26,10,14,0.60)";
  const textFaint = isDark ? "rgba(255,255,255,0.40)" : "rgba(26,10,14,0.40)";
  const textMuted = isDark ? "rgba(255,255,255,0.30)" : "rgba(26,10,14,0.35)";
  const quoteColor = isDark ? "rgba(184,247,228,0.12)" : "rgba(107,29,46,0.12)";
  const dimColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(26,10,14,0.15)";

  const cardBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.70)";
  const cardBgHover = isDark
    ? "rgba(184,247,228,0.07)"
    : "rgba(107,29,46,0.05)";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(107,29,46,0.08)";
  const cardBorderHover = isDark
    ? "rgba(184,247,228,0.25)"
    : "rgba(107,29,46,0.25)";
  const glowShadow = isDark
    ? "0 20px 60px rgba(184,247,228,0.10)"
    : "0 20px 60px rgba(107,29,46,0.10)";

  const labelLineL = isDark
    ? "linear-gradient(90deg, transparent, #b8f7e4)"
    : "linear-gradient(90deg, transparent, #6b1d2e)";
  const labelLineR = isDark
    ? "linear-gradient(90deg, #b8f7e4, transparent)"
    : "linear-gradient(90deg, #6b1d2e, transparent)";

  const fadeSide = isDark ? sectionBg : sectionBg;

  const tokens = {
    accent,
    accentDeep,
    quoteColor,
    textPrimary,
    textSub,
    textFaint,
    dimColor,
    cardBg,
    cardBgHover,
    cardBorder,
    cardBorderHover,
    glowShadow,
  };

  // ── DESKTOP INFINITE SCROLL ───────────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cardWidth = 360 + 24;
    const totalWidth = cardWidth * testimonials.length;

    gsap.set(track, { x: -totalWidth });

    animRef.current = gsap.to(track, {
      x: `-=${totalWidth}`,
      duration: testimonials.length * 5,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    return () => animRef.current?.kill();
  }, []);

  const pauseMarquee = () => animRef.current?.pause();
  const playMarquee = () => animRef.current?.play();

  // ── MOBILE AUTO SLIDE ─────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // ── SCROLL TRIGGER ENTRANCE ───────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonials-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".testimonials-title", start: "top 85%" },
        },
      );
      gsap.fromTo(
        ".marquee-wrapper",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".marquee-wrapper", start: "top 90%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{ background: sectionBg, transition: "background 0.5s ease" }}
    >
      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2
                   w-[600px] h-[400px] opacity-10 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse, rgba(184,247,228,0.5) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(107,29,46,0.3) 0%, transparent 70%)",
          transition: "background 0.5s ease",
        }}
      />

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="testimonials-title text-center mb-14 px-6">
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
            Customer Stories
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
          What They <GradientText isDark={isDark}>Say</GradientText>
        </h2>

        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className="text-lg"
                style={{ color: accent, transition: "color 0.5s ease" }}
              >
                ★
              </span>
            ))}
          </div>
          <span
            className="font-bold text-lg"
            style={{ color: textPrimary, transition: "color 0.5s ease" }}
          >
            5.0
          </span>
          <span
            className="text-sm"
            style={{ color: textMuted, transition: "color 0.5s ease" }}
          >
            · 500+ happy customers
          </span>
        </div>
      </div>

      {/* ── DESKTOP: INFINITE MARQUEE ──────────────────────── */}
      <div
        className="marquee-wrapper hidden md:block relative"
        onMouseEnter={pauseMarquee}
        onMouseLeave={playMarquee}
      >
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-40 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${fadeSide} 0%, transparent 100%)`,
            transition: "background 0.5s ease",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-40 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${fadeSide} 0%, transparent 100%)`,
            transition: "background 0.5s ease",
          }}
        />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 py-4"
            style={{ width: "max-content" }}
          >
            {infiniteTestimonials.map((item, index) => (
              <InfiniteCard
                key={`${item.id}-${index}`}
                item={item}
                tokens={tokens}
              />
            ))}
          </div>
        </div>

        <p
          className="text-center mt-6 text-xs tracking-widest uppercase"
          style={{ color: dimColor, transition: "color 0.5s ease" }}
        >
          Hover to pause
        </p>
      </div>

      {/* ── MOBILE: CLEAN CAROUSEL ─────────────────────────── */}
      <div className="md:hidden px-4">
        <div className="overflow-hidden mb-6" style={{ borderRadius: "24px" }}>
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-full">
                <div
                  className="rounded-3xl p-6 flex flex-col mx-1"
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    minHeight: "280px",
                    transition: "background 0.5s ease, border-color 0.5s ease",
                  }}
                >
                  <CardContent item={item} tokens={tokens} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: currentSlide === i ? "24px" : "8px",
                height: "8px",
                background: currentSlide === i ? accent : `${accent}33`,
                transition: "background 0.5s ease, width 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
