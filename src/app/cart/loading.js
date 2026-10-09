import styles from "./loading.module.css";

function SkeletonLine({ className = "" }) {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      aria-hidden="true"
    />
  );
}

function CartItemSkeleton() {
  return (
    <div className={styles.cartItem}>
      <div className={styles.imageSkeleton}>
        <SkeletonLine
          className={styles.imageShimmer}
        />
      </div>

      <div className={styles.productInfo}>
        <SkeletonLine
          className={styles.categorySkeleton}
        />

        <SkeletonLine
          className={styles.nameSkeleton}
        />

        <SkeletonLine
          className={styles.nameSkeletonShort}
        />

        <SkeletonLine
          className={styles.priceSkeleton}
        />
      </div>

      <div className={styles.quantityArea}>
        <SkeletonLine
          className={styles.quantityLabelSkeleton}
        />

        <div className={styles.quantitySkeleton}>
          <SkeletonLine
            className={styles.quantityButtonSkeleton}
          />

          <SkeletonLine
            className={styles.quantityNumberSkeleton}
          />

          <SkeletonLine
            className={styles.quantityButtonSkeleton}
          />
        </div>
      </div>

      <div className={styles.totalSkeletonWrapper}>
        <SkeletonLine
          className={styles.totalLabelSkeleton}
        />

        <SkeletonLine
          className={styles.totalPriceSkeleton}
        />
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <aside className={styles.summary}>
      <SkeletonLine
        className={styles.summaryEyebrow}
      />

      <SkeletonLine
        className={styles.summaryTitle}
      />

      <div className={styles.summaryRows}>
        <div className={styles.summaryRow}>
          <SkeletonLine
            className={styles.summaryLabel}
          />

          <SkeletonLine
            className={styles.summaryValue}
          />
        </div>

        <div className={styles.summaryRow}>
          <SkeletonLine
            className={styles.summaryLabel}
          />

          <SkeletonLine
            className={styles.summaryValue}
          />
        </div>

        <div className={styles.summaryRow}>
          <SkeletonLine
            className={styles.summaryLabel}
          />

          <SkeletonLine
            className={styles.summaryValue}
          />
        </div>
      </div>

      <div className={styles.totalRow}>
        <SkeletonLine
          className={styles.totalLabel}
        />

        <SkeletonLine
          className={styles.totalValue}
        />
      </div>

      <SkeletonLine
        className={styles.checkoutSkeleton}
      />

      <SkeletonLine
        className={styles.continueSkeleton}
      />
    </aside>
  );
}

export default function Loading() {
  return (
    <main
      className={styles.page}
      aria-busy="true"
      aria-label="Loading cart"
    >
      <div className="container py-4 py-md-5">
        {/* Breadcrumb skeleton */}
        <div className={styles.breadcrumbSkeleton}>
          <SkeletonLine
            className={styles.breadcrumbHome}
          />

          <span
            className={styles.breadcrumbSlash}
          >
            /
          </span>

          <SkeletonLine
            className={styles.breadcrumbCurrent}
          />
        </div>

        {/* Header skeleton */}
        <header className={styles.header}>
          <div>
            <SkeletonLine
              className={styles.eyebrowSkeleton}
            />

            <SkeletonLine
              className={styles.titleSkeleton}
            />

            <SkeletonLine
              className={styles.descriptionSkeleton}
            />
          </div>

          <div className={styles.itemCountSkeleton}>
            <SkeletonLine
              className={styles.countNumberSkeleton}
            />

            <SkeletonLine
              className={styles.countTextSkeleton}
            />
          </div>
        </header>

        {/* Main cart layout */}
        <div className={styles.layout}>
          <section className={styles.cartSection}>
            {/* Cart header */}
            <div className={styles.cartHeader}>
              <div>
                <SkeletonLine
                  className={styles.sectionEyebrowSkeleton}
                />

                <SkeletonLine
                  className={styles.sectionTitleSkeleton}
                />
              </div>

              <SkeletonLine
                className={styles.clearButtonSkeleton}
              />
            </div>

            {/* Cart items */}
            <div className={styles.itemsList}>
              <CartItemSkeleton />
              <CartItemSkeleton />
              <CartItemSkeleton />
            </div>
          </section>

          {/* Summary */}
          <SummarySkeleton />
        </div>
      </div>
    </main>
  );
}