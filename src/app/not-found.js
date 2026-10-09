import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          ?
        </div>

        <p className={styles.code}>404</p>

        <h1 className={styles.title}>Page Not Found</h1>

        <p className={styles.message}>
          The page you're looking for doesn't exist or may have
          been moved.
        </p>

        <Link href="/products" className={styles.button}>
          Go to Products
        </Link>
      </div>
    </main>
  );
}