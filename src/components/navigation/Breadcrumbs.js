import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export default function Breadcrumbs({ items }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={styles.breadcrumbs}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className={styles.item}
            >
              {!isLast && item.href ? (
                <>
                  <Link
                    href={item.href}
                    className={styles.link}
                  >
                    {item.label}
                  </Link>

                  <span
                    className={styles.separator}
                    aria-hidden="true"
                  >
                    /
                  </span>
                </>
              ) : (
                <span
                  className={styles.current}
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}