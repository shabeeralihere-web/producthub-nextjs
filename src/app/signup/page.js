import SignupForm from "./SignupForm";

import styles from "./page.module.css";

export default function SignupPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.signupCard}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>
              Get started
            </span>

            <h1 className={styles.title}>
              Create your account
            </h1>

            <p className={styles.description}>
              Create an account to start using the
              marketplace.
            </p>
          </div>

          <SignupForm />

          <div className={styles.loginPrompt}>
            <span>Already have an account?</span>

            <a href="/login">Sign in</a>
          </div>
        </section>
      </div>
    </main>
  );
}