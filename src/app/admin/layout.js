import { redirect } from "next/navigation";

import AdminSidebar from "./AdminSidebar";
import { requireAdmin } from "@/lib/authorization";

import styles from "./AdminLayout.module.css";

export default async function AdminLayout({ children }) {
  const { authorized, reason } = await requireAdmin();

  if (!authorized) {
    if (reason === "unauthenticated") {
      redirect("/login");
    }

    redirect("/unauthorized");
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebarColumn}>
        <AdminSidebar />
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}