"use client";

import {
  FiAlertTriangle,
  FiRefreshCw,
} from "react-icons/fi";

import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}) {
  return (
    <main className={styles.page}>
      <div className="container py-5">
        <section
          className={styles.errorCard}
          role="alert"
        >
          <div className={styles.iconWrapper}>
            <FiAlertTriangle
              aria-hidden="true"
            />
          </div>

          <span className={styles.eyebrow}>
            Cart
          </span>

          <h1 className={styles.title}>
            Something went wrong
          </h1>

          <p className={styles.message}>
            {error?.message ||
              "Unable to load your cart. Please try again."}
          </p>

          <button
            type="button"
            className={styles.retryButton}
            onClick={() => reset()}
          >
            <FiRefreshCw
              aria-hidden="true"
            />

            <span>
              Try again
            </span>
          </button>
        </section>
      </div>
    </main>
  );
}