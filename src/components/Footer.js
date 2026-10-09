import Image from "next/image";
import Link from "next/link";
import {
  FiGithub,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <Link
              href="/"
              className={styles.logo}
              aria-label="ProductHub home"
            >
              <Image
                src="/ProductHub.png"
                alt="ProductHub"
                width={40}
                height={40}
                className={styles.logoImage}
              />

              <span className={styles.logoText}>
                Product<span>Hub</span>
              </span>
            </Link>

            <p className={styles.description}>
              A simple and modern marketplace for
              discovering and managing products.
            </p>
          </div>

          <div className={styles.navigation}>
            <h3>Explore</h3>

            <Link href="/products">
              Products
            </Link>
          </div>

          <div className={styles.socialSection}>
            <h3>Connect</h3>

            <div className={styles.socials}>
              <a
                href="#"
                aria-label="GitHub"
                className={styles.socialLink}
              >
                <FiGithub />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className={styles.socialLink}
              >
                <FiInstagram />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className={styles.socialLink}
              >
                <FiLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} ProductHub
          </span>

          <span>
            Built for a better shopping experience.
          </span>
        </div>
      </div>
    </footer>
  );
}