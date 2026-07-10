import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import CustomOrder from "./pages/CustomOrder";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminGallery from "./admin/pages/AdminGallery";
import AdminTestimonials from "./admin/pages/AdminTestimonials";
import ProtectedRoute from "./admin/components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              },
            }}
          />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:id" element={<ProductDetail />} />
              <Route path="/custom-order" element={<CustomOrder />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
