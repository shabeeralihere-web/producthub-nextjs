"use client";

import {
  FiAlertTriangle,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./DeleteProductButton.module.css";

export default function DeleteProductButton({
  productId,
  className,
}) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openModal = () => {
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (loading) {
      return;
    }

    setShowModal(false);
    setError("");
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message || "Unable to delete product"
        );
        return;
      }

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
      <button
        type="button"
        className={className}
        onClick={openModal}
      >
        <FiTrash2 size={14} />
        Delete
      </button>

      {showModal && (
        <div
          className={styles.overlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeModal}
              disabled={loading}
              aria-label="Close"
            >
              <FiX size={17} />
            </button>

            <div className={styles.icon}>
              <FiAlertTriangle size={22} />
            </div>

            <h2
              id="delete-product-title"
              className={styles.title}
            >
              Delete product?
            </h2>

            <p className={styles.message}>
              Are you sure you want to delete this product?
              This action cannot be undone.
            </p>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.confirmButton}
                onClick={handleDelete}
                disabled={loading}
              >
                <FiTrash2 size={15} />

                {loading
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}