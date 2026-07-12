import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import GradientText from "../ui/GradientText";
import { createGeneralLink } from "../../utils/whatsapp";import { steps } from "../../data/howItWorks";

gsap.registerPlugin(ScrollTrigger);

// translucent accent variant, theme-agnostic
const mix = (pct) => `color-mix(in srgb, var(--accent) ${pct}%, transparent)`;

const HowItWorks = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

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
        }
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
        }
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
        }
      );

      // only animate the connector line when it's actually visible (lg+)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          ".hiw-line",
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: { trigger: ".hiw-line", start: "top 85%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden bg-bg-primary theme-transition"
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--accent) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg-primary), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── HEADER ─────────────────────────────── */}
        <div className="hiw-title text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div
              className="h-px w-8"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--accent))",
              }}
            />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
              Simple Process
            </span>
            <div
              className="h-px w-8"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent), transparent)",
              }}
            />
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-text-primary">
            How It <GradientText>Works</GradientText>
          </h2>

          <p className="max-w-md mx-auto text-sm md:text-base text-text-muted">
            From your first message to your door — a seamless experience
            designed around you.
          </p>
        </div>

        {/* ── STEPS ──────────────────────────────── */}
        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-0 right-0 px-32 pointer-events-none">
            <div
              className="hiw-line h-px w-full"
              style={{
                background: `linear-gradient(90deg,transparent,${mix(30)},${mix(30)},transparent)`,
              }}
            />
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 list-none">
            {steps.map((item, index) => (
              <li
                key={item.step}
                className="hiw-step group flex flex-col items-center
                           md:items-start lg:items-center text-center
                           md:text-left lg:text-center"
              >
                <div className="relative mb-6">
                  <div
                    className="step-number w-20 h-20 rounded-full flex items-center
                               justify-center relative z-10 border theme-transition
                               transition-transform duration-300
                               group-hover:scale-105"
                    style={{ background: mix(6), borderColor: mix(20) }}
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {item.icon}
                    </span>
                  </div>

                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full
                               flex items-center justify-center z-20 bg-accent
                               theme-transition"
                  >
                    <span className="text-xs font-black text-bg-primary">
                      {index + 1}
                    </span>
                  </div>

                  <div
                    className="absolute inset-0 rounded-full opacity-20 blur-xl
                               bg-accent theme-transition"
                    aria-hidden="true"
                  />
                </div>

                <span
                  className="text-xs font-bold tracking-[0.3em] uppercase mb-2"
                  style={{ color: mix(40) }}
                >
                  Step {item.step}
                </span>

                <h3 className="font-display font-bold text-xl mb-3 text-text-primary">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed max-w-[220px] text-text-secondary">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── BOTTOM CTA ─────────────────────────── */}
        <div className="mt-16 md:mt-20 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/custom-order"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                       font-bold text-sm bg-accent text-bg-primary
                       hover:opacity-90 transition-all duration-300
                       hover:scale-105 active:scale-95 focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-accent
                       focus-visible:ring-offset-2"
          >
            Start Your Order <span aria-hidden="true">→</span>
          </Link>

          <a
            href={createGeneralLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                       font-semibold text-sm border text-text-primary
                       transition-all duration-300 active:scale-95
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-accent"
            style={{ background: mix(5), borderColor: mix(20) }}
          >
            <span
              className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              aria-hidden="true"
            />
            Ask A Question
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;