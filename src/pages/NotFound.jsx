import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-bg-primary theme-transition">
      <p className="text-accent font-display text-8xl font-bold mb-4">404</p>
      <h1 className="text-2xl md:text-3xl font-bold font-display text-text-primary mb-3">
        Page Not Found
      </h1>
      <p className="text-text-secondary max-w-sm mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="px-8 py-4 rounded-2xl font-bold text-sm bg-accent text-bg-primary hover:opacity-90 transition-all duration-300 hover:scale-105"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default NotFound;
