"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  FiAlertTriangle,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { useCart } from "@/context/CartContext";

import styles from "./ClearCartButton.module.css";

export default function ClearCartButton() {
  const router = useRouter();

  const { refreshCartCount } = useCart();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const handleOpenModal = () => {
    if (loading) {
      return;
    }

    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (loading) {
      return;
    }

    setShowModal(false);
  };

  const handleClearCart = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/cart/clear",
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to clear cart"
        );

        return;
      }

      await refreshCartCount();

      setShowModal(false);

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
    <>
      <div className={styles.wrapper}>
        <button
          type="button"
          className={styles.button}
          onClick={handleOpenModal}
          disabled={loading}
        >
          <FiTrash2
            aria-hidden="true"
          />

          <span>
            Clear Cart
          </span>
        </button>

        {error && (
          <p
            className={styles.error}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={handleCloseModal}
        >
          <div
            className={styles.modal}
            onClick={(event) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-cart-title"
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleCloseModal}
              disabled={loading}
              aria-label="Close"
            >
              <FiX
                size={19}
                aria-hidden="true"
              />
            </button>

            <div className={styles.warningIcon}>
              <FiAlertTriangle
                size={24}
                aria-hidden="true"
              />
            </div>

            <h2
              id="clear-cart-title"
              className={styles.modalTitle}
            >
              Clear Cart?
            </h2>

            <p className={styles.modalMessage}>
              Are you sure you want to
              remove all items from your
              cart? This action cannot be
              undone.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClearCart}
                disabled={loading}
              >
                <FiTrash2
                  size={16}
                  aria-hidden="true"
                />

                <span>
                  {loading
                    ? "Clearing..."
                    : "Clear Cart"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}