"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cartCount, setCartCount] =
    useState(0);

  const [cartModal, setCartModal] =
    useState({
      isOpen: false,
      status: "added",
      productName: "",
    });

  const refreshCartCount =
    useCallback(async () => {
      if (!user) {
        setCartCount(0);
        return;
      }

      try {
        const response =
          await fetch("/api/cart/count", {
            cache: "no-store",
          });

        if (!response.ok) {
          setCartCount(0);
          return;
        }

        const result =
          await response.json();

        setCartCount(result.count || 0);
      } catch (error) {
        console.error(
          "Failed to load cart count:",
          error
        );

        setCartCount(0);
      }
    }, [user]);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  const showCartModal = useCallback(
    ({ status, productName }) => {
      setCartModal({
        isOpen: true,
        status,
        productName,
      });
    },
    []
  );

  const closeCartModal = useCallback(() => {
    setCartModal((current) => ({
      ...current,
      isOpen: false,
    }));
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        refreshCartCount,
        cartModal,
        showCartModal,
        closeCartModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}