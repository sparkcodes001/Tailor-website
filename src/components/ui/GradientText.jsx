// src/components/ui/GradientText.jsx
const GradientText = ({ children, isDark, className = "" }) => (
  <span
    key={isDark ? "dark" : "light"} // ← forces remount on switch
    className={className}
    style={{
      display: "inline-block",
      background: isDark
        ? "linear-gradient(135deg, #b8f7e4 0%, #7ee8c8 50%, #b8f7e4 100%)"
        : "linear-gradient(135deg, #6b1d2e 0%, #4e1220 50%, #6b1d2e 100%)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      // ← NEVER put transition: background here — causes the flash
    }}
  >
    {children}
  </span>
);

export default GradientText;
