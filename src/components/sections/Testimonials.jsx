import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    color: "#b8f7e4",
  },
  {
    id: 2,
    name: "Marcus Williams",
    location: "New York, USA 🇺🇸",
    review:
      "Best tailoring experience I've ever had — and I've used tailors in three countries. The quality of fabric and stitching is world class. My senator outfit was delivered in perfect condition.",
    rating: 5,
    initials: "MW",
    color: "#7ee8c8",
  },
  {
    id: 3,
    name: "Amara Osei",
    location: "Toronto, Canada 🇨🇦",
    review:
      "Grandeur Tailors made my wedding outfit and it was absolutely breathtaking. Every measurement was exact, every stitch was perfect. The tailor communicated through every step.",
    rating: 5,
    initials: "AO",
    color: "#b8f7e4",
  },
  {
    id: 4,
    name: "Khalid Al-Rashid",
    location: "Dubai, UAE 🇦🇪",
    review:
      "Ordered a custom agbada for Eid and I received so many compliments. The quality rivals anything I've seen locally. Shipping was faster than expected too!",
    rating: 5,
    initials: "KA",
    color: "#7ee8c8",
  },
  {
    id: 5,
    name: "James Okafor",
    location: "Lagos, Nigeria 🇳🇬",
    review:
      "I've been a customer for 2 years now. Every single piece has been perfect. The attention to detail and craftsmanship is unmatched. Grandeur by name, Grandeur by nature!",
    rating: 5,
    initials: "JO",
    color: "#b8f7e4",
  },
  {
    id: 6,
    name: "Priya Sharma",
    location: "Melbourne, Australia 🇦🇺",
    review:
      "Found Grandeur Tailors through a friend and I'm so glad I did. My custom dress was made exactly to my description. The WhatsApp communication made everything so easy.",
    rating: 5,
    initials: "PS",
    color: "#7ee8c8",
  },
];

const infiniteTestimonials = [
  ...testimonials,
  ...testimonials,
  ...testimonials,
];

// ── STAR RATING ───────────────────────────────────────────────
const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className="text-sm"
        style={{
          color: star <= rating ? "#b8f7e4" : "rgba(255,255,255,0.15)",
        }}
      >
        ★
      </span>
    ))}
  </div>
);

// ── SHARED CARD UI (used in both desktop + mobile) ────────────
const CardContent = ({ item }) => (
  <>
    {/* Quote */}
    <div
      className="text-6xl font-display leading-none mb-2 select-none"
      style={{ color: "rgba(184,247,228,0.12)" }}
    >
      "
    </div>

    {/* Review */}
    <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6">
      {item.review}
    </p>

    {/* Stars */}
    <StarRating rating={item.rating} />

    {/* Author */}
    <div className="flex items-center gap-3 mt-4">
      <div
        className="w-10 h-10 rounded-full flex items-center
                   justify-center text-sm font-bold flex-shrink-0"
        style={{
          background: `${item.color}20`,
          border: `1px solid ${item.color}40`,
          color: item.color,
        }}
      >
        {item.initials}
      </div>
      <div>
        <p className="text-white text-sm font-semibold">{item.name}</p>
        <p className="text-white/40 text-xs">{item.location}</p>
      </div>
    </div>
  </>
);

// ── DESKTOP INFINITE CARD ─────────────────────────────────────
const InfiniteCard = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-shrink-0 rounded-3xl p-6 flex flex-col
                 transition-all duration-500 cursor-default"
      style={{
        width: "360px",
        minHeight: "280px",
        background: hovered
          ? "rgba(184,247,228,0.07)"
          : "rgba(255,255,255,0.02)",
        border: hovered
          ? "1px solid rgba(184,247,228,0.25)"
          : "1px solid rgba(255,255,255,0.06)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 60px rgba(184,247,228,0.1)" : "none",
      }}
    >
      <CardContent item={item} />
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────
const Testimonials = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const animRef = useRef(null);

  // Mobile carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = testimonials.length;

  // ── DESKTOP INFINITE SCROLL ───────────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cardWidth = 360 + 24; // card + gap
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
          scrollTrigger: {
            trigger: ".testimonials-title",
            start: "top 85%",
          },
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
          scrollTrigger: {
            trigger: ".marquee-wrapper",
            start: "top 90%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{ background: "#1a1c20" }}
    >
      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2
                   w-[600px] h-[400px] opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(184,247,228,0.5) 0%, transparent 70%)",
        }}
      />

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="testimonials-title text-center mb-14 px-6">
        <div className="inline-flex items-center gap-2 mb-4">
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(90deg, transparent, #b8f7e4)",
            }}
          />
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "#b8f7e4" }}
          >
            Customer Stories
          </span>
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(90deg, #b8f7e4, transparent)",
            }}
          />
        </div>

        <h2
          className="font-display text-3xl md:text-5xl font-bold
                     text-white mb-4"
        >
          What They{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #b8f7e4, #7ee8c8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Say
          </span>
        </h2>

        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} style={{ color: "#b8f7e4" }} className="text-lg">
                ★
              </span>
            ))}
          </div>
          <span className="text-white font-bold text-lg">5.0</span>
          <span className="text-white/30 text-sm">· 500+ happy customers</span>
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
          className="absolute left-0 top-0 bottom-0 w-40 z-10
                     pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #1a1c20 0%, transparent 100%)",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-40 z-10
                     pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, #1a1c20 0%, transparent 100%)",
          }}
        />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 py-4"
            style={{ width: "max-content" }}
          >
            {infiniteTestimonials.map((item, index) => (
              <InfiniteCard key={`${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>

        <p
          className="text-center mt-6 text-xs tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          Hover to pause
        </p>
      </div>

      {/* ── MOBILE: CLEAN CAROUSEL ─────────────────────────── */}
      <div className="md:hidden px-4">
        {/* 
          The trick for mobile carousel:
          - outer div clips overflow
          - inner div is a flex row of cards
          - each card is EXACTLY 100vw minus padding
          - GSAP moves the inner div by card width * index
        */}
        <div className="overflow-hidden mb-6" style={{ borderRadius: "24px" }}>
          {/* 
            We use CSS transform via inline style updated 
            directly - no GSAP ref needed, cleaner on mobile
          */}
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              // Each child will be 100% of the overflow container
            }}
          >
            {testimonials.map((item) => (
              <div
                key={item.id}
                // flex-shrink-0 + w-full = each card takes
                // exactly the width of the container
                className="flex-shrink-0 w-full"
              >
                <div
                  className="rounded-3xl p-6 flex flex-col mx-1"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    minHeight: "280px",
                  }}
                >
                  <CardContent item={item} />
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
                background:
                  currentSlide === i ? "#b8f7e4" : "rgba(184,247,228,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
