import Link from "next/link";
import {
  FiEdit3,
  FiPlus,
} from "react-icons/fi";

import { getMyProducts } from "@/services/productService";

import DeleteProductButton from "./DeleteProductButton";
import styles from "./MyProducts.module.css";

export default async function SellerProductsPage({
  searchParams,
}) {
  const params = await searchParams;
  const page = Math.max(Number(params.page) || 1, 1);

  const result = await getMyProducts({
    page,
    limit: 6,
  });

  const products = result.data || [];
  const pagination = result.pagination;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            STORE MANAGEMENT
          </div>

          <h1 className={styles.title}>
            My Products
          </h1>

          <p className={styles.subtitle}>
            Manage the products you have added to your store.
          </p>
        </div>

        <Link
          href="/seller/products/add"
          className={styles.addButton}
        >
          <FiPlus size={17} />
          Add Product
        </Link>
      </header>

      {products.length === 0 ? (
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiPlus size={24} />
          </div>

          <h2 className={styles.emptyTitle}>
            No products yet
          </h2>

          <p className={styles.emptyText}>
            Add your first product to start building your store.
          </p>

          <Link
            href="/seller/products/add"
            className={styles.addButton}
          >
            <FiPlus size={17} />
            Add Your First Product
          </Link>
        </section>
      ) : (
        <section className={styles.productGrid}>
          {products.map((product) => (
            <article
              key={product._id}
              className={styles.productCard}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
              </div>

              <div className={styles.cardBody}>
                <span className={styles.category}>
                  {product.category}
                </span>

                <h2 className={styles.productName}>
                  {product.name}
                </h2>

                <div className={styles.price}>
                  ₹{Number(product.price).toFixed(2)}
                </div>

                <div className={styles.actions}>
                  <Link
                    href={`/seller/products/edit/${product._id}`}
                    className={styles.editButton}
                  >
                    <FiEdit3 size={14} />
                    Edit
                  </Link>

                  <DeleteProductButton
                    productId={product._id}
                    className={styles.deleteButton}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {pagination?.totalPages > 1 && (
        <nav className={styles.pagination}>
          {page > 1 ? (
            <Link
              href={`/seller/products?page=${page - 1}`}
              className={styles.pageButton}
            >
              Previous
            </Link>
          ) : (
            <span
              className={`${styles.pageButton} ${styles.disabled}`}
            >
              Previous
            </span>
          )}

          <span className={styles.pageInfo}>
            Page {pagination.currentPage} of{" "}
            {pagination.totalPages}
          </span>

          {page < pagination.totalPages ? (
            <Link
              href={`/seller/products?page=${page + 1}`}
              className={styles.pageButton}
            >
              Next
            </Link>
          ) : (
            <span
              className={`${styles.pageButton} ${styles.disabled}`}
            >
              Next
            </span>
          )}
        </nav>
      )}
    </div>
  );
}