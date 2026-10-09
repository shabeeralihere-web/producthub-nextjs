import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBox,
  FiEdit3,
} from "react-icons/fi";

import { getAllProducts } from "@/services/adminService";
import AdminDeleteProductButton from "./AdminDeleteProductButton";

import styles from "./AdminProducts.module.css";

export default async function AdminProductsPage({
  searchParams,
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await getAllProducts({
    page,
    limit: 8,
  });

  const products = result.data || [];
  const pagination = result.pagination;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            PRODUCT MANAGEMENT
          </div>

          <h1 className={styles.title}>
            Products
          </h1>

          <p className={styles.subtitle}>
            Manage every product listed on the ProductHub platform.
          </p>
        </div>

        <div className={styles.overview}>
          <div className={styles.overviewIcon}>
            <FiBox size={18} />
          </div>

          <div>
            <span className={styles.overviewLabel}>
              Total Products
            </span>

            <strong className={styles.overviewValue}>
              {pagination?.totalProducts || 0}
            </strong>
          </div>
        </div>
      </header>

      {products.length === 0 ? (
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiBox size={25} />
          </div>

          <h2 className={styles.emptyTitle}>
            No products found
          </h2>

          <p className={styles.emptyText}>
            There are no products available on the platform yet.
          </p>
        </section>
      ) : (
        <>
          <section className={styles.productSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  All Products
                </h2>

                <p className={styles.sectionDescription}>
                  Products currently listed on ProductHub.
                </p>
              </div>

              <span className={styles.pageIndicator}>
                Page {pagination.currentPage} of{" "}
                {pagination.totalPages}
              </span>
            </div>

            <div className={styles.productGrid}>
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

                    <span className={styles.categoryBadge}>
                      {product.category}
                    </span>
                  </div>

                  <div className={styles.productContent}>
                    <div className={styles.productMain}>
                      <h3 className={styles.productName}>
                        {product.name}
                      </h3>

                      <div className={styles.price}>
                        ₹{Number(product.price).toFixed(2)}
                      </div>
                    </div>

                    <div className={styles.productMeta}>
                      <span>Product ID</span>

                      <span
                        className={styles.productId}
                        title={product._id}
                      >
                        {product._id}
                      </span>
                    </div>

                    <div className={styles.actions}>
                      <Link
                        href={`/admin/products/edit/${product._id}`}
                        className={styles.editButton}
                      >
                        <FiEdit3 size={14} />
                        Edit
                      </Link>

                      <AdminDeleteProductButton
                        productId={product._id}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {pagination.totalPages > 1 && (
            <nav className={styles.pagination}>
              {page > 1 ? (
                <Link
                  href={`/admin/products?page=${page - 1}`}
                  className={styles.paginationButton}
                >
                  <FiArrowLeft size={15} />
                  Previous
                </Link>
              ) : (
                <span
                  className={`${styles.paginationButton} ${styles.disabled}`}
                >
                  <FiArrowLeft size={15} />
                  Previous
                </span>
              )}

              <div className={styles.paginationInfo}>
                <span className={styles.currentPage}>
                  {pagination.currentPage}
                </span>

                <span className={styles.pageSeparator}>
                  /
                </span>

                <span>
                  {pagination.totalPages}
                </span>
              </div>

              {page < pagination.totalPages ? (
                <Link
                  href={`/admin/products?page=${page + 1}`}
                  className={styles.paginationButton}
                >
                  Next
                  <FiArrowRight size={15} />
                </Link>
              ) : (
                <span
                  className={`${styles.paginationButton} ${styles.disabled}`}
                >
                  Next
                  <FiArrowRight size={15} />
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}