// components/ui/Loader.jsx
import { useTheme } from "../../context/ThemeContext";

const Loader = ({ fullScreen = false }) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 
                 ${fullScreen ? "min-h-screen" : "py-24"}`}
    >
      {/* Spinner */}
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 animate-spin"
          style={{
            borderColor: "transparent",
            borderTopColor: "var(--accent)",
          }}
        />
        {/* Inner ring — spins opposite */}
        <div
          className="absolute inset-2 rounded-full border-2 animate-spin"
          style={{
            borderColor: "transparent",
            borderBottomColor: "var(--accent)",
            animationDirection: "reverse",
            animationDuration: "0.6s",
          }}
        />
        {/* Center dot */}
        <div className="absolute inset-[18px] rounded-full bg-accent animate-pulse" />
      </div>

      {/* Label */}
      <p className="text-xs tracking-[0.2em] uppercase text-text-muted animate-pulse">
        Loading
      </p>
    </div>
  );
};

export default Loader;
