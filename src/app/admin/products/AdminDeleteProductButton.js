"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiAlertTriangle,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import styles from "./AdminDeleteProductButton.module.css";

export default function AdminDeleteProductButton({ productId }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openModal = () => {
    setError("");
    setIsOpen(true);
  };

  const closeModal = () => {
    if (loading) {
      return;
    }

    setIsOpen(false);
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

      setIsOpen(false);
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
        className={styles.deleteButton}
        onClick={openModal}
      >
        <FiTrash2 size={14} />
        Delete
      </button>

      {isOpen && (
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
              <FiX size={18} />
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
              This product will be permanently removed from
              ProductHub. This action cannot be undone.
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
                <FiTrash2 size={14} />

                {loading
                  ? "Deleting..."
                  : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}