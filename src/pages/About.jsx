import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Testimonials from "../components/sections/Testimonials";
import CTA from "../components/sections/CTA";
import founderImg from "../assets/founder.jpg"; // 👈 save your image here

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    icon: "🧵",
    title: "Craftsmanship First",
    desc: "Every seam, every stitch — done with decades of combined tailoring experience.",
  },
  {
    icon: "🤝",
    title: "Built On Trust",
    desc: "We treat every measurement, every request, and every fabric choice as personal — because it is.",
  },
  {
    icon: "🌍",
    title: "Made For Anywhere",
    desc: "From our workshop to your doorstep, wherever in the world that may be.",
  },
  {
    icon: "♻️",
    title: "Made To Last",
    desc: "We don't do fast fashion. Every piece is built to be worn for years, not seasons.",
  },
];

const STATS = [
  { value: "500+", label: "Happy Customers" },
  { value: "50+", label: "Countries Reached" },
  { value: "1,200+", label: "Garments Crafted" },
  { value: "5.0", label: "Average Rating" },
];

const About = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    document.title = "About | Grandeur Tailor";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ab-fade",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
      );
      gsap.utils.toArray(".ab-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-bg-primary theme-transition">
      {/* Hero intro */}
      <section className="px-6 pt-28 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="ab-fade inline-flex items-center gap-2 mb-4">
            <div
              className="h-px w-8"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--accent))",
              }}
            />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
              Our Story
            </span>
            <div
              className="h-px w-8"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent), transparent)",
              }}
            />
          </div>
          <h1 className="ab-fade font-display text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
            Tailoring Is Our <span className="text-accent">Craft</span>,
            <br className="hidden md:block" /> Not Just Our Job
          </h1>
          <p className="ab-fade text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            What started as a single tailor with a needle and a dream has grown
            into a name trusted by customers in over 50 countries — without ever
            losing the personal touch that started it all.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-6 pb-20">
        <div
          className="ab-reveal max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6
                     rounded-3xl border p-8 md:p-10 theme-transition"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-accent mb-1">
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-wider text-text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="ab-reveal grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                How It Started
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-4">
                From One Sewing Machine To A Global Workshop
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Every great tailor starts the same way — with patience, a keen
                eye, and the belief that clothes should be made for the person,
                not the other way around.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Today, that same philosophy powers every custom order we take
                on. Whether you're across town or across the world, you get the
                same care, the same craftsmanship, and the same commitment to
                getting it exactly right.
              </p>
            </div>

            {/* Founder / workshop photo */}
            <div
              className="ab-reveal aspect-[4/5] rounded-3xl overflow-hidden border relative group"
              style={{ borderColor: "var(--border)" }}
            >
              <img
                src={founderImg}
                alt="Grandeur Tailor founder"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 60%, color-mix(in srgb, var(--bg-primary) 40%, transparent))",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="ab-reveal text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-3">
              What We <span className="text-accent">Stand For</span>
            </h2>
            <p className="text-text-muted max-w-md mx-auto">
              The principles behind every piece we make.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="ab-reveal rounded-3xl border p-6 text-center theme-transition
                           hover:border-border-hover transition-colors duration-300"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{
                    background:
                      "color-mix(in srgb, var(--accent) 10%, transparent)",
                  }}
                >
                  {value.icon}
                </div>
                <h3 className="font-display font-bold text-text-primary mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reuse existing homepage sections for consistency */}
      <Testimonials />
      <CTA />
    </div>
  );
};

export default About;
