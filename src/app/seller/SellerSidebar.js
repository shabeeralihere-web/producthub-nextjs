"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiArrowLeft,
  FiBox,
  FiGrid,
  FiPlus,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import styles from "./SellerSidebar.module.css";

const links = [
  {
    href: "/seller",
    label: "Dashboard",
    icon: FiGrid,
  },
  {
    href: "/seller/products",
    label: "My Products",
    icon: FiBox,
  },
  {
    href: "/seller/products/add",
    label: "Add Product",
    icon: FiPlus,
  },
  {
    href: "/seller/orders",
    label: "Orders",
    icon: FiShoppingBag,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: FiUser,
  },
];

export default function SellerSidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div className={styles.content}>
        <div className={styles.label}>SELLER</div>

        <nav className={styles.navigation}>
          {links.map((link) => {
            const Icon = link.icon;

            const isActive =
              link.href === "/seller"
                ? pathname === "/seller"
                : pathname === link.href ||
                  (link.href === "/seller/products" &&
                    pathname.startsWith(
                      "/seller/products/edit"
                    ));

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