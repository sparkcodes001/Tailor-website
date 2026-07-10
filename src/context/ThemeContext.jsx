import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  // Check saved preference or system preference
  const getInitialTheme = () => {
    const saved = localStorage.getItem("grandeur-theme");
    if (saved) return saved;
    // Auto dark at night (6pm - 6am)
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6 ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("grandeur-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isDark: theme === "dark" }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be inside ThemeProvider");
  return context;
};

export default ThemeContext;
