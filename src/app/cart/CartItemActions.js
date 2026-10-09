"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  FiMinus,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import styles from "./CartItemActions.module.css";

export default function CartItemActions({
  cartId,
  quantity,
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const updateQuantity = async (
    newQuantity
  ) => {
    if (
      newQuantity < 1 ||
      loading
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/cart/update",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              cartId,
              quantity:
                newQuantity,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to update quantity"
        );

        return;
      }

      router.refresh();
    } catch (error) {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/cart/remove",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              cartId,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to remove item"
        );

        return;
      }

      router.refresh();
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
      <div className={styles.controls}>
        <div
          className={styles.quantityControl}
          aria-label="Quantity"
        >
          <button
            type="button"
            className={
              styles.quantityButton
            }
            onClick={() =>
              updateQuantity(
                quantity - 1
              )
            }
            disabled={
              loading ||
              quantity <= 1
            }
            aria-label="Decrease quantity"
          >
            <FiMinus
              aria-hidden="true"
            />
          </button>

          <span
            className={
              styles.quantity
            }
          >
            {loading ? (
              <span
                className={
                  styles.loading
                }
              >
                ...
              </span>
            ) : (
              quantity
            )}
          </span>

          <button
            type="button"
            className={
              styles.quantityButton
            }
            onClick={() =>
              updateQuantity(
                quantity + 1
              )
            }
            disabled={loading}
            aria-label="Increase quantity"
          >
            <FiPlus
              aria-hidden="true"
            />
          </button>
        </div>

        <button
          type="button"
          className={styles.removeButton}
          onClick={removeItem}
          disabled={loading}
        >
          <FiTrash2
            aria-hidden="true"
          />

          <span>
            Remove
          </span>
        </button>
      </div>

      {error && (
        <p
          className={styles.error}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}