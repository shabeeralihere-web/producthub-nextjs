"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHeart,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

import styles from "./ProfileSidebar.module.css";

export default function ProfileSidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/profile",
      label: "My Profile",
      icon: FiUser,
    },
    {
      href: "/profile/addresses",
      label: "Saved Addresses",
      icon: FiMapPin,
    },
    {
      href: "/profile/wishlist",
      label: "Wishlist",
      icon: FiHeart,
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.heading}>
        <span>Account</span>
        <p>Manage your account</p>
      </div>

      <nav className={styles.navigation}>
        {links.map((link) => {
          const Icon = link.icon;

          const isActive =
            link.href === "/profile"
              ? pathname === "/profile"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${
                isActive ? styles.active : ""
              }`}
            >
              <span className={styles.linkIcon}>
                <Icon size={17} />
              </span>

              <span className={styles.linkLabel}>
                {link.label}
              </span>

              {isActive && (
                <span className={styles.activeIndicator} />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}