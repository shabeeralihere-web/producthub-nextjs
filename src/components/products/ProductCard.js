import Link from "next/link";

import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

import styles from "./ProductCard.module.css";

export default function ProductCard({
  product,
  initialIsWishlisted = false,
}) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Link
          href={`/product/${product._id}`}
          className={styles.imageLink}
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImage}
          />
        </Link>

        <div className={styles.wishlistWrapper}>
          <WishlistButton
            productId={product._id}
            initialIsWishlisted={
              initialIsWishlisted
            }
          />
        </div>
      </div>

      <div className={styles.content}>
        <Link
          href={`/product/${product._id}`}
          className={styles.productLink}
        >
          <h2 className={styles.productName}>
            {product.name}
          </h2>

          <span className={styles.category}>
            {product.category}
          </span>

          <div className={styles.price}>
            ₹
            {Number(product.price).toLocaleString(
              "en-IN"
            )}
          </div>
        </Link>

        <div className={styles.cartWrapper}>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}