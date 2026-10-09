import { getProductById } from "@/services/productService";

import AddToCartButton from "@/components/products/AddToCartButton";
import WishlistButton from "@/components/products/WishlistButton";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

import styles from "./page.module.css";

export default async function ProductDetailsPage({
  params,
}) {
  const { id } = await params;

  const product = await getProductById(id);

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/products",
    },
    {
      label: product.name,
    },
  ];

  return (
    <main className={styles.page}>
      <div className="container py-4 py-lg-5">
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.productLayout}>
          {/* Product Image */}
          <section className={styles.imageSection}>
            <div className={styles.imageCard}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.productImage}
              />
            </div>
          </section>

          {/* Product Information */}
          <section className={styles.detailsSection}>
            <span className={styles.category}>
              {product.category}
            </span>

            <h1 className={styles.title}>
              {product.name}
            </h1>

            <div className={styles.priceSection}>
              <span className={styles.price}>
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>

            <div className={styles.divider} />

            <div className={styles.actions}>
              <AddToCartButton
                productId={product._id}
              />

              <WishlistButton
                productId={product._id}
              />
            </div>

            <div className={styles.divider} />

            <div className={styles.productInformation}>
              <h2 className={styles.informationTitle}>
                Product information
              </h2>

              <div className={styles.informationRow}>
                <span>Category</span>
                <strong>{product.category}</strong>
              </div>

              <div className={styles.informationRow}>
                <span>Product</span>
                <strong>{product.name}</strong>
              </div>
            </div>

            <div className={styles.browseLink}>
              <span>
                Looking for something else?
              </span>

              <a href="/products">
                Continue shopping
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}