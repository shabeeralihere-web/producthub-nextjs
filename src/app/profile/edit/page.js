import { redirect } from "next/navigation";

import { getCurrentUser } from "@/services/authService";

import ProfileEditForm from "./ProfileEditForm";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

import styles from "./page.module.css";

export default async function EditProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Edit Profile",
    },
  ];

  return (
    <main className={styles.page}>
      <div className="container">
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.layout}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>
              Account
            </span>

            <h1 className={styles.title}>
              Edit Profile
            </h1>

            <p className={styles.description}>
              Update your personal information and keep
              your ProductHub profile up to date.
            </p>
          </header>

          <section className={styles.formCard}>
            <div className={styles.formHeader}>
              <div>
                <h2 className={styles.formTitle}>
                  Personal information
                </h2>

                <p className={styles.formDescription}>
                  Update the information associated with
                  your account.
                </p>
              </div>

              <div
                className={styles.profileBadge}
                aria-hidden="true"
              >
                {user.firstName?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.formWrapper}>
              <ProfileEditForm user={user} />
            </div>
          </section>

          <p className={styles.securityNote}>
            Your profile information is securely associated
            with your ProductHub account.
          </p>
        </div>
      </div>
    </main>
  );
}