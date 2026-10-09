import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import AddProductForm from "./AddProductForm";
import styles from "./AddProductForm.module.css";

export default function AddProductPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            STORE MANAGEMENT
          </div>

          <h1 className={styles.title}>
            Add Product
          </h1>

          <p className={styles.subtitle}>
            Add a new product to your store.
          </p>
        </div>

        <Link
          href="/seller/products"
          className={styles.backLink}
        >
          <FiArrowLeft size={16} />
          My Products
        </Link>
      </header>

      <AddProductForm />
    </div>
  );
}