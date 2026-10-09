import LoginForm from "./LoginForm";

import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.loginCard}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>
              Welcome back
            </span>

            <h1 className={styles.title}>
              Sign in to your account
            </h1>

            <p className={styles.description}>
              Sign in to access your account and continue
              where you left off.
            </p>
          </div>

          <LoginForm />

          <div className={styles.signupPrompt}>
            <span>Don&apos;t have an account?</span>

            <a href="/signup">
              Create an account
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}