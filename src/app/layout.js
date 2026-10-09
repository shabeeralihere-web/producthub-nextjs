import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/providers/ToastProvider";
import CartSuccessModal from "@/components/cart/CartSuccessModal";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import { getCurrentUser } from "@/services/authService";

export const metadata = {
  title: "ProductHub",
  description: "ProductHub - Product Management Platform",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100">
        <AuthProvider initialUser={user}>
          <CartProvider>
            <Navbar />

            <main className="flex-grow-1">
              {children}
            </main>

            <Footer />

            <ToastProvider />

            <CartSuccessModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}