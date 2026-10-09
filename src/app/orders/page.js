import Link from "next/link";
import { redirect } from "next/navigation";

import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
} from "react-icons/fi";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { getMyOrders } from "@/services/orderService";

import styles from "./page.module.css";

function formatDate(date) {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function getStatusClass(status) {
  switch (status) {
    case "delivered":
      return styles.statusDelivered;

    case "shipped":
      return styles.statusShipped;

    case "confirmed":
      return styles.statusConfirmed;

    case "cancelled":
      return styles.statusCancelled;

    default:
      return styles.statusPending;
  }
}

export default async function MyOrdersPage({
  searchParams,
}) {
  const params = await searchParams;

  const page = Math.max(
    Number(params?.page) || 1,
    1
  );

  let result;

  try {
    result = await getMyOrders({
      page,
      limit: 6,
    });
  } catch (error) {
    if (
      error.message ===
      "Authentication required"
    ) {
      redirect("/login");
    }

    throw error;
  }

  const orders = result.data || [];
  const pagination = result.pagination || {};

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
              label: "Orders",
            },
          ]}
        />

        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              Account
            </span>

            <h1 className={styles.title}>
              My Orders
            </h1>

            <p className={styles.description}>
              View your recent purchases and
              order details.
            </p>
          </div>

          {pagination.totalOrders > 0 && (
            <div className={styles.orderCount}>
              <strong>
                {pagination.totalOrders}
              </strong>

              <span>
                {pagination.totalOrders === 1
                  ? "order"
                  : "orders"}
              </span>
            </div>
          )}
        </header>

        {orders.length === 0 ? (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiPackage aria-hidden="true" />
            </div>

            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
              Your purchases will appear here.
            </p>

            <Link
              href="/products"
              className={styles.shopButton}
            >
              Start Shopping
              <FiArrowRight
                aria-hidden="true"
              />
            </Link>
          </section>
        ) : (
          <>
            <section
              className={styles.ordersList}
              aria-label="Your orders"
            >
              {orders.map((order) => {
                const items =
                  order.items || [];

                const itemCount =
                  items.reduce(
                    (total, item) =>
                      total +
                      Number(
                        item.quantity || 0
                      ),
                    0
                  );

                const statuses = [
                  ...new Set(
                    items
                      .map(
                        (item) =>
                          item.status
                      )
                      .filter(Boolean)
                  ),
                ];

                return (
                  <article
                    key={order._id}
                    className={styles.orderCard}
                  >
                    <div
                      className={
                        styles.orderHeader
                      }
                    >
                      <div>
                        <span
                          className={
                            styles.orderLabel
                          }
                        >
                          Order placed
                        </span>

                        <div
                          className={
                            styles.orderDate
                          }
                        >
                          {formatDate(
                            order.createdAt
                          )}
                        </div>
                      </div>

                      <div
                        className={
                          styles.orderMeta
                        }
                      >
                        <div
                          className={
                            styles.orderNumber
                          }
                        >
                          <span>
                            Order ID
                          </span>

                          <strong>
                            #{order._id}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div
                      className={
                        styles.orderBody
                      }
                    >
                      <div
                        className={
                          styles.itemsSection
                        }
                      >
                        {items
                          .slice(0, 3)
                          .map((item) => (
                            <div
                              key={
                                item._id
                              }
                              className={
                                styles.item
                              }
                            >
                              <div
                                className={
                                  styles.imageWrapper
                                }
                              >
                                {item.productImage ? (
                                  <img
                                    src={
                                      item.productImage
                                    }
                                    alt={
                                      item.productName
                                    }
                                    className={
                                      styles.productImage
                                    }
                                  />
                                ) : (
                                  <div
                                    className={
                                      styles.imageFallback
                                    }
                                  >
                                    <FiPackage
                                      aria-hidden="true"
                                    />
                                  </div>
                                )}
                              </div>

                              <div
                                className={
                                  styles.itemInfo
                                }
                              >
                                <h2
                                  className={
                                    styles.productName
                                  }
                                >
                                  {
                                    item.productName
                                  }
                                </h2>

                                <div
                                  className={
                                    styles.itemDetails
                                  }
                                >
                                  <span>
                                    Qty{" "}
                                    {item.quantity}
                                  </span>

                                  <span
                                    className={
                                      styles.detailDivider
                                    }
                                  >
                                    •
                                  </span>

                                  <span>
                                    {formatPrice(
                                      item.price
                                    )}
                                  </span>
                                </div>

                                {item.status && (
                                  <span
                                    className={`${styles.status} ${getStatusClass(
                                      item.status
                                    )}`}
                                  >
                                    <span
                                      className={
                                        styles.statusDot
                                      }
                                    />

                                    {item.status}
                                  </span>
                                )}
                              </div>

                              <div
                                className={
                                  styles.itemTotal
                                }
                              >
                                {formatPrice(
                                  item.totalPrice
                                )}
                              </div>
                            </div>
                          ))}

                        {items.length > 3 && (
                          <div
                            className={
                              styles.moreItems
                            }
                          >
                            +
                            {items.length - 3}{" "}
                            more{" "}
                            {items.length -
                              3 ===
                            1
                              ? "item"
                              : "items"}
                          </div>
                        )}
                      </div>

                      <aside
                        className={
                          styles.orderSummary
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
                            {itemCount}
                          </strong>
                        </div>

                        <div
                          className={
                            styles.summaryRow
                          }
                        >
                          <span>
                            Status
                          </span>

                          <div
                            className={
                              styles.statusGroup
                            }
                          >
                            {statuses.map(
                              (status) => (
                                <span
                                  key={
                                    status
                                  }
                                  className={`${styles.status} ${getStatusClass(
                                    status
                                  )}`}
                                >
                                  <span
                                    className={
                                      styles.statusDot
                                    }
                                  />

                                  {status}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        <div
                          className={
                            styles.totalRow
                          }
                        >
                          <span>
                            Order total
                          </span>

                          <strong>
                            {formatPrice(
                              order.totalPrice
                            )}
                          </strong>
                        </div>
                      </aside>
                    </div>

                    <div
                      className={
                        styles.orderFooter
                      }
                    >
                      <span
                        className={
                          styles.itemCount
                        }
                      >
                        {itemCount}{" "}
                        {itemCount === 1
                          ? "item"
                          : "items"}{" "}
                        in this order
                      </span>

                      <Link
                        href={`/orders/${order._id}`}
                        className={
                          styles.viewButton
                        }
                      >
                        View order

                        <FiArrowRight
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </section>

            {pagination.totalPages >
              1 && (
              <nav
                className={
                  styles.pagination
                }
                aria-label="Orders pagination"
              >
                {pagination.currentPage >
                1 ? (
                  <Link
                    href={`/orders?page=${
                      pagination.currentPage -
                      1
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
                    className={`${styles.paginationButton} ${styles.paginationDisabled}`}
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

                {pagination.currentPage <
                pagination.totalPages ? (
                  <Link
                    href={`/orders?page=${
                      pagination.currentPage +
                      1
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
                    className={`${styles.paginationButton} ${styles.paginationDisabled}`}
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
          </>
        )}
      </div>
    </main>
  );
}