import { redirect } from "next/navigation";

import { getCurrentUser } from "@/services/authService";
import { getAddresses } from "@/services/addressService";

import AddressForm from "./AddressForm";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

import styles from "./page.module.css";

export default async function AddAddressPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let addresses = [];

  try {
    const result = await getAddresses();

    addresses = result?.data || [];
  } catch (error) {
    console.error(
      "Failed to load addresses:",
      error
    );
  }

  // ProductHub currently allows a maximum
  // of two saved addresses.
  if (addresses.length >= 2) {
    redirect("/profile/addresses");
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
      label: "Addresses",
      href: "/profile/addresses",
    },
    {
      label: "Add Address",
    },
  ];

  return (
    <main className={styles.page}>
      <div className="container">
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.layout}>
          {/* Page introduction */}
          <header className={styles.header}>
            <span className={styles.eyebrow}>
              Delivery
            </span>

            <h1 className={styles.title}>
              Add an address
            </h1>

            <p className={styles.description}>
              Save your delivery details for a faster
              checkout experience.
            </p>
          </header>

          {/* Form */}
          <div className={styles.formContainer}>
            <AddressForm />
          </div>

          {/* Account note */}
          <div className={styles.note}>
            <div className={styles.noteIndicator} />

            <div>
              <strong>
                Your address is private
              </strong>

              <p>
                Your saved delivery details are only
                associated with your ProductHub account
                and can be updated later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}