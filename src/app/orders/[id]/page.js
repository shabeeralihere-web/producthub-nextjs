import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiMapPin,
  FiPackage,
} from "react-icons/fi";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { getOrderById } from "@/services/orderService";

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

export default async function OrderDetailsPage({
  params,
}) {
  const { id } = await params;

  let result;

  try {
    result = await getOrderById(id);
  } catch (error) {
    if (error.status === 401) {
      redirect("/login");
    }

    if (error.status === 404) {
      notFound();
    }

    throw error;
  }

  const order = result.data;

  const items = order.items || [];

  const totalItems = items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const statuses = [
    ...new Set(
      items
        .map((item) => item.status)
        .filter(Boolean)
    ),
  ];

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
              href: "/orders",
            },
            {
              label: "Order Details",
            },
          ]}
        />

        <header className={styles.header}>
          <div className={styles.successIcon}>
            <FiCheck aria-hidden="true" />
          </div>

          <div className={styles.headerContent}>
            <span className={styles.eyebrow}>
              Order confirmed
            </span>

            <h1 className={styles.title}>
              Order placed successfully
            </h1>

            <p className={styles.description}>
              Thank you for your purchase. Your
              order details are shown below.
            </p>
          </div>
        </header>

        <div className={styles.orderMetaCard}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>
              Order ID
            </span>

            <strong className={styles.orderId}>
              #{order._id}
            </strong>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>
              Order placed
            </span>

            <strong>
              {formatDate(order.createdAt)}
            </strong>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>
              Items
            </span>

            <strong>
              {totalItems}
            </strong>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>
              Status
            </span>

            <div className={styles.statusGroup}>
              {statuses.map((status) => (
                <span
                  key={status}
                  className={`${styles.status} ${getStatusClass(
                    status
                  )}`}
                >
                  <span
                    className={styles.statusDot}
                  />

                  {status}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>
                    Purchase
                  </span>

                  <h2 className={styles.sectionTitle}>
                    Order items
                  </h2>
                </div>

                <span className={styles.itemCount}>
                  {items.length}{" "}
                  {items.length === 1
                    ? "product"
                    : "products"}
                </span>
              </div>

              <div className={styles.itemsList}>
                {items.map((item) => (
                  <article
                    key={item._id}
                    className={styles.item}
                  >
                    <div className={styles.imageWrapper}>
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
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

                    <div className={styles.itemInfo}>
                      <h3 className={styles.productName}>
                        {item.productName}
                      </h3>

                      <div className={styles.itemDetails}>
                        <span>
                          Quantity:{" "}
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
                          {formatPrice(item.price)}{" "}
                          each
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

                    <div className={styles.itemPrice}>
                      <span>Item total</span>

                      <strong>
                        {formatPrice(
                          item.totalPrice
                        )}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeadingWithIcon}>
                  <div className={styles.sectionIcon}>
                    <FiMapPin
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <span
                      className={
                        styles.sectionEyebrow
                      }
                    >
                      Delivery
                    </span>

                    <h2
                      className={
                        styles.sectionTitle
                      }
                    >
                      Delivery address
                    </h2>
                  </div>
                </div>
              </div>

              <div className={styles.address}>
                <strong>
                  {
                    order.deliveryAddress
                      ?.fullName
                  }
                </strong>

                <p>
                  {
                    order.deliveryAddress
                      ?.address
                  }
                </p>

                <p>
                  {
                    order.deliveryAddress
                      ?.city
                  }
                  ,{" "}
                  {
                    order.deliveryAddress
                      ?.state
                  }
                </p>

                <p>
                  PIN:{" "}
                  {
                    order.deliveryAddress
                      ?.pinCode
                  }
                </p>

                <p>
                  Phone:{" "}
                  {
                    order.deliveryAddress
                      ?.phone
                  }
                </p>
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <section className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <div className={styles.summaryIcon}>
                  <FiCreditCard
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <span
                    className={
                      styles.sectionEyebrow
                    }
                  >
                    Payment
                  </span>

                  <h2
                    className={
                      styles.summaryTitle
                    }
                  >
                    Order summary
                  </h2>
                </div>
              </div>

              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>
                    Items ({totalItems})
                  </span>

                  <strong>
                    {formatPrice(
                      order.totalPrice
                    )}
                  </strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>
                    Payment method
                  </span>

                  <strong
                    className={
                      styles.paymentMethod
                    }
                  >
                    {order.paymentMethod}
                  </strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>
                    Delivery
                  </span>

                  <strong>Free</strong>
                </div>
              </div>

              <div className={styles.totalRow}>
                <span>Order total</span>

                <strong>
                  {formatPrice(
                    order.totalPrice
                  )}
                </strong>
              </div>

              <div className={styles.actions}>
                <Link
                  href="/products"
                  className={styles.primaryButton}
                >
                  Continue Shopping

                  <FiArrowRight
                    aria-hidden="true"
                  />
                </Link>

                <Link
                  href="/orders"
                  className={styles.secondaryButton}
                >
                  View My Orders
                </Link>
              </div>
            </section>

            <Link
              href="/orders"
              className={styles.backLink}
            >
              <FiArrowLeft
                aria-hidden="true"
              />

              Back to orders
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}