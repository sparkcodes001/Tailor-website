import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

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
    accent: "#b8f7e4",
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
    accent: "#b8f7e4",
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
    accent: "#b8f7e4",
    whatsapp: true,
  },
];

const ServiceCard = ({ service, index }) => {
  const cardRef = useRef(null);

  // 3D tilt on mouse move
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });

    // Move shine
    const shine = card.querySelector(".card-shine");
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(184,247,228,0.08) 0%, transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.6)",
      transformPerspective: 1000,
    });
    const shine = cardRef.current.querySelector(".card-shine");
    if (shine) shine.style.background = "transparent";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="service-card relative rounded-3xl p-8 cursor-default
                 transition-shadow duration-300 hover:shadow-2xl
                 hover:shadow-[#b8f7e4]/10"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(184,247,228,0.1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Shine overlay */}
      <div
        className="card-shine absolute inset-0 rounded-3xl 
                      transition-all duration-300 pointer-events-none"
      />

      {/* Number */}
      <div
        className="absolute top-6 right-6 text-6xl font-bold 
                   font-display opacity-5 select-none"
        style={{ color: "#b8f7e4" }}
      >
        0{index + 1}
      </div>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center 
                   text-2xl mb-6"
        style={{ background: "rgba(184,247,228,0.1)" }}
      >
        {service.icon}
      </div>

      {/* Title */}
      <h3 className="text-white text-xl font-bold font-display mb-3">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-white/50 text-sm leading-relaxed mb-6">
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-2 mb-8">
        {service.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "#b8f7e4" }}
            />
            <span className="text-white/60">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {service.whatsapp ? (
        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold
                     group"
          style={{ color: "#b8f7e4" }}
        >
          <span>{service.cta}</span>
          <span
            className="group-hover:translate-x-1 transition-transform 
                       duration-300"
          >
            →
          </span>
        </a>
      ) : (
        <Link
          to={service.link}
          className="inline-flex items-center gap-2 text-sm font-semibold
                     group"
          style={{ color: "#b8f7e4" }}
        >
          <span>{service.cta}</span>
          <span
            className="group-hover:translate-x-1 transition-transform 
                       duration-300"
          >
            →
          </span>
        </Link>
      )}

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-8 right-8 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(184,247,228,0.3), transparent)",
        }}
      />
    </div>
  );
};

const Services = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      gsap.fromTo(
        ".services-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-title",
            start: "top 85%",
          },
        },
      );

      // Cards stagger
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
          scrollTrigger: {
            trigger: ".service-card",
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
      className="relative py-24 px-6 bg-[#25272c] overflow-hidden"
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(184,247,228,0.3), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="services-title text-center mb-16">
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
              What We Offer
            </span>
            <div
              className="h-px w-8"
              style={{
                background: "linear-gradient(90deg, #b8f7e4, transparent)",
              }}
            />
          </div>

          <h2
            className="font-display text-4xl md:text-5xl font-bold 
                       text-white mb-4"
          >
            Our{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #b8f7e4, #7ee8c8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Services
            </span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto text-base">
            From custom to ready-made, we cover everything you need to look your
            absolute best.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
