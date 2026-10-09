"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";

import { useCart } from "@/context/CartContext";

import styles from "./CartSuccessModal.module.css";

export default function CartSuccessModal() {
  const router = useRouter();

  const {
    cartModal,
    closeCartModal,
  } = useCart();

  const {
    isOpen,
    status,
    productName,
  } = cartModal;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeCartModal();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, closeCartModal]);

  if (!isOpen) {
    return null;
  }

  const isAlreadyInCart =
    status === "already";

  const title = isAlreadyInCart
    ? "Already in Cart"
    : "Added to Cart!";

  const message = isAlreadyInCart
    ? `${productName} is already in your cart.`
    : `${productName} has been added to your cart.`;

  const handleGoToCart = () => {
    closeCartModal();
    router.push("/cart");
  };

  return (
    <div
      className={styles.overlay}
      onClick={closeCartModal}
    >
      <div
        className={styles.modal}
        onClick={(event) =>
          event.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeCartModal}
          aria-label="Close"
        >
          <FiX
            size={19}
            aria-hidden="true"
          />
        </button>

        <div className={styles.iconWrapper}>
          <FiShoppingCart
            size={25}
            aria-hidden="true"
          />
        </div>

        <h2
          id="cart-modal-title"
          className={styles.title}
        >
          {title}
        </h2>

        <p className={styles.message}>
          {message}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.continueButton}
            onClick={closeCartModal}
          >
            Continue Shopping
          </button>

          <button
            type="button"
            className={styles.cartButton}
            onClick={handleGoToCart}
          >
            <span>Go to Cart</span>

            <FiArrowRight
              size={16}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
}