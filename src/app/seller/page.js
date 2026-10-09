import Link from "next/link";
import {
  FiArrowRight,
  FiBox,
  FiEdit3,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";

import {
  getMyProducts,
} from "@/services/productService";

import {
  getSellerOrders,
} from "@/services/orderService";

import styles from "./SellerDashboard.module.css";

export default async function SellerDashboardPage() {
  const [productsResult, ordersResult] =
    await Promise.all([
      getMyProducts({
        page: 1,
        limit: 5,
      }),
      getSellerOrders({
        page: 1,
        limit: 3,
      }),
    ]);

  const products = productsResult.data || [];
  const orders = ordersResult.data || [];

  const totalProducts =
    productsResult.pagination?.totalProducts || 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            SELLER PANEL
          </div>

          <h1 className={styles.title}>
            Dashboard
          </h1>

          <p className={styles.subtitle}>
            Welcome back. Manage your store from one place.
          </p>
        </div>

        <Link
          href="/seller/products/add"
          className={styles.primaryButton}
        >
          <FiPlus size={17} />
          Add Product
        </Link>
      </header>

      <section className={styles.overview}>
        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon}>
            <FiBox size={22} />
          </div>

          <div className={styles.overviewContent}>
            <span className={styles.overviewLabel}>
              My Products
            </span>

            <strong className={styles.overviewValue}>
              {totalProducts}
            </strong>

            <span className={styles.overviewText}>
              Products in your store
            </span>
          </div>

          <Link
            href="/seller/products"
            className={styles.overviewLink}
          >
            Manage
            <FiArrowRight size={15} />
          </Link>
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon}>
            <FiShoppingBag size={22} />
          </div>

          <div className={styles.overviewContent}>
            <span className={styles.overviewLabel}>
              Orders
            </span>

            <strong className={styles.overviewValue}>
              {orders.length}
            </strong>

            <span className={styles.overviewText}>
              Recent orders shown
            </span>
          </div>

          <Link
            href="/seller/orders"
            className={styles.overviewLink}
          >
            View orders
            <FiArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              Your Products
            </h2>

            <p className={styles.sectionDescription}>
              Recently added products from your store.
            </p>
          </div>

          <Link
            href="/seller/products"
            className={styles.textLink}
          >
            View all
            <FiArrowRight size={15} />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiBox size={24} />
            </div>

            <h3 className={styles.emptyTitle}>
              No products yet
            </h3>

            <p className={styles.emptyText}>
              Add your first product to start building your store.
            </p>

            <Link
              href="/seller/products/add"
              className={styles.primaryButton}
            >
              <FiPlus size={17} />
              Add Product
            </Link>
          </div>
        ) : (
          <div className={styles.productList}>
            {products.map((product) => (
              <div
                key={product._id}
                className={styles.productRow}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />

                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>
                    {product.name}
                  </h3>

                  <div className={styles.productMeta}>
                    <span>
                      {product.category}
                    </span>

                    <span className={styles.productPrice}>
                      ₹
                      {Number(product.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/seller/products/edit/${product._id}`}
                  className={styles.editButton}
                >
                  <FiEdit3 size={14} />
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              Recent Orders
            </h2>

            <p className={styles.sectionDescription}>
              Orders containing your products.
            </p>
          </div>

          <Link
            href="/seller/orders"
            className={styles.textLink}
          >
            View all
            <FiArrowRight size={15} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className={styles.orderEmpty}>
            <FiShoppingBag size={22} />

            <span>
              No orders containing your products yet.
            </span>
          </div>
        ) : (
          <div className={styles.orderList}>
            {orders.map((order) => (
              <div
                key={order._id}
                className={styles.orderRow}
              >
                <div className={styles.orderMain}>
                  <span className={styles.orderId}>
                    Order #{order._id.slice(-8)}
                  </span>

                  <span className={styles.orderDate}>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className={styles.orderProducts}>
                  {order.items?.length || 0} product
                  {order.items?.length === 1
                    ? ""
                    : "s"}
                </div>

                <div className={styles.orderTotal}>
                  ₹
                  {Number(
                    order.totalPrice
                  ).toFixed(2)}
                </div>

                <Link
                  href="/seller/orders"
                  className={styles.orderLink}
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              Store Management
            </h2>

            <p className={styles.sectionDescription}>
              Manage the important parts of your seller account.
            </p>
          </div>
        </div>

        <div className={styles.managementGrid}>
          <Link
            href="/seller/products"
            className={styles.managementCard}
          >
            <div className={styles.managementIcon}>
              <FiBox size={20} />
            </div>

            <div>
              <h3>Manage Products</h3>

              <p>
                View, edit and delete your products.
              </p>
            </div>

            <FiArrowRight
              size={17}
              className={styles.managementArrow}
            />
          </Link>

          <Link
            href="/seller/products/add"
            className={styles.managementCard}
          >
            <div className={styles.managementIcon}>
              <FiPlus size={20} />
            </div>

            <div>
              <h3>Add Product</h3>

              <p>
                Add a new product to your store.
              </p>
            </div>

            <FiArrowRight
              size={17}
              className={styles.managementArrow}
            />
          </Link>

          <Link
            href="/seller/orders"
            className={styles.managementCard}
          >
            <div className={styles.managementIcon}>
              <FiShoppingBag size={20} />
            </div>

            <div>
              <h3>Manage Orders</h3>

              <p>
                Review orders and update item status.
              </p>
            </div>

            <FiArrowRight
              size={17}
              className={styles.managementArrow}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}