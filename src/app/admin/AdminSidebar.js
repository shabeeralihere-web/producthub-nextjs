"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiArrowLeft,
  FiBox,
  FiGrid,
  FiShoppingBag,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import styles from "./AdminSidebar.module.css";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: FiGrid,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: FiUsers,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: FiBox,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: FiShoppingBag,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: FiUser,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div className={styles.content}>
        <div className={styles.label}>ADMIN</div>

        <nav className={styles.navigation}>
          {links.map((link) => {
            const Icon = link.icon;

            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : link.href === "/admin/products"
                ? pathname === "/admin/products" ||
                  pathname.startsWith("/admin/products/edit/")
                : link.href === "/admin/orders"
                ? pathname === "/admin/orders" ||
                  pathname.startsWith("/admin/orders/")
                : pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${
                  isActive ? styles.active : ""
                }`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={styles.bottom}>
        <Link
          href="/products"
          className={styles.storeLink}
        >
          <FiArrowLeft size={17} />
          <span>Back to Store</span>
        </Link>
      </div>
    </div>
  );
}