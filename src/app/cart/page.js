import Link from "next/link";

import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingBag,
} from "react-icons/fi";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";

import { getCart } from "@/services/cartService";

import CartItemActions from "./CartItemActions";
import ClearCartButton from "./ClearCartButton";

import styles from "./page.module.css";

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

export default async function CartPage({
  searchParams,
}) {
  const params = await searchParams;

  const page = Math.max(
    Number(params?.page) || 1,
    1
  );

  const result = await getCart({
    page,
  });

  const cartItems = result.data || [];
  const pagination = result.pagination || {};

  const validItems = cartItems.filter(
    (item) => item.productId
  );

  const pageSubtotal = validItems.reduce(
    (total, item) => {
      const price =
        Number(item.productId?.price) || 0;

      const quantity =
        Number(item.quantity) || 0;

      return total + price * quantity;
    },
    0
  );

  const pageItemQuantity =
    validItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  const totalItems =
    pagination.totalItems || pageItemQuantity;

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
            },
          ]}
        />

        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              Shopping
            </span>

            <h1 className={styles.title}>
              Shopping Cart
            </h1>

            <p className={styles.description}>
              Review your selected products before
              continuing to checkout.
            </p>
          </div>

          {totalItems > 0 && (
            <div className={styles.itemCount}>
              <strong>
                {totalItems}
              </strong>

              <span>
                {totalItems === 1
                  ? "item"
                  : "items"}
              </span>
            </div>
          )}
        </header>

        {validItems.length === 0 ? (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiShoppingBag
                aria-hidden="true"
              />
            </div>

            <h2>Your cart is empty</h2>

            <p>
              You haven't added any products to
              your cart yet. Explore the
              marketplace and find something you
              like.
            </p>

            <Link
              href="/products"
              className={styles.shopButton}
            >
              Browse Products

              <FiArrowRight
                aria-hidden="true"
              />
            </Link>
          </section>
        ) : (
          <div className={styles.layout}>
            <section className={styles.cartSection}>
              <div className={styles.cartHeader}>
                <div>
                  <span
                    className={
                      styles.sectionEyebrow
                    }
                  >
                    Your selection
                  </span>

                  <h2
                    className={
                      styles.sectionTitle
                    }
                  >
                    Cart items
                  </h2>
                </div>

                <ClearCartButton />
              </div>

              <div className={styles.itemsList}>
                {validItems.map((item) => {
                  const product =
                    item.productId;

                  const itemTotal =
                    Number(product.price) *
                    Number(item.quantity);

                  return (
                    <article
                      key={item._id}
                      className={styles.cartItem}
                    >
                      <Link
                        href={`/product/${product._id}`}
                        className={
                          styles.imageLink
                        }
                        aria-label={`View ${product.name}`}
                      >
                        <div
                          className={
                            styles.imageWrapper
                          }
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className={
                              styles.productImage
                            }
                          />
                        </div>
                      </Link>

                      <div
                        className={
                          styles.productInfo
                        }
                      >
                        <Link
                          href={`/product/${product._id}`}
                          className={
                            styles.productLink
                          }
                        >
                          <span
                            className={
                              styles.category
                            }
                          >
                            {product.category}
                          </span>

                          <h3
                            className={
                              styles.productName
                            }
                          >
                            {product.name}
                          </h3>
                        </Link>

                        <div
                          className={
                            styles.unitPrice
                          }
                        >
                          {formatPrice(
                            product.price
                          )}{" "}
                          each
                        </div>

                        <div
                          className={
                            styles.mobileTotal
                          }
                        >
                          {formatPrice(
                            itemTotal
                          )}
                        </div>
                      </div>

                      <div
                        className={
                          styles.quantityArea
                        }
                      >
                        <span
                          className={
                            styles.quantityLabel
                          }
                        >
                          Quantity
                        </span>

                        <CartItemActions
                          cartId={item._id}
                          quantity={
                            item.quantity
                          }
                        />
                      </div>

                      <div
                        className={
                          styles.itemTotal
                        }
                      >
                        <span>
                          Item total
                        </span>

                        <strong>
                          {formatPrice(
                            itemTotal
                          )}
                        </strong>
                      </div>
                    </article>
                  );
                })}
              </div>

              {pagination.totalPages > 1 && (
                <nav
                  className={
                    styles.pagination
                  }
                  aria-label="Cart pagination"
                >
                  {page > 1 ? (
                    <Link
                      href={`/cart?page=${
                        page - 1
                      }`}
                      className={
                        styles.paginationButton
                      }
                    >
                      <FiChevronLeft
                        aria-hidden="true"
                      />

                      <span>
                        Previous
                      </span>
                    </Link>
                  ) : (
                    <span
                      className={`${styles.paginationButton} ${styles.disabled}`}
                    >
                      <FiChevronLeft
                        aria-hidden="true"
                      />

                      <span>
                        Previous
                      </span>
                    </span>
                  )}

                  <div
                    className={
                      styles.pageIndicator
                    }
                  >
                    <strong>
                      {pagination.currentPage}
                    </strong>

                    <span>/</span>

                    <span>
                      {pagination.totalPages}
                    </span>
                  </div>

                  {page <
                  pagination.totalPages ? (
                    <Link
                      href={`/cart?page=${
                        page + 1
                      }`}
                      className={
                        styles.paginationButton
                      }
                    >
                      <span>
                        Next
                      </span>

                      <FiChevronRight
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <span
                      className={`${styles.paginationButton} ${styles.disabled}`}
                    >
                      <span>
                        Next
                      </span>

                      <FiChevronRight
                        aria-hidden="true"
                      />
                    </span>
                  )}
                </nav>
              )}
            </section>

            <aside className={styles.summary}>
              <div
                className={
                  styles.summaryHeader
                }
              >
                <span
                  className={
                    styles.sectionEyebrow
                  }
                >
                  Checkout
                </span>

                <h2
                  className={
                    styles.summaryTitle
                  }
                >
                  Order Summary
                </h2>
              </div>

              <div
                className={
                  styles.summaryRows
                }
              >
                <div
                  className={
                    styles.summaryRow
                  }
                >
                  <span>
                    Items
                  </span>

                  <strong>
                    {pageItemQuantity}
                  </strong>
                </div>

                <div
                  className={
                    styles.summaryRow
                  }
                >
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    {formatPrice(
                      pageSubtotal
                    )}
                  </strong>
                </div>

                <div
                  className={
                    styles.summaryRow
                  }
                >
                  <span>
                    Delivery
                  </span>

                  <strong>
                    Free
                  </strong>
                </div>
              </div>

              <div
                className={
                  styles.totalRow
                }
              >
                <span>
                  Total
                </span>

                <strong>
                  {formatPrice(
                    pageSubtotal
                  )}
                </strong>
              </div>

              <Link
                href="/checkout"
                className={
                  styles.checkoutButton
                }
              >
                Proceed to Checkout

                <FiArrowRight
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/products"
                className={
                  styles.continueLink
                }
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}