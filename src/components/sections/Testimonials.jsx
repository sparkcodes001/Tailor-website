import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../../context/ThemeContext";
import GradientText from "../ui/GradientText";

gsap.registerPlugin(ScrollTrigger);

// ── CONSTANTS ───────────────────────────────────────────────
const AUTO_SLIDE_MS = 5000;
const SWIPE_THRESHOLD = 50; // px
const SECONDS_PER_CARD = 5; // marquee speed

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
  <div
    className="flex gap-0.5"
    role="img"
    aria-label={`${rating} out of 5 stars`}
  >
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className="text-sm"
        aria-hidden="true"
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
        aria-hidden="true"
      >
        "
      </div>

      {/* Review */}
      <blockquote
        className="text-sm leading-relaxed flex-1 mb-6 not-italic"
        style={{ color: textSub, transition: "color 0.5s ease" }}
      >
        {item.review}
      </blockquote>

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
          aria-hidden="true"
        >
          {item.initials}
        </div>
        <div>
          <cite
            className="text-sm font-semibold not-italic block"
            style={{ color: textPrimary, transition: "color 0.5s ease" }}
          >
            {item.name}
          </cite>
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
const InfiniteCard = ({ item, tokens, isDuplicate }) => {
  const [hovered, setHovered] = useState(false);
  const { cardBgHover, cardBg, cardBorderHover, cardBorder, glowShadow } =
    tokens;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="testimonial-card flex-shrink-0 rounded-3xl p-6 flex flex-col
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
      aria-hidden={isDuplicate ? "true" : undefined}
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
  const autoSlideRef = useRef(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const { isDark } = useTheme();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const totalSlides = testimonials.length;

  // ── DETECT REDUCED MOTION PREFERENCE ─────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── THEME TOKENS ──────────────────────────────────────────
  const tokens = useMemo(() => {
    const accent = isDark ? "#b8f7e4" : "#6b1d2e";
    const accentDeep = isDark ? "#7ee8c8" : "#4e1220";
    const sectionBg = isDark ? "#1a1c20" : "#fdf5f6";
    const textPrimary = isDark ? "#ffffff" : "#1a0a0e";
    const textSub = isDark ? "rgba(255,255,255,0.60)" : "rgba(26,10,14,0.60)";
    const textFaint = isDark ? "rgba(255,255,255,0.40)" : "rgba(26,10,14,0.40)";
    const textMuted = isDark ? "rgba(255,255,255,0.30)" : "rgba(26,10,14,0.35)";
    const quoteColor = isDark
      ? "rgba(184,247,228,0.12)"
      : "rgba(107,29,46,0.12)";
    const dimColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(26,10,14,0.15)";

    const cardBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.70)";
    const cardBgHover = isDark
      ? "rgba(184,247,228,0.07)"
      : "rgba(107,29,46,0.05)";
    const cardBorder = isDark
      ? "rgba(255,255,255,0.06)"
      : "rgba(107,29,46,0.08)";
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

    return {
      accent,
      accentDeep,
      sectionBg,
      textPrimary,
      textSub,
      textFaint,
      textMuted,
      quoteColor,
      dimColor,
      cardBg,
      cardBgHover,
      cardBorder,
      cardBorderHover,
      glowShadow,
      labelLineL,
      labelLineR,
    };
  }, [isDark]);

  const {
    sectionBg,
    accent,
    textMuted,
    textPrimary,
    dimColor,
    labelLineL,
    labelLineR,
  } = tokens;

  // ── DESKTOP INFINITE SCROLL (dynamic width + reduced-motion aware) ──
  useEffect(() => {
    if (prefersReducedMotion) return;
    const track = trackRef.current;
    if (!track) return;

    let totalWidth = 0;

    const setupAnimation = () => {
      animRef.current?.kill();

      const children = Array.from(track.children).slice(0, testimonials.length);
      if (!children.length) return;

      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      totalWidth = children.reduce((sum, el) => sum + el.offsetWidth + gap, 0);

      gsap.set(track, { x: -totalWidth });

      animRef.current = gsap.to(track, {
        x: `-=${totalWidth}`,
        duration: testimonials.length * SECONDS_PER_CARD,
        ease: "none",
        repeat: -1,
        paused: isMarqueePaused,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });
    };

    setupAnimation();

    const resizeObserver = new ResizeObserver(() => setupAnimation());
    resizeObserver.observe(track);

    // Pause marquee when section leaves viewport (perf)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isMarqueePaused) {
          animRef.current?.play();
        } else {
          animRef.current?.pause();
        }
      },
      { threshold: 0 },
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    return () => {
      animRef.current?.kill();
      resizeObserver.disconnect();
      io.disconnect();
    };
  }, [prefersReducedMotion, isMarqueePaused]);

  const pauseMarquee = () => animRef.current?.pause();
  const playMarquee = () => {
    if (!isMarqueePaused) animRef.current?.play();
  };
  const toggleMarquee = () => {
    setIsMarqueePaused((prev) => {
      const next = !prev;
      if (next) animRef.current?.pause();
      else animRef.current?.play();
      return next;
    });
  };

  // ── MOBILE AUTO SLIDE (with reset-on-interaction) ─────────
  const resetAutoSlide = useCallback(() => {
    clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, AUTO_SLIDE_MS);
  }, [totalSlides]);

  useEffect(() => {
    resetAutoSlide();
    return () => clearInterval(autoSlideRef.current);
  }, [resetAutoSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetAutoSlide();
  };

  // ── TOUCH / SWIPE HANDLERS ─────────────────────────────────
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    clearInterval(autoSlideRef.current);
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      goToSlide((currentSlide + 1) % totalSlides);
    } else {
      resetAutoSlide();
    }
    touchDeltaX.current = 0;
  };

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
      aria-label="Customer testimonials"
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
        aria-hidden="true"
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
          <div
            className="flex gap-0.5"
            role="img"
            aria-label="5 out of 5 stars"
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className="text-lg"
                aria-hidden="true"
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
            background: `linear-gradient(to right, ${sectionBg} 0%, transparent 100%)`,
            transition: "background 0.5s ease",
          }}
          aria-hidden="true"
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-40 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${sectionBg} 0%, transparent 100%)`,
            transition: "background 0.5s ease",
          }}
          aria-hidden="true"
        />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 py-4"
            style={{
              width: "max-content",
              willChange: "transform",
              transform: prefersReducedMotion ? "none" : undefined,
            }}
          >
            {(prefersReducedMotion ? testimonials : infiniteTestimonials).map(
              (item, index) => (
                <InfiniteCard
                  key={`${item.id}-${index}`}
                  item={item}
                  tokens={tokens}
                  isDuplicate={index >= testimonials.length}
                />
              ),
            )}
          </div>
        </div>

        {!prefersReducedMotion && (
          <button
            type="button"
            onClick={toggleMarquee}
            aria-pressed={isMarqueePaused}
            className="mx-auto mt-6 flex items-center gap-2 text-xs tracking-widest
                       uppercase cursor-pointer bg-transparent border-none
                       hover:opacity-80 transition-opacity"
            style={{ color: dimColor }}
          >
            <span aria-hidden="true">{isMarqueePaused ? "▶" : "⏸"}</span>
            {isMarqueePaused
              ? "Paused — click to resume"
              : "Hover or click to pause"}
          </button>
        )}
      </div>

      {/* ── MOBILE: CLEAN CAROUSEL ─────────────────────────── */}
      <div className="md:hidden px-4">
        <div
          className="overflow-hidden mb-6"
          style={{ borderRadius: "24px" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-full"
                role="group"
                aria-roledescription="slide"
                aria-label={`Testimonial ${index + 1} of ${totalSlides}`}
                aria-hidden={currentSlide !== index}
              >
                <div
                  className="rounded-3xl p-6 flex flex-col mx-1"
                  style={{
                    background: tokens.cardBg,
                    border: `1px solid ${tokens.cardBorder}`,
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

        {/* Live region for screen readers */}
        <p className="sr-only" aria-live="polite">
          Showing testimonial {currentSlide + 1} of {totalSlides}
        </p>

        {/* Dots */}
        <div
          className="flex items-center justify-center gap-2 mt-4"
          role="tablist"
          aria-label="Select testimonial"
        >
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={currentSlide === i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => goToSlide(i)}
              className="transition-all duration-300 rounded-full cursor-pointer"
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
