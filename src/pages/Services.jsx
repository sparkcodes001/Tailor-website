import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES, FAQ } from "../data/services";
import { createWhatsAppLink } from "../utils/whatsapp";
import SectionTitle from "../components/ui/SectionTitle";

gsap.registerPlugin(ScrollTrigger);

const FAQItem = ({ q, a, isOpen, onClick }) => (
  <div className="border-b" style={{ borderColor: "var(--border)" }}>
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-4 py-5 text-left"
    >
      <span className="font-semibold text-text-primary text-sm md:text-base">
        {q}
      </span>
      <span
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                   text-sm transition-transform duration-300 border"
        style={{
          borderColor: "var(--border)",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          color: "var(--accent)",
        }}
      >
        +
      </span>
    </button>
    <div
      className="overflow-hidden transition-all duration-300"
      style={{ maxHeight: isOpen ? "300px" : "0px" }}
    >
      <p className="text-sm text-text-secondary leading-relaxed pb-5 pr-10">
        {a}
      </p>
    </div>
  </div>
);

const ServicesPage = () => {
  const pageRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    document.title = "Services | Grandeur Tailor";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".svc-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      );
      gsap.utils.toArray(".svc-block").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
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
      {/* Header */}
      <section className="px-6 pt-28 pb-16">
        <div className="svc-header max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div
              className="h-px w-8"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--accent))",
              }}
            />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
              What We Do
            </span>
            <div
              className="h-px w-8"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent), transparent)",
              }}
            />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Every Stitch, <span className="text-accent">Considered</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            From fully custom pieces to quick alterations, every service we
            offer is built around one goal — making you look and feel your
            absolute best.
          </p>
        </div>
      </section>

      {/* Service blocks */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-8">
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              className="svc-block rounded-3xl border p-8 md:p-10 theme-transition"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10">
                <div className="flex md:flex-col items-center md:items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{
                      background:
                        "color-mix(in srgb, var(--accent) 10%, transparent)",
                    }}
                  >
                    {service.icon}
                  </div>
                  <span className="font-display text-5xl font-bold opacity-10 md:hidden">
                    0{i + 1}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                    {service.tagline}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3">
                    {service.title}
                  </h2>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                    {service.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-text-secondary"
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-4">
                    {service.cta.whatsapp ? (
                      <a
                        href={createWhatsAppLink({
                          message: `Hi! I'd like to ask about your *${service.title}* service.`,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl
                                   font-bold text-sm bg-accent text-bg-primary
                                   hover:opacity-90 transition-all duration-300"
                      >
                        {service.cta.label} <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <Link
                        to={service.cta.to}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl
                                   font-bold text-sm bg-accent text-bg-primary
                                   hover:opacity-90 transition-all duration-300"
                      >
                        {service.cta.label} <span aria-hidden="true">→</span>
                      </Link>
                    )}
                    <span className="text-xs text-text-muted">
                      ⏱ Typical timeframe: {service.timeframe}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <SectionTitle
            eyebrow="Questions"
            title="Frequently Asked"
            highlight="Questions"
          />
          <div className="mt-10">
            {FAQ.map((item, i) => (
              <FAQItem
                key={item.q}
                q={item.q}
                a={item.a}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
