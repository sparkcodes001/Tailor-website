import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const AdminLogin = () => {
  const { signIn } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 10 + 12,
        delay: Math.random() * 10,
      })),
    [],
  );

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    setMouse({
      x: (e.clientX / innerWidth - 0.5) * 2,
      y: (e.clientY / innerHeight - 0.5) * 2,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    navigate("/admin");
  };

  const blobA = isDark ? "rgba(184,247,228,0.35)" : "rgba(107,29,46,0.25)";
  const blobB = isDark ? "rgba(126,232,200,0.25)" : "rgba(78,18,32,0.20)";
  const blobC = isDark ? "rgba(255,255,255,0.06)" : "rgba(107,29,46,0.12)";

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden theme-transition"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Parallax blobs */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{
          transform: `translate(${mouse.x * 20}px, ${mouse.y * 20}px)`,
          transition: "transform 0.6s ease-out",
        }}
      >
        <div
          className="w-full h-full rounded-full admin-blob-1"
          style={{ background: blobA }}
        />
      </div>
      <div
        className="absolute -bottom-40 -right-24 w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none"
        style={{
          transform: `translate(${mouse.x * -25}px, ${mouse.y * -25}px)`,
          transition: "transform 0.6s ease-out",
        }}
      >
        <div
          className="w-full h-full rounded-full admin-blob-2"
          style={{ background: blobB }}
        />
      </div>
      <div
        className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none"
        style={{
          transform: `translate(${mouse.x * 15}px, ${mouse.y * 15}px)`,
          transition: "transform 0.6s ease-out",
        }}
      >
        <div
          className="w-full h-full rounded-full admin-blob-3"
          style={{ background: blobC }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full admin-particle"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: isDark
                ? "rgba(184,247,228,0.5)"
                : "rgba(107,29,46,0.4)",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl p-8 border theme-transition admin-login-card"
        style={{
          background: "color-mix(in srgb, var(--bg-card) 80%, transparent)",
          borderColor: "var(--border)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 admin-logo-float"
            style={{
              background: "color-mix(in srgb, var(--accent) 10%, transparent)",
            }}
          >
            ✂️
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Admin Login
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Grandeur Tailor Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-2xl text-sm border outline-none
                         bg-bg-primary text-text-primary placeholder:text-text-muted
                         focus:border-accent transition-colors duration-300"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-2xl text-sm border outline-none
                           bg-bg-primary text-text-primary placeholder:text-text-muted
                           focus:border-accent transition-colors duration-300"
                style={{ borderColor: "var(--border)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors text-sm"
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center bg-red-400/10 px-4 py-3 rounded-2xl animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-sm bg-accent
                       text-bg-primary hover:opacity-90 transition-all duration-300
                       hover:scale-[1.02] active:scale-95 disabled:opacity-50
                       disabled:cursor-not-allowed disabled:scale-100 mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes admin-blob-move-1 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(30px,-40px) scale(1.1);} 66%{transform:translate(-20px,20px) scale(0.95);} }
        @keyframes admin-blob-move-2 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(-40px,30px) scale(1.15);} 66%{transform:translate(25px,-25px) scale(0.9);} }
        @keyframes admin-blob-move-3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(20px,35px) scale(1.1);} }
        .admin-blob-1 { animation: admin-blob-move-1 14s ease-in-out infinite; }
        .admin-blob-2 { animation: admin-blob-move-2 18s ease-in-out infinite; }
        .admin-blob-3 { animation: admin-blob-move-3 10s ease-in-out infinite; }

        @keyframes admin-particle-float {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; } 90% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(20px); opacity: 0; }
        }
        .admin-particle { bottom: 0; animation-name: admin-particle-float; animation-timing-function: linear; animation-iteration-count: infinite; }

        @keyframes admin-logo-float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
        .admin-logo-float { animation: admin-logo-float 3s ease-in-out infinite; }

        @keyframes admin-card-in { from{opacity:0; transform:translateY(20px) scale(0.98);} to{opacity:1; transform:translateY(0) scale(1);} }
        .admin-login-card { animation: admin-card-in 0.6s ease-out both; }

        @keyframes admin-shake { 10%,90%{transform:translateX(-1px);} 20%,80%{transform:translateX(2px);} 30%,50%,70%{transform:translateX(-4px);} 40%,60%{transform:translateX(4px);} }
        .animate-shake { animation: admin-shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
