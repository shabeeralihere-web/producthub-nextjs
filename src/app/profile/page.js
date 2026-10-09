import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FiEdit2,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";

import { getCurrentUser } from "@/services/authService";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

import styles from "./page.module.css";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const showProfileSidebar =
    user.role === "user" || user.role === "seller";

  const fullName = `${user.firstName || ""} ${
    user.lastName || ""
  }`.trim();

  const initials =
    `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();

  return (
    <main className={styles.page}>
      <div className="container">
        {/* Page heading */}
        <div className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>
              Account
            </span>

            <h1 className={styles.title}>
              My Profile
            </h1>

            <p className={styles.subtitle}>
              Manage your personal information and account
              details.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          {showProfileSidebar && (
            <div className="col-12 col-lg-3">
              <ProfileSidebar />
            </div>
          )}

          {/* Main content */}
          <div
            className={
              showProfileSidebar
                ? "col-12 col-lg-9"
                : "col-12"
            }
          >
            {/* Profile header card */}
            <section className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.profileIdentity}>
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={fullName}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarFallback}>
                      {initials || <FiUser size={30} />}
                    </div>
                  )}

                  <div className={styles.identityContent}>
                    <h2>{fullName || "User"}</h2>

                    <div className={styles.identityMeta}>
                      <span>
                        <FiMail size={14} />
                        {user.email}
                      </span>

                      <span className={styles.roleBadge}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/profile/edit"
                  className={styles.editButton}
                >
                  <FiEdit2 size={15} />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </section>

            {/* Personal information */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Personal Information</h2>

                  <p>
                    Your basic personal information.
                  </p>
                </div>

                <FiUser
                  className={styles.sectionIcon}
                  size={20}
                />
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    First Name
                  </span>

                  <span className={styles.infoValue}>
                    {user.firstName || "Not provided"}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    Last Name
                  </span>

                  <span className={styles.infoValue}>
                    {user.lastName || "Not provided"}
                  </span>
                </div>
              </div>

              <div className={styles.bioBlock}>
                <span className={styles.infoLabel}>
                  Bio
                </span>

                <p className={styles.bio}>
                  {user.bio || "No bio added yet."}
                </p>
              </div>
            </section>

            {/* Account information */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Account Information</h2>

                  <p>
                    Information related to your ProductHub
                    account.
                  </p>
                </div>

                <FiShield
                  className={styles.sectionIcon}
                  size={20}
                />
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    Email Address
                  </span>

                  <span className={styles.infoValue}>
                    {user.email}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    Account Type
                  </span>

                  <span
                    className={`${styles.infoValue} ${styles.capitalize}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}