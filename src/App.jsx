import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Public Layout
import Layout from "./components/layout/Layout";

// Public Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import CustomOrder from "./pages/CustomOrder";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminGallery from "./admin/pages/AdminGallery";
import AdminTestimonials from "./admin/pages/AdminTestimonials";
import ProtectedRoute from "./admin/components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#3a3d42",
              color: "#ffffff",
              border: "1px solid rgba(184, 247, 228, 0.2)",
            },
            success: {
              iconTheme: {
                primary: "#b8f7e4",
                secondary: "#25272c",
              },
            },
          }}
        />

        <Routes>
          {/* ======================== */}
          {/* PUBLIC ROUTES            */}
          {/* ======================== */}
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

          {/* ======================== */}
          {/* ADMIN ROUTES             */}
          {/* ======================== */}
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
  );
}

export default App;
