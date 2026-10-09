import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiEdit3,
  FiHash,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiShoppingBag,
  FiTruck,
  FiUser,
} from "react-icons/fi";

import { getAdminOrderById } from "@/services/orderService";

import styles from "./AdminOrderDetails.module.css";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatStatus(status) {
  if (!status) {
    return "Pending";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusClass(status) {
  switch (status?.toLowerCase()) {
    case "delivered":
      return styles.delivered;

    case "shipped":
      return styles.shipped;

    case "confirmed":
      return styles.confirmed;

    case "cancelled":
      return styles.cancelled;

    default:
      return styles.pending;
  }
}

function getCustomerName(user) {
  if (!user) {
    return "Unknown Customer";
  }

  return (
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Unknown Customer"
  );
}

export default async function AdminOrderDetailsPage({
  params,
}) {
  const { id } = await params;

  let result;

  try {
    result = await getAdminOrderById(id);
  } catch (error) {
    if (error.status === 401) {
      redirect("/login");
    }

    if (error.status === 404) {
      notFound();
    }

    return (
      <div className={styles.page}>
        <section className={styles.errorState}>
          <div className={styles.errorIcon}>
            <FiShoppingBag size={22} />
          </div>

          <h2 className={styles.errorTitle}>
            Unable to load order
          </h2>

          <p className={styles.errorText}>
            {error.message || "Failed to load order"}
          </p>
        </section>
      </div>
    );
  }

  const order = result?.data;

  if (!order) {
    notFound();
  }

  const customer = order.userId;
  const items = order.items || [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link
            href="/admin/orders"
            className={styles.backLink}
          >
            <FiArrowLeft size={15} />
            Back to Orders
          </Link>

          <div className={styles.eyebrow}>
            ORDER DETAILS
          </div>

          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              Order #{order._id.slice(-8)}
            </h1>

            <span className={styles.itemCount}>
              <FiPackage size={13} />
              {items.length}{" "}
              {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <p className={styles.subtitle}>
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
      </header>

      <div className={styles.layout}>
        <main className={styles.main}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FiUser size={18} />
              </div>

              <div>
                <h2 className={styles.sectionTitle}>
                  Customer
                </h2>

                <p className={styles.sectionDescription}>
                  Customer information for this order.
                </p>
              </div>
            </div>

            <div className={styles.customerCard}>
              <div className={styles.customerAvatar}>
                {customer?.firstName?.charAt(0).toUpperCase() || "U"}
                {customer?.lastName?.charAt(0).toUpperCase() || ""}
              </div>

              <div className={styles.customerInfo}>
                <strong className={styles.customerName}>
                  {getCustomerName(customer)}
                </strong>

                <span className={styles.customerEmail}>
                  {customer?.email || "Email not available"}
                </span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FiPackage size={18} />
              </div>

              <div>
                <h2 className={styles.sectionTitle}>
                  Order Items
                </h2>

                <p className={styles.sectionDescription}>
                  Products included in this order.
                </p>
              </div>

              <span className={styles.sectionCount}>
                {items.length}
              </span>
            </div>

            <div className={styles.itemList}>
              {items.map((item) => {
                const seller = item.sellerId;

                const sellerName = seller
                  ? `${seller.firstName || ""} ${
                      seller.lastName || ""
                    }`.trim()
                  : "Unknown Seller";

                return (
                  <article
                    key={item._id}
                    className={styles.itemCard}
                  >
                    <div className={styles.itemTop}>
                      <div className={styles.productIcon}>
                        <FiShoppingBag size={17} />
                      </div>

                      <div className={styles.productInfo}>
                        <h3 className={styles.productName}>
                          {item.productName}
                        </h3>

                        <div className={styles.sellerInfo}>
                          <span className={styles.sellerLabel}>
                            Seller
                          </span>

                          <span className={styles.sellerName}>
                            {sellerName}
                          </span>

                          {seller?.email && (
                            <span className={styles.sellerEmail}>
                              {seller.email}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={`${styles.statusBadge} ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {formatStatus(item.status)}
                      </span>
                    </div>

                    <div className={styles.itemDetails}>
                      <div className={styles.itemDetail}>
                        <span>Unit Price</span>
                        <strong>
                          ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <div className={styles.itemDetail}>
                        <span>Quantity</span>
                        <strong>{item.quantity}</strong>
                      </div>

                      <div className={styles.itemDetail}>
                        <span>Item Total</span>
                        <strong className={styles.itemTotal}>
                          ₹
                          {Number(
                            item.totalPrice || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FiMapPin size={18} />
              </div>

              <div>
                <h2 className={styles.sectionTitle}>
                  Delivery Address
                </h2>

                <p className={styles.sectionDescription}>
                  Address provided for this order.
                </p>
              </div>
            </div>

            <div className={styles.addressCard}>
              <div className={styles.addressTop}>
                <strong>
                  {order.deliveryAddress?.fullName ||
                    "Not available"}
                </strong>

                {order.deliveryAddress?.phone && (
                  <span className={styles.phone}>
                    <FiPhone size={13} />
                    {order.deliveryAddress.phone}
                  </span>
                )}
              </div>

              <p className={styles.addressText}>
                {order.deliveryAddress?.address ||
                  "Address not available"}
              </p>

              <p className={styles.addressText}>
                {order.deliveryAddress?.city},{" "}
                {order.deliveryAddress?.state} -{" "}
                {order.deliveryAddress?.pinCode}
              </p>
            </div>
          </section>
        </main>

        <aside className={styles.sidebar}>
          <section className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div className={styles.summaryIcon}>
                <FiCreditCard size={17} />
              </div>

              <h2 className={styles.summaryTitle}>
                Order Summary
              </h2>
            </div>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Items</span>
                <strong>{items.length}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Payment</span>
                <strong className={styles.payment}>
                  {order.paymentMethod
                    ? order.paymentMethod.toUpperCase()
                    : "-"}
                </strong>
              </div>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>

              <strong>
                ₹
                {Number(
                  order.totalPrice || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          </section>

          <section className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div className={styles.summaryIcon}>
                <FiTruck size={17} />
              </div>

              <h2 className={styles.summaryTitle}>
                Item Status
              </h2>
            </div>

            <div className={styles.statusList}>
              {items.map((item) => (
                <div
                  key={item._id}
                  className={styles.statusItem}
                >
                  <div className={styles.statusProduct}>
                    <span className={styles.statusDot}>
                      {item.status === "delivered" ? (
                        <FiCheckCircle size={12} />
                      ) : item.status === "shipped" ? (
                        <FiTruck size={12} />
                      ) : (
                        <FiClock size={12} />
                      )}
                    </span>

                    <span
                      className={styles.statusProductName}
                    >
                      {item.productName}
                    </span>
                  </div>

                  <span
                    className={`${styles.smallStatusBadge} ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {formatStatus(item.status)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div className={styles.summaryIcon}>
                <FiCalendar size={17} />
              </div>

              <h2 className={styles.summaryTitle}>
                Order Information
              </h2>
            </div>

            <div className={styles.infoList}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  <FiHash size={13} />
                  Order ID
                </span>

                <span className={styles.infoValue}>
                  {order._id}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  <FiCalendar size={13} />
                  Created
                </span>

                <span className={styles.infoValue}>
                  {formatDate(order.createdAt)}
                </span>
              </div>

              {order.updatedAt && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    <FiEdit3 size={13} />
                    Last Updated
                  </span>

                  <span className={styles.infoValue}>
                    {formatDateTime(order.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}