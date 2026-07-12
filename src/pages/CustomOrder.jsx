import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CustomOrderForm from "../components/forms/CustomOrderForm";

const PROCESS_STEPS = [
  {
    icon: "🛍️",
    title: "Tell Us What You Need",
    desc: "Share the garment, fabric, and budget in mind.",
  },
  {
    icon: "💬",
    title: "We Reach Out",
    desc: "Our tailor confirms details and measurements with you on WhatsApp.",
  },
  {
    icon: "✂️",
    title: "We Craft It",
    desc: "Handmade with premium fabric and precision stitching.",
  },
  {
    icon: "🌍",
    title: "Delivered To You",
    desc: "Shipped straight to your door, anywhere in the world.",
  },
];

const CustomOrder = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    document.title = "Custom Order | Grandeur Tailor";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".co-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={pageRef}
      className="px-6 py-28 bg-bg-primary theme-transition"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 co-fade">
          <div className="inline-flex items-center gap-2 mb-4">
            <div
              className="h-px w-8"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--accent))",
              }}
            />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
              Bespoke Service
            </span>
            <div
              className="h-px w-8"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent), transparent)",
              }}
            />
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Design Your <span className="text-accent">Perfect Fit</span>
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto">
            Tell us what you're dreaming of — our tailors will reach out
            personally to bring it to life, exactly to your measurements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Sidebar — process reminder */}
          <div className="lg:col-span-2 co-fade">
            <div className="lg:sticky lg:top-28 space-y-6">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.title} className="flex gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      background:
                        "color-mix(in srgb, var(--accent) 10%, transparent)",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-accent mb-0.5">
                      Step {i + 1}
                    </p>
                    <h3 className="font-semibold text-text-primary text-sm mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}

              <div
                className="mt-8 p-5 rounded-2xl border"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                }}
              >
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="text-accent font-semibold">
                    No pressure.{" "}
                  </span>
                  Submitting this form doesn't confirm an order — it just starts
                  the conversation so we can guide you personally.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 co-fade">
            <div
              className="rounded-3xl p-6 sm:p-10 border theme-transition"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <CustomOrderForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomOrder;
