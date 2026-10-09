"use client";

import { useState } from "react";

import {
  FiHeart,
  FiLoader,
} from "react-icons/fi";

import styles from "./WishlistButton.module.css";

export default function WishlistButton({
  productId,
  initialIsWishlisted = false,
}) {
  const [
    isWishlisted,
    setIsWishlisted,
  ] = useState(
    initialIsWishlisted
  );

  const [
    isUpdating,
    setIsUpdating,
  ] = useState(false);

  const handleToggle = async () => {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      if (isWishlisted) {
        const response =
          await fetch(
            `/api/wishlist/${productId}`,
            {
              method: "DELETE",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to remove from wishlist"
          );
        }

        setIsWishlisted(false);

        return;
      }

      const response =
        await fetch(
          "/api/wishlist",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              productId,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to add to wishlist"
        );
      }

      setIsWishlisted(true);
    } catch (error) {
      console.error(
        "Wishlist update failed:",
        error
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${
        isWishlisted
          ? styles.active
          : ""
      }`}
      onClick={handleToggle}
      disabled={isUpdating}
      aria-label={
        isWishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      aria-pressed={isWishlisted}
    >
      {isUpdating ? (
        <FiLoader
          className={styles.spinner}
          aria-hidden="true"
        />
      ) : (
        <FiHeart
          className={styles.heart}
          fill={
            isWishlisted
              ? "currentColor"
              : "none"
          }
          aria-hidden="true"
        />
      )}
    </button>
  );
}