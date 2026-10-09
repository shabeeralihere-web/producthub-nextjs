import Link from "next/link";
import {
  FiArrowLeft,
  FiCalendar,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import { getSellerOrders } from "@/services/orderService";
import SellerOrderStatus from "./SellerOrderStatus";

import styles from "./SellerOrders.module.css";

const paymentLabels = {
  cod: "Cash on Delivery",
  upi: "UPI",
  card: "Card",
  netbanking: "Net Banking",
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SellerOrdersPage({
  searchParams,
}) {
  const params = await searchParams;

  const page = Math.max(Number(params.page) || 1, 1);

  const result = await getSellerOrders({
    page,
    limit: 6,
  });

  const orders = result.data || [];
  const pagination = result.pagination;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            STORE MANAGEMENT
          </div>

          <h1 className={styles.title}>Orders</h1>

          <p className={styles.subtitle}>
            View customers, products and order details from your store.
          </p>
        </div>

        <Link
          href="/seller"
          className={styles.backLink}
        >
          <FiArrowLeft size={16} />
          Dashboard
        </Link>
      </header>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiPackage size={24} />
          </div>

          <h2 className={styles.emptyTitle}>
            No orders yet
          </h2>

          <p className={styles.emptyText}>
            Orders containing your products will appear here.
          </p>
        </div>
      ) : (
        <div className={styles.orders}>
          {orders.map((order) => (
            <article
              key={order._id}
              className={styles.orderCard}
            >
              <div className={styles.orderHeader}>
                <div className={styles.orderIdentity}>
                  <div className={styles.orderLabel}>
                    ORDER
                  </div>

                  <h2 className={styles.orderId}>
                    #{order._id.slice(-10).toUpperCase()}
                  </h2>

                  <div className={styles.date}>
                    <FiCalendar size={14} />

                    <span>
                      {formatDate(order.createdAt)}
                    </span>

                    <span className={styles.dateDivider}>
                      •
                    </span>

                    <span>
                      {formatTime(order.createdAt)}
                    </span>
                  </div>
                </div>

                <div className={styles.total}>
                  <span className={styles.totalLabel}>
                    Your total
                  </span>

                  <strong>
                    ₹{Number(order.totalPrice).toFixed(2)}
                  </strong>
                </div>
              </div>

              <div className={styles.orderBody}>
                <section className={styles.infoGrid}>
                  <div className={styles.infoCard}>
                    <div className={styles.infoIcon}>
                      <FiUser size={17} />
                    </div>

                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        CUSTOMER
                      </span>

                      <strong className={styles.customerName}>
                        {order.deliveryAddress.fullName}
                      </strong>

                      <a
                        href={`tel:${order.deliveryAddress.phone}`}
                        className={styles.phone}
                      >
                        <FiPhone size={13} />
                        {order.deliveryAddress.phone}
                      </a>
                    </div>
                  </div>

                  <div className={styles.infoCard}>
                    <div className={styles.infoIcon}>
                      <FiMapPin size={17} />
                    </div>

                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        DELIVERY ADDRESS
                      </span>

                      <strong className={styles.addressName}>
                        {order.deliveryAddress.fullName}
                      </strong>

                      <p className={styles.address}>
                        {order.deliveryAddress.address},{" "}
                        {order.deliveryAddress.city},{" "}
                        {order.deliveryAddress.state} -{" "}
                        {order.deliveryAddress.pinCode}
                      </p>
                    </div>
                  </div>

                  <div className={styles.infoCard}>
                    <div className={styles.infoIcon}>
                      <FiCreditCard size={17} />
                    </div>

                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        PAYMENT METHOD
                      </span>

                      <strong className={styles.payment}>
                        {paymentLabels[order.paymentMethod] ||
                          order.paymentMethod}
                      </strong>
                    </div>
                  </div>
                </section>

                <section className={styles.productsSection}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <h3 className={styles.sectionTitle}>
                        Products
                      </h3>

                      <p className={styles.sectionDescription}>
                        {order.items.length} product
                        {order.items.length === 1 ? "" : "s"} in this order
                      </p>
                    </div>
                  </div>

                  <div className={styles.productList}>
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className={styles.productRow}
                      >
                        <div className={styles.productMain}>
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className={styles.productImage}
                          />

                          <div className={styles.productDetails}>
                            <h4 className={styles.productName}>
                              {item.productName}
                            </h4>

                            <div className={styles.productMeta}>
                              <span>
                                ₹{Number(item.price).toFixed(2)} each
                              </span>

                              <span className={styles.metaDivider}>
                                •
                              </span>

                              <span>
                                Quantity: {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.productPricing}>
                          <span className={styles.itemLabel}>
                            Item total
                          </span>

                          <strong className={styles.itemTotal}>
                            ₹{Number(item.totalPrice).toFixed(2)}
                          </strong>
                        </div>

                        <div className={styles.statusArea}>
                          <SellerOrderStatus
                            orderId={order._id}
                            itemId={item._id}
                            currentStatus={item.status}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className={styles.orderFooter}>
                  <span>Seller order total</span>

                  <strong>
                    ₹{Number(order.totalPrice).toFixed(2)}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          {pagination.currentPage > 1 ? (
            <Link
              href={`/seller/orders?page=${
                pagination.currentPage - 1
              }`}
              className={styles.paginationButton}
            >
              Previous
            </Link>
          ) : (
            <button
              type="button"
              className={styles.paginationButton}
              disabled
            >
              Previous
            </button>
          )}

          <span className={styles.pageNumber}>
            Page {pagination.currentPage} of{" "}
            {pagination.totalPages}
          </span>

          {pagination.currentPage <
          pagination.totalPages ? (
            <Link
              href={`/seller/orders?page=${
                pagination.currentPage + 1
              }`}
              className={styles.paginationButton}
            >
              Next
            </Link>
          ) : (
            <button
              type="button"
              className={styles.paginationButton}
              disabled
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}