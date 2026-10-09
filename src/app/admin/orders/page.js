import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCreditCard,
  FiMail,
  FiPackage,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import { getAdminOrders } from "@/services/orderService";

import styles from "./AdminOrders.module.css";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderStatus(order) {
  if (!order.items || order.items.length === 0) {
    return "Pending";
  }

  const statuses = order.items.map((item) => item.status);

  if (statuses.every((status) => status === "delivered")) {
    return "Delivered";
  }

  if (statuses.every((status) => status === "cancelled")) {
    return "Cancelled";
  }

  if (statuses.some((status) => status === "shipped")) {
    return "Shipped";
  }

  if (statuses.some((status) => status === "confirmed")) {
    return "Confirmed"; 
  }

  return "Pending";
}

function getStatusClass(status) {
  switch (status.toLowerCase()) {
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

export default async function AdminOrdersPage({
  searchParams,
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  let result;

  try {
    result = await getAdminOrders({
      page,
      limit: 10,
    });
  } catch (error) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>
              ORDER MANAGEMENT
            </div>

            <h1 className={styles.title}>
              Orders
            </h1>

            <p className={styles.subtitle}>
              View and manage customer orders across ProductHub.
            </p>
          </div>
        </header>

        <section className={styles.errorState}>
          <div className={styles.errorIcon}>
            <FiShoppingBag size={22} />
          </div>

          <h2 className={styles.errorTitle}>
            Unable to load orders
          </h2>

          <p className={styles.errorText}>
            {error.message || "Failed to load orders"}
          </p>
        </section>
      </div>
    );
  }

  const orders = result?.data || [];
  const pagination = result?.pagination;

  const totalOrders =
    pagination?.total || orders.length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            ORDER MANAGEMENT
          </div>

          <h1 className={styles.title}>
            Orders
          </h1>

          <p className={styles.subtitle}>
            View and manage customer orders across ProductHub.
          </p>
        </div>

        <div className={styles.totalCard}>
          <div className={styles.totalIcon}>
            <FiShoppingBag size={18} />
          </div>

          <div>
            <span className={styles.totalLabel}>
              Total Orders
            </span>

            <strong className={styles.totalValue}>
              {totalOrders}
            </strong>
          </div>
        </div>
      </header>

      {orders.length === 0 ? (
        <section className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiShoppingBag size={25} />
          </div>

          <h2 className={styles.emptyTitle}>
            No orders yet
          </h2>

          <p className={styles.emptyText}>
            Customer orders will appear here once they are placed.
          </p>
        </section>
      ) : (
        <>
          <section className={styles.ordersSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  All Orders
                </h2>

                <p className={styles.sectionDescription}>
                  Orders currently available on the platform.
                </p>
              </div>

              {pagination && (
                <span className={styles.pageIndicator}>
                  Page {pagination.currentPage} of{" "}
                  {pagination.totalPages}
                </span>
              )}
            </div>

            <div className={styles.orderList}>
              {orders.map((order) => {
                const status = getOrderStatus(order);

                const customerName = order.userId
                  ? `${order.userId.firstName || ""} ${
                      order.userId.lastName || ""
                    }`.trim()
                  : "Unknown";

                const itemCount =
                  order.items?.length || 0;

                return (
                  <article
                    key={order._id}
                    className={styles.orderCard}
                  >
                    <div className={styles.orderHeader}>
                      <div className={styles.orderIdentity}>
                        <div className={styles.orderIcon}>
                          <FiPackage size={18} />
                        </div>

                        <div>
                          <span className={styles.orderLabel}>
                            ORDER
                          </span>

                          <h3 className={styles.orderId}>
                            #{order._id.slice(-8)}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`${styles.statusBadge} ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className={styles.orderDetails}>
                      <div className={styles.detail}>
                        <div className={styles.detailIcon}>
                          <FiUser size={15} />
                        </div>

                        <div className={styles.detailContent}>
                          <span className={styles.detailLabel}>
                            Customer
                          </span>

                          <strong className={styles.detailValue}>
                            {customerName || "Unknown"}
                          </strong>
                        </div>
                      </div>

                      <div className={styles.detail}>
                        <div className={styles.detailIcon}>
                          <FiMail size={15} />
                        </div>

                        <div className={styles.detailContent}>
                          <span className={styles.detailLabel}>
                            Email
                          </span>

                          <span className={styles.detailValue}>
                            {order.userId?.email || "Not available"}
                          </span>
                        </div>
                      </div>

                      <div className={styles.detail}>
                        <div className={styles.detailIcon}>
                          <FiPackage size={15} />
                        </div>

                        <div className={styles.detailContent}>
                          <span className={styles.detailLabel}>
                            Items
                          </span>

                          <strong className={styles.detailValue}>
                            {itemCount}{" "}
                            {itemCount === 1
                              ? "item"
                              : "items"}
                          </strong>
                        </div>
                      </div>

                      <div className={styles.detail}>
                        <div className={styles.detailIcon}>
                          <FiCreditCard size={15} />
                        </div>

                        <div className={styles.detailContent}>
                          <span className={styles.detailLabel}>
                            Payment
                          </span>

                          <strong className={styles.detailValue}>
                            {order.paymentMethod
                              ? order.paymentMethod.toUpperCase()
                              : "-"}
                          </strong>
                        </div>
                      </div>

                      <div className={styles.detail}>
                        <div className={styles.detailIcon}>
                          <FiCalendar size={15} />
                        </div>

                        <div className={styles.detailContent}>
                          <span className={styles.detailLabel}>
                            Ordered
                          </span>

                          <span className={styles.detailValue}>
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.orderFooter}>
                      <div>
                        <span className={styles.totalLabelSmall}>
                          Order Total
                        </span>

                        <strong className={styles.orderTotal}>
                          ₹
                          {Number(
                            order.totalPrice || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <Link
                        href={`/admin/orders/${order._id}`}
                        className={styles.viewButton}
                      >
                        View Order
                        <FiArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {pagination && pagination.totalPages > 1 && (
            <nav className={styles.pagination}>
              {page > 1 ? (
                <Link
                  href={`/admin/orders?page=${page - 1}`}
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

              <div className={styles.pageNumbers}>
                {Array.from(
                  {
                    length: pagination.totalPages,
                  },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={`/admin/orders?page=${pageNumber}`}
                    className={`${styles.pageNumber} ${
                      pageNumber === page
                        ? styles.activePage
                        : ""
                    }`}
                  >
                    {pageNumber}
                  </Link>
                ))}
              </div>

              {page < pagination.totalPages ? (
                <Link
                  href={`/admin/orders?page=${page + 1}`}
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