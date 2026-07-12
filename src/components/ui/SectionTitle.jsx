// src/components/ui/SectionTitle.jsx
const SectionTitle = ({ eyebrow, title, highlight, subtitle }) => {
  return (
    <div className="text-center">
      {/* Eyebrow */}
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-4">
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(90deg, transparent, var(--accent))",
            }}
          />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
            {eyebrow}
          </span>
          <div
            className="h-px w-8"
            style={{
              background: "linear-gradient(90deg, var(--accent), transparent)",
            }}
          />
        </div>
      )}

      {/* Title */}
      <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-text-primary">
        {title}{" "}
        {highlight && (
          <span
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {highlight}
          </span>
        )}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="max-w-md mx-auto text-sm md:text-base text-text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
