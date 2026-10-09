import Link from "next/link";
import styles from "./page.module.css";

export default function UnauthorizedPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          !
        </div>

        <p className={styles.code}>403</p>

        <h1 className={styles.title}>Access Denied</h1>

        <p className={styles.message}>
          You don't have permission to access this page.
        </p>

        <Link href="/products" className={styles.button}>
          Go to Products
        </Link>
      </div>
    </main>
  );
}
