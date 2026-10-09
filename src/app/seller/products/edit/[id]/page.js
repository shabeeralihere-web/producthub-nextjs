import { notFound } from "next/navigation";

import { getProductById } from "@/services/productService";
import EditProductForm from "@/components/products/EditProductForm";

import styles from "./EditProductPage.module.css";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  let product;

  try {
    product = await getProductById(id);
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            STORE MANAGEMENT
          </div>

          <h1 className={styles.title}>
            Edit Product
          </h1>

          <p className={styles.subtitle}>
            Update your product information.
          </p>
        </div>
      </header>

      <EditProductForm
        product={product}
        redirectPath="/seller/products"
      />
    </div>
  );
}