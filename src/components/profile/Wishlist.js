"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiArrowRight,
  FiHeart,
  FiTrash2,
} from "react-icons/fi";

import styles from "./Wishlist.module.css";

export default function Wishlist({
  initialWishlist = [],
}) {
  const [wishlist, setWishlist] =
    useState(initialWishlist);

  const [removingId, setRemovingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const handleRemove = async (productId) => {
    setError("");
    setRemovingId(productId);

    try {
      const response = await fetch(
        `/api/wishlist/${productId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to remove product"
        );
      }

      setWishlist((current) =>
        current.filter(
          (item) =>
            item.productId?._id !== productId
        )
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to remove product"
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>
            Saved Products
          </span>

          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              Wishlist
            </h1>

            {wishlist.length > 0 && (
              <span className={styles.count}>
                {wishlist.length}
              </span>
            )}
          </div>

          <p className={styles.subtitle}>
            Products you saved for later.
          </p>
        </div>
      </header>

      {error && (
        <div className={styles.error}>
          <span>{error}</span>
        </div>
      )}

      {wishlist.length === 0 ? (
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiHeart size={25} />
          </div>

          <h2 className={styles.emptyTitle}>
            Your wishlist is empty
          </h2>

          <p className={styles.emptyText}>
            Save products you like and find
            them here later.
          </p>

          <Link
            href="/products"
            className={styles.browseButton}
          >
            Browse Products
            <FiArrowRight size={15} />
          </Link>
        </section>
      ) : (
        <section className={styles.productSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                Saved Products
              </h2>

              <p className={styles.sectionDescription}>
                Your selected products in one place.
              </p>
            </div>
          </div>

          <div className={styles.productGrid}>
            {wishlist.map((item) => {
              const product = item.productId;

              if (!product) {
                return null;
              }

              const isRemoving =
                removingId === product._id;

              return (
                <article
                  key={item._id}
                  className={styles.productCard}
                >
                  <Link
                    href={`/product/${product._id}`}
                    className={styles.imageLink}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                      />
                    ) : (
                      <div
                        className={styles.imageFallback}
                      >
                        <FiHeart size={28} />
                      </div>
                    )}
                  </Link>

                  <div className={styles.productContent}>
                    {product.category && (
                      <span className={styles.category}>
                        {product.category}
                      </span>
                    )}

                    <Link
                      href={`/product/${product._id}`}
                      className={styles.productName}
                    >
                      {product.name}
                    </Link>

                    <div className={styles.price}>
                      ₹
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </div>

                    {product.description && (
                      <p className={styles.description}>
                        {product.description}
                      </p>
                    )}

                    <div className={styles.actions}>
                      <Link
                        href={`/product/${product._id}`}
                        className={styles.viewButton}
                      >
                        View Product
                        <FiArrowRight size={14} />
                      </Link>

                      <button
                        type="button"
                        className={styles.removeButton}
                        disabled={isRemoving}
                        onClick={() =>
                          handleRemove(
                            product._id
                          )
                        }
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <FiTrash2 size={15} />

                        <span>
                          {isRemoving
                            ? "Removing..."
                            : "Remove"}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}