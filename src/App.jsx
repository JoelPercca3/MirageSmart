import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import PageTransition from "./components/ui/PageTransition.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import CookiesPage from "./pages/CookiesPage.jsx";
import ComplaintsBookPage from "./pages/ComplaintsBookPage.jsx";
import RefundPolicyPage from "./pages/RefundPolicyPage.jsx"; // ← AGREGAR ESTA LÍNEA

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/products"
            element={
              <PageTransition>
                <ProductsPage />
              </PageTransition>
            }
          />
          <Route
            path="/products/:id"
            element={
              <PageTransition>
                <ProductDetailPage />
              </PageTransition>
            }
          />
          <Route
            path="/category/:id"
            element={
              <PageTransition>
                <CategoryPage />
              </PageTransition>
            }
          />
          <Route
            path="/cart"
            element={
              <PageTransition>
                <CartPage />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransition>
                <RegisterPage />
              </PageTransition>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageTransition>
                <ForgotPasswordPage />
              </PageTransition>
            }
          />

          <Route
            path="/terminos"
            element={
              <PageTransition>
                <TermsPage />
              </PageTransition>
            }
          />
          <Route
            path="/privacidad"
            element={
              <PageTransition>
                <PrivacyPage />
              </PageTransition>
            }
          />
          <Route
            path="/cookies"
            element={
              <PageTransition>
                <CookiesPage />
              </PageTransition>
            }
          />
          <Route
            path="/libro-reclamaciones"
            element={
              <PageTransition>
                <ComplaintsBookPage />
              </PageTransition>
            }
          />
          <Route
            path="/reembolsos"
            element={
              <PageTransition>
                <RefundPolicyPage />
              </PageTransition>
            }
          />

          <Route
            path="/auth/callback"
            element={
              <PageTransition>
                <AuthCallback />
              </PageTransition>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/checkout"
              element={
                <PageTransition>
                  <CheckoutPage />
                </PageTransition>
              }
            />
            <Route
              path="/order-success/:id"
              element={
                <PageTransition>
                  <OrderSuccessPage />
                </PageTransition>
              }
            />
            <Route
              path="/orders"
              element={
                <PageTransition>
                  <OrdersPage />
                </PageTransition>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <PageTransition>
                  <OrderDetailPage />
                </PageTransition>
              }
            />
            <Route
              path="/wishlist"
              element={
                <PageTransition>
                  <WishlistPage />
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
