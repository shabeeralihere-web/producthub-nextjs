"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] =
    useState(false);

  const [showSignOutModal, setShowSignOutModal] =
    useState(false);

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        !event.target.closest(
          `.${styles.profileArea}`
        )
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

  function isActive(path) {
    if (path === "/") {
      return pathname === "/";
    }

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    );
  }

  async function handleSignOut() {
    try {
      setIsSigningOut(true);

      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Sign out failed");
      }

      logout();

      setShowSignOutModal(false);
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Sign out error:",
        error
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  function NavLink({
    href,
    children,
    badge,
  }) {
    const active = isActive(href);

    return (
      <Link
        href={href}
        className={`${styles.navLink} ${
          active ? styles.active : ""
        }`}
      >
        <span>{children}</span>

        {badge > 0 && (
          <span className={styles.cartBadge}>
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </Link>
    );
  }

  const profileInitial =
    user?.firstName
      ?.charAt(0)
      ?.toUpperCase() || "U";

  const fullName =
    `${user?.firstName || ""} ${
      user?.lastName || ""
    }`.trim();

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.container}>
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
                priority
                className={styles.logoImage}
              />

              <span className={styles.logoText}>
                Product<span>Hub</span>
              </span>
            </Link>

            <div className={styles.desktopNavigation}>
              <div className={styles.navLinks}>
                {user?.role === "user" && (
                  <>
                    <NavLink href="/products">
                      Products
                    </NavLink>

                    <NavLink href="/orders">
                      Orders
                    </NavLink>

                    <NavLink
                      href="/cart"
                      badge={cartCount}
                    >
                      Cart
                    </NavLink>
                  </>
                )}

                {user?.role === "seller" && (
                  <>
                    <NavLink href="/products">
                      Products
                    </NavLink>

                    <NavLink href="/orders">
                      Orders
                    </NavLink>

                    <NavLink
                      href="/cart"
                      badge={cartCount}
                    >
                      Cart
                    </NavLink>

                    <NavLink href="/seller">
                      Dashboard
                    </NavLink>
                  </>
                )}

                {user?.role === "admin" && (
                  <NavLink href="/admin">
                    Dashboard
                  </NavLink>
                )}
              </div>

              <div className={styles.navActions}>
                {!user && (
                  <div className={styles.guestActions}>
                    <Link
                      href="/login"
                      className={styles.loginButton}
                    >
                      Login
                    </Link>

                    <Link
                      href="/signup"
                      className={styles.signupButton}
                    >
                      Sign up
                    </Link>
                  </div>
                )}

                {user && (
                  <div className={styles.profileArea}>
                    <div className={styles.profileControl}>
                      <button
                        type="button"
                        className={styles.profileMain}
                        onClick={() =>
                          router.push("/profile")
                        }
                        aria-label="Open profile"
                      >
                        {user.profileImage ? (
                          <Image
                            src={user.profileImage}
                            alt={
                              fullName ||
                              "Profile"
                            }
                            width={34}
                            height={34}
                            className={
                              styles.avatarImage
                            }
                          />
                        ) : (
                          <span
                            className={
                              styles.avatar
                            }
                          >
                            {profileInitial}
                          </span>
                        )}

                        <span
                          className={
                            styles.profileInfo
                          }
                        >
                          <span
                            className={
                              styles.profileName
                            }
                          >
                            {user.firstName ||
                              "Account"}
                          </span>

                          <span
                            className={
                              styles.profileRole
                            }
                          >
                            {user.role}
                          </span>
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`${styles.profileChevronButton} ${
                          isProfileMenuOpen
                            ? styles.profileChevronButtonOpen
                            : ""
                        }`}
                        onClick={(event) => {
                          event.stopPropagation();

                          setIsProfileMenuOpen(
                            (current) =>
                              !current
                          );
                        }}
                        aria-label="Open account menu"
                        aria-expanded={
                          isProfileMenuOpen
                        }
                      >
                        <span
                          className={
                            styles.chevron
                          }
                        >
                          ˅
                        </span>
                      </button>
                    </div>

                    <div
                      className={`${styles.profileDropdown} ${
                        isProfileMenuOpen
                          ? styles.profileDropdownOpen
                          : ""
                      }`}
                    >
                      <div
                        className={
                          styles.accountHeader
                        }
                      >
                        {user.profileImage ? (
                          <Image
                            src={user.profileImage}
                            alt={
                              fullName ||
                              "Profile"
                            }
                            width={44}
                            height={44}
                            className={
                              styles.dropdownAvatarImage
                            }
                          />
                        ) : (
                          <div
                            className={
                              styles.dropdownAvatar
                            }
                          >
                            {profileInitial}
                          </div>
                        )}

                        <div
                          className={
                            styles.accountDetails
                          }
                        >
                          <strong>
                            {fullName ||
                              "Account"}
                          </strong>

                          <span>
                            {user.email}
                          </span>

                          <span
                            className={
                              styles.roleBadge
                            }
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <div
                        className={
                          styles.dropdownDivider
                        }
                      />

                      <div
                        className={
                          styles.accountLinks
                        }
                      >
                        <Link
                          href="/profile"
                          className={
                            styles.accountLink
                          }
                          onClick={() =>
                            setIsProfileMenuOpen(
                              false
                            )
                          }
                        >
                          <span
                            className={
                              styles.accountLinkIcon
                            }
                          >
                            ◯
                          </span>

                          <span
                            className={
                              styles.accountLinkContent
                            }
                          >
                            <strong>
                              My Profile
                            </strong>

                            <small>
                              Manage your account
                            </small>
                          </span>

                          <span
                            className={
                              styles.accountLinkArrow
                            }
                          >
                            →
                          </span>
                        </Link>

                        {user.role !== "admin" && (
                          <>
                            <Link
                              href="/profile/wishlist"
                              className={
                                styles.accountLink
                              }
                              onClick={() =>
                                setIsProfileMenuOpen(
                                  false
                                )
                              }
                            >
                              <span
                                className={
                                  styles.accountLinkIcon
                                }
                              >
                                ♡
                              </span>

                              <span
                                className={
                                  styles.accountLinkContent
                                }
                              >
                                <strong>
                                  Wishlist
                                </strong>

                                <small>
                                  Your saved
                                  products
                                </small>
                              </span>

                              <span
                                className={
                                  styles.accountLinkArrow
                                }
                              >
                                →
                              </span>
                            </Link>

                            <Link
                              href="/profile/addresses"
                              className={
                                styles.accountLink
                              }
                              onClick={() =>
                                setIsProfileMenuOpen(
                                  false
                                )
                              }
                            >
                              <span
                                className={
                                  styles.accountLinkIcon
                                }
                              >
                                ◇
                              </span>

                              <span
                                className={
                                  styles.accountLinkContent
                                }
                              >
                                <strong>
                                  Addresses
                                </strong>

                                <small>
                                  Manage delivery
                                  addresses
                                </small>
                              </span>

                              <span
                                className={
                                  styles.accountLinkArrow
                                }
                              >
                                →
                              </span>
                            </Link>
                          </>
                        )}

                        {user.role === "seller" && (
                          <Link
                            href="/seller"
                            className={
                              styles.accountLink
                            }
                            onClick={() =>
                              setIsProfileMenuOpen(
                                false
                              )
                            }
                          >
                            <span
                              className={
                                styles.accountLinkIcon
                              }
                            >
                              □
                            </span>

                            <span
                              className={
                                styles.accountLinkContent
                              }
                            >
                              <strong>
                                Seller Dashboard
                              </strong>

                              <small>
                                Manage your store
                              </small>
                            </span>

                            <span
                              className={
                                styles.accountLinkArrow
                              }
                            >
                              →
                            </span>
                          </Link>
                        )}

                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            className={
                              styles.accountLink
                            }
                            onClick={() =>
                              setIsProfileMenuOpen(
                                false
                              )
                            }
                          >
                            <span
                              className={
                                styles.accountLinkIcon
                              }
                            >
                              □
                            </span>

                            <span
                              className={
                                styles.accountLinkContent
                              }
                            >
                              <strong>
                                Admin Dashboard
                              </strong>

                              <small>
                                Manage ProductHub
                              </small>
                            </span>

                            <span
                              className={
                                styles.accountLinkArrow
                              }
                            >
                              →
                            </span>
                          </Link>
                        )}
                      </div>

                      <div
                        className={
                          styles.dropdownDivider
                        }
                      />

                      <button
                        type="button"
                        className={
                          styles.signOutLink
                        }
                        onClick={() => {
                          setIsProfileMenuOpen(
                            false
                          );

                          setShowSignOutModal(
                            true
                          );
                        }}
                      >
                        <span
                          className={
                            styles.signOutIcon
                          }
                        >
                          ↪
                        </span>

                        <span>
                          Sign out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className={
                styles.mobileMenuButton
              }
              onClick={() =>
                setIsMobileMenuOpen(
                  (current) => !current
                )
              }
              aria-label="Toggle navigation menu"
              aria-expanded={
                isMobileMenuOpen
              }
            >
              <span
                className={
                  isMobileMenuOpen
                    ? styles.menuLineOpen
                    : ""
                }
              />

              <span
                className={
                  isMobileMenuOpen
                    ? styles.menuLineOpen
                    : ""
                }
              />

              <span
                className={
                  isMobileMenuOpen
                    ? styles.menuLineOpen
                    : ""
                }
              />
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className={styles.mobileMenu}>
              <div
                className={
                  styles.mobileMenuInner
                }
              >
                {!user && (
                  <>
                    <NavLink href="/login">
                      Login
                    </NavLink>

                    <Link
                      href="/signup"
                      className={
                        styles.mobileSignup
                      }
                    >
                      Sign up
                    </Link>
                  </>
                )}

                {user?.role !== "admin" &&
                  user && (
                    <>
                      <NavLink href="/products">
                        Products
                      </NavLink>

                      <NavLink href="/orders">
                        Orders
                      </NavLink>

                      <NavLink
                        href="/cart"
                        badge={cartCount}
                      >
                        Cart
                      </NavLink>
                    </>
                  )}

                {user?.role === "seller" && (
                  <NavLink href="/seller">
                    Dashboard
                  </NavLink>
                )}

                {user?.role === "admin" && (
                  <NavLink href="/admin">
                    Dashboard
                  </NavLink>
                )}

                {user && (
                  <>
                    <div
                      className={
                        styles.mobileDivider
                      }
                    />

                    <NavLink href="/profile">
                      My Profile
                    </NavLink>

                    {user.role !== "admin" && (
                      <>
                        <NavLink href="/profile/wishlist">
                          Wishlist
                        </NavLink>

                        <NavLink href="/profile/addresses">
                          Addresses
                        </NavLink>
                      </>
                    )}

                    <button
                      type="button"
                      className={
                        styles.mobileSignOut
                      }
                      onClick={() =>
                        setShowSignOutModal(
                          true
                        )
                      }
                    >
                      Sign out
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {showSignOutModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            if (!isSigningOut) {
              setShowSignOutModal(false);
            }
          }}
        >
          <div
            className={styles.signOutModal}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className={styles.modalIcon}>
              ↪
            </div>

            <h2>Sign out?</h2>

            <p>
              Are you sure you want to sign
              out of your ProductHub account?
            </p>

            <div
              className={styles.modalActions}
            >
              <button
                type="button"
                className={
                  styles.cancelButton
                }
                onClick={() =>
                  setShowSignOutModal(false)
                }
                disabled={isSigningOut}
              >
                Cancel
              </button>

              <button
                type="button"
                className={
                  styles.confirmSignOutButton
                }
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut
                  ? "Signing out..."
                  : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}