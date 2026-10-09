import { redirect } from "next/navigation";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";

import { getAddresses } from "@/services/addressService";
import { getCart } from "@/services/cartService";

import CheckoutForm from "./CheckoutForm";

import styles from "./page.module.css";

export default async function CheckoutPage() {
  let cartResult;
  let addressResult;

  try {
    cartResult = await getCart({ page: 1 });

    try {
      addressResult = await getAddresses();
    } catch (error) {
      console.error(
        "Failed to load saved addresses:",
        error
      );

      addressResult = {
        data: [],
      };
    }
  } catch (error) {
    redirect("/cart");
  }

  const cartItems = (cartResult?.data || []).filter(
    (item) => item.productId
  );

  const addresses = addressResult?.data || [];

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  return (
    <main className={styles.page}>
      <div className="container py-4 py-md-5">
        <Breadcrumbs
          items={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Cart",
              href: "/cart",
            },
            {
              label: "Checkout",
            },
          ]}
        />

        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              Secure checkout
            </span>

            <h1 className={styles.title}>
              Checkout
            </h1>

            <p className={styles.description}>
              Review your items, choose a delivery
              address, and complete your order.
            </p>
          </div>

          <div className={styles.stepIndicator}>
            <span className={styles.stepActive}>
              01
            </span>

            <span>Checkout</span>
          </div>
        </header>

        <CheckoutForm
          cartItems={cartItems}
          initialAddresses={addresses}
        />
      </div>
    </main>
  );
}