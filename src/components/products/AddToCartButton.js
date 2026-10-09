"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  FiLoader,
  FiShoppingCart,
} from "react-icons/fi";

import { useCart } from "@/context/CartContext";

import styles from "./AddToCartButton.module.css";

export default function AddToCartButton({
  product,
}) {
  const router = useRouter();

  const {
    refreshCartCount,
    showCartModal,
  } = useCart();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleAddToCart = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch("/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
          }),
        });

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to add product"
        );

        return;
      }

      await refreshCartCount();

      const status =
        response.status === 201
          ? "added"
          : "already";

      showCartModal({
        status,
        productName: product.name,
      });
    } catch (error) {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? (
          <>
            <FiLoader
              className={styles.spinner}
              aria-hidden="true"
            />

            <span>Adding...</span>
          </>
        ) : (
          <>
            <FiShoppingCart
              aria-hidden="true"
            />

            <span>Add to Cart</span>
          </>
        )}
      </button>

      {error && (
        <div
          className={styles.error}
          role="alert"
        >
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}