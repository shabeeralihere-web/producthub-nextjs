"use client";

import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

import styles from "./error.module.css";

export default function Error({ error, reset }) {
  return (
    <main className="container py-5">
      <div className={styles.wrapper}>
        <div className={styles.icon}>
          <FiAlertTriangle size={26} />
        </div>

        <div className={styles.content}>
          <span className={styles.eyebrow}>
            Products
          </span>

          <h1 className={styles.title}>
            We couldn’t load the products
          </h1>

          <p className={styles.message}>
            Something went wrong while loading the
            product catalogue. Please try again.
          </p>

          {error?.message && (
            <p className={styles.details}>
              {error.message}
            </p>
          )}

          <button
            type="button"
            className={styles.retryButton}
            onClick={() => reset()}
          >
            <FiRefreshCw size={16} />
            <span>Try again</span>
          </button>
        </div>
      </div>
    </main>
  );
}