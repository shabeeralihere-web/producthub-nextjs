import { redirect } from "next/navigation";

import { getAddresses } from "@/services/addressService";
import { requireCustomerAccount } from "@/lib/authorization";

import ProfileSidebar from "@/components/profile/ProfileSidebar";
import SavedAddresses from "@/components/profile/SavedAddresses";

import styles from "./page.module.css";

export default async function SavedAddressesPage() {
  const { authorized, reason } =
    await requireCustomerAccount();

  if (!authorized) {
    if (reason === "unauthenticated") {
      redirect("/login");
    }

    redirect("/unauthorized");
  }

  let addresses = [];

  try {
    const result = await getAddresses();

    addresses = result?.data || [];
  } catch (error) {
    console.error(
      "Failed to load saved addresses:",
      error
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        {/* Page heading */}
        <div className={styles.pageHeader}>
          <span className={styles.eyebrow}>
            Account
          </span>

          <h1 className={styles.title}>
            Saved Addresses
          </h1>

          <p className={styles.subtitle}>
            Manage the addresses you use for your
            ProductHub orders.
          </p>
        </div>

        <div className="row g-4">
          {/* Account sidebar */}
          <div className="col-12 col-lg-3">
            <ProfileSidebar />
          </div>

          {/* Addresses */}
          <div className="col-12 col-lg-9">
            <div className={styles.content}>
              <SavedAddresses
                initialAddresses={addresses}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}