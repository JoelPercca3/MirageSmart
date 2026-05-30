import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CartDrawer from "../cart/CartDrawer.jsx";
import ScrollToTop from "../ui/ScrollToTop.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ScrollToTop />
    </div>
  );
}
