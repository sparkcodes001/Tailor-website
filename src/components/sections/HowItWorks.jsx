import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      gsap.fromTo(
        ".hiw-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hiw-title",
            start: "top 85%",
          },
        },
      );

      // Steps stagger in
      gsap.fromTo(
        ".hiw-step",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hiw-step",
            start: "top 85%",
          },
        },
      );

      // Connecting line draw
      gsap.fromTo(
        ".hiw-line",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".hiw-line",
            start: "top 85%",
          },
        },
      );

      // Step numbers count
      gsap.fromTo(
        ".step-number",
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: ".step-number",
            start: "top 85%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden bg-[#25272c]"
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(184,247,228,1) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #25272c, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="hiw-title text-center mb-16 md:mb-20">
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
              Simple Process
            </span>
            <div
              className="h-px w-8"
              style={{
                background: "linear-gradient(90deg, #b8f7e4, transparent)",
              }}
            />
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            How It{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #b8f7e4, #7ee8c8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Works
            </span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto text-sm md:text-base">
            From your first message to your door — a seamless experience
            designed around you.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - desktop only */}
          <div
            className="hidden lg:block absolute top-10 left-0 right-0 
                          px-32 pointer-events-none"
          >
            <div
              className="hiw-line h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(184,247,228,0.3), rgba(184,247,228,0.3), transparent)",
              }}
            />
          </div>

          {/* Steps Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 
                          gap-8 md:gap-6"
          >
            {steps.map((item, index) => (
              <div
                key={item.step}
                className="hiw-step flex flex-col items-center 
                           md:items-start lg:items-center text-center 
                           md:text-left lg:text-center"
              >
                {/* Step number circle */}
                <div className="relative mb-6">
                  <div
                    className="step-number w-20 h-20 rounded-full 
                               flex items-center justify-center relative z-10"
                    style={{
                      background: "rgba(184,247,228,0.06)",
                      border: "1px solid rgba(184,247,228,0.2)",
                    }}
                  >
                    {/* Icon */}
                    <span className="text-2xl">{item.icon}</span>
                  </div>

                  {/* Step badge */}
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full
                               flex items-center justify-center z-20"
                    style={{ background: "#b8f7e4" }}
                  >
                    <span className="text-[#25272c] text-xs font-black">
                      {index + 1}
                    </span>
                  </div>

                  {/* Glow behind circle */}
                  <div
                    className="absolute inset-0 rounded-full opacity-20 
                               blur-xl"
                    style={{ background: "#b8f7e4" }}
                  />
                </div>

                {/* Step number text */}
                <span
                  className="text-xs font-bold tracking-[0.3em] uppercase 
                             mb-2"
                  style={{ color: "rgba(184,247,228,0.4)" }}
                >
                  Step {item.step}
                </span>

                {/* Title */}
                <h3
                  className="text-white font-display font-bold text-xl 
                               mb-3"
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="text-white/45 text-sm leading-relaxed 
                              max-w-[220px]"
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-16 md:mt-20 flex flex-col sm:flex-row items-center 
                     justify-center gap-4"
        >
          <Link
            to="/custom-order"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                       font-bold text-sm text-[#25272c] hover:opacity-90
                       transition-all duration-300 hover:scale-105
                       active:scale-95"
            style={{ background: "#b8f7e4" }}
          >
            Start Your Order
            <span>→</span>
          </Link>

          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                       font-semibold text-sm text-white hover:bg-white/10
                       transition-all duration-300 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(184,247,228,0.2)",
            }}
          >
            <span
              className="w-2 h-2 bg-green-400 rounded-full 
                             animate-pulse"
            />
            Ask A Question
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
