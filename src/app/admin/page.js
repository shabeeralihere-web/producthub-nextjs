import Link from "next/link";
import {
  FiArrowRight,
  FiBox,
  FiShield,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

import {
  getAllProducts,
  getAllUsers,
} from "@/services/adminService";

import styles from "./AdminDashboard.module.css";

export default async function AdminDashboardPage() {
  const [usersResult, productsResult] = await Promise.all([
    getAllUsers(),
    getAllProducts({
      page: 1,
      limit: 5,
    }),
  ]);

  const users = usersResult.data || [];
  const products = productsResult.data || [];

  const totalUsers = users.length;

  const totalSellers = users.filter(
    (user) => user.role === "seller"
  ).length;

  const totalProducts =
    productsResult.pagination?.totalProducts || 0;

  const overview = [
    {
      label: "Total Users",
      value: totalUsers,
      description: "Registered accounts",
      icon: FiUsers,
      href: "/admin/users",
    },
    {
      label: "Sellers",
      value: totalSellers,
      description: "Seller accounts",
      icon: FiShoppingBag,
      href: "/admin/users",
    },
    {
      label: "Products",
      value: totalProducts,
      description: "Products listed",
      icon: FiBox,
      href: "/admin/products",
    },
  ];

  return (
    <div className={styles.adminDashboard}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            ADMIN PANEL
          </div>

          <h1 className={styles.title}>
            Dashboard
          </h1>

          <p className={styles.subtitle}>
            Monitor and manage your ProductHub platform.
          </p>
        </div>
      </header>

      <section className={styles.overviewGrid}>
        {overview.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={styles.overviewCard}
            >
              <div className={styles.overviewTop}>
                <div className={styles.overviewIcon}>
                  <Icon size={19} />
                </div>

                <FiArrowRight
                  size={15}
                  className={styles.overviewArrow}
                />
              </div>

              <div className={styles.overviewLabel}>
                {item.label}
              </div>

              <div className={styles.overviewValue}>
                {item.value}
              </div>

              <div className={styles.overviewDescription}>
                {item.description}
              </div>
            </Link>
          );
        })}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              Quick Actions
            </h2>

            <p className={styles.sectionDescription}>
              Access the main areas of your admin panel.
            </p>
          </div>
        </div>

        <div className={styles.actionGrid}>
          <Link
            href="/admin/users"
            className={styles.actionCard}
          >
            <div className={styles.actionIcon}>
              <FiUsers size={20} />
            </div>

            <div className={styles.actionContent}>
              <h3 className={styles.actionTitle}>
                Manage Users
              </h3>

              <p className={styles.actionDescription}>
                View and manage registered users and sellers.
              </p>
            </div>

            <FiArrowRight
              size={17}
              className={styles.actionArrow}
            />
          </Link>

          <Link
            href="/admin/products"
            className={styles.actionCard}
          >
            <div className={styles.actionIcon}>
              <FiBox size={20} />
            </div>

            <div className={styles.actionContent}>
              <h3 className={styles.actionTitle}>
                Manage Products
              </h3>

              <p className={styles.actionDescription}>
                View, edit and remove listed products.
              </p>
            </div>

            <FiArrowRight
              size={17}
              className={styles.actionArrow}
            />
          </Link>

          <Link
            href="/admin/orders"
            className={styles.actionCard}
          >
            <div className={styles.actionIcon}>
              <FiShoppingBag size={20} />
            </div>

            <div className={styles.actionContent}>
              <h3 className={styles.actionTitle}>
                Manage Orders
              </h3>

              <p className={styles.actionDescription}>
                Review platform orders and order activity.
              </p>
            </div>

            <FiArrowRight
              size={17}
              className={styles.actionArrow}
            />
          </Link>

          <Link
            href="/profile"
            className={styles.actionCard}
          >
            <div className={styles.actionIcon}>
              <FiShield size={20} />
            </div>

            <div className={styles.actionContent}>
              <h3 className={styles.actionTitle}>
                Admin Profile
              </h3>

              <p className={styles.actionDescription}>
                View and manage your administrator profile.
              </p>
            </div>

            <FiArrowRight
              size={17}
              className={styles.actionArrow}
            />
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              Recent Products
            </h2>

            <p className={styles.sectionDescription}>
              Recently listed products on the platform.
            </p>
          </div>

          <Link
            href="/admin/products"
            className={styles.viewAll}
          >
            View all
            <FiArrowRight size={15} />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiBox size={22} />
            </div>

            <h3 className={styles.emptyTitle}>
              No products available
            </h3>

            <p className={styles.emptyText}>
              Products will appear here once they are added.
            </p>
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
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/admin/products/edit/${product._id}`}
                  className={styles.editButton}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}