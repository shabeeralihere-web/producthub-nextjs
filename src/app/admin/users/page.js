import { FiShield, FiShoppingBag, FiUser, FiUsers } from "react-icons/fi";

import { getAllUsers } from "@/services/adminService";

import styles from "./AdminUsers.module.css";

function UserCard({ user }) {
  const fullName = `${user.firstName} ${user.lastName}`;

  const roleLabel =
    user.role === "admin"
      ? "Administrator"
      : user.role === "seller"
      ? "Seller"
      : "Customer";

  const RoleIcon =
    user.role === "admin"
      ? FiShield
      : user.role === "seller"
      ? FiShoppingBag
      : FiUser;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className={styles.userCard}>
      <div className={styles.userIdentity}>
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={fullName}
            className={styles.avatarImage}
          />
        ) : (
          <div className={styles.avatar}>
            {user.firstName?.charAt(0).toUpperCase()}
            {user.lastName?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{fullName}</h3>
          <p className={styles.userEmail}>{user.email}</p>
        </div>
      </div>

      <div className={styles.userDetails}>
        <span
          className={`${styles.roleBadge} ${
            user.role === "admin"
              ? styles.adminBadge
              : user.role === "seller"
              ? styles.sellerBadge
              : styles.customerBadge
          }`}
        >
          <RoleIcon size={13} />
          {roleLabel}
        </span>

        {joinedDate && (
          <span className={styles.joinedDate}>
            Joined {joinedDate}
          </span>
        )}
      </div>
    </article>
  );
}

function UserSection({
  title,
  description,
  icon: Icon,
  users,
  emptyMessage,
  sectionClass,
}) {
  return (
    <section className={styles.userSection}>
      <div className={styles.sectionHeader}>
        <div className={`${styles.sectionIcon} ${sectionClass}`}>
          <Icon size={18} />
        </div>

        <div>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.sectionDescription}>
            {description}
          </p>
        </div>

        <span className={styles.sectionCount}>
          {users.length}
        </span>
      </div>

      {users.length === 0 ? (
        <div className={styles.emptySection}>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className={styles.userGrid}>
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function AdminUsersPage() {
  const result = await getAllUsers();
  const users = result.data || [];

  const customers = users.filter(
    (user) => user.role === "user"
  );

  const sellers = users.filter(
    (user) => user.role === "seller"
  );

  const admins = users.filter(
    (user) => user.role === "admin"
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            ACCOUNT MANAGEMENT
          </div>

          <h1 className={styles.title}>
            Users
          </h1>

          <p className={styles.subtitle}>
            View and understand everyone using the ProductHub platform.
          </p>
        </div>
      </header>

      <section className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.overviewIcon}>
            <FiUsers size={19} />
          </div>

          <div>
            <span className={styles.overviewLabel}>
              Total Accounts
            </span>

            <strong className={styles.overviewValue}>
              {users.length}
            </strong>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={`${styles.overviewIcon} ${styles.customerIcon}`}>
            <FiUser size={19} />
          </div>

          <div>
            <span className={styles.overviewLabel}>
              Customers
            </span>

            <strong className={styles.overviewValue}>
              {customers.length}
            </strong>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={`${styles.overviewIcon} ${styles.sellerIcon}`}>
            <FiShoppingBag size={19} />
          </div>

          <div>
            <span className={styles.overviewLabel}>
              Sellers
            </span>

            <strong className={styles.overviewValue}>
              {sellers.length}
            </strong>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <div className={`${styles.overviewIcon} ${styles.adminIcon}`}>
            <FiShield size={19} />
          </div>

          <div>
            <span className={styles.overviewLabel}>
              Administrators
            </span>

            <strong className={styles.overviewValue}>
              {admins.length}
            </strong>
          </div>
        </div>
      </section>

      <UserSection
        title="Customers"
        description="People using ProductHub to browse and purchase products."
        icon={FiUser}
        users={customers}
        emptyMessage="No customer accounts yet."
        sectionClass={styles.customerSectionIcon}
      />

      <UserSection
        title="Sellers"
        description="Accounts that can list and manage products."
        icon={FiShoppingBag}
        users={sellers}
        emptyMessage="No seller accounts yet."
        sectionClass={styles.sellerSectionIcon}
      />

      <UserSection
        title="Administrators"
        description="Accounts with platform administration access."
        icon={FiShield}
        users={admins}
        emptyMessage="No additional administrator accounts."
        sectionClass={styles.adminSectionIcon}
      />
    </div>
  );
}