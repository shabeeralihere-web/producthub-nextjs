import { redirect } from "next/navigation";

import SellerSidebar from "./SellerSidebar";
import { requireSeller } from "@/lib/authorization";

import styles from "./SellerLayout.module.css";

export default async function SellerLayout({ children }) {
  const { authorized, reason } = await requireSeller();

  if (!authorized) {
    if (reason === "unauthenticated") {
      redirect("/login");
    }

    redirect("/unauthorized");
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebarColumn}>
        <SellerSidebar />
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}