import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className="container py-5">
      {/* Breadcrumb skeleton */}
      <div className={styles.breadcrumb}>
        <span className={styles.shortLine} />
        <span className={styles.separator}>/</span>
        <span className={styles.mediumLine} />
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.title} />

          <div className={styles.subtitle} />
        </div>

        {/* Search skeleton */}
        <div className={styles.search}>
          <div className={styles.searchInput} />
          <div className={styles.searchButton} />
        </div>
      </div>

      {/* Result count */}
      <div className={styles.resultCount} />

      {/* Product grid */}
      <div className="row g-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            className="col-12 col-sm-6 col-lg-4 col-xl-3"
            key={index}
          >
            <div className={styles.productCard}>
              {/* Product image */}
              <div className={styles.productImage} />

              {/* Product content */}
              <div className={styles.productBody}>
                <div className={styles.category} />

                <div className={styles.productName} />

                <div className={styles.productNameShort} />

                <div className={styles.price} />

                <div className={styles.button} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className={styles.pagination}>
        <div className={styles.pageButton} />
        <div className={styles.pageNumber} />
        <div className={styles.pageNumber} />
        <div className={styles.pageNumber} />
        <div className={styles.pageButton} />
      </div>
    </main>
  );
}