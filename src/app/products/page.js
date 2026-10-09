import Link from "next/link";

import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import ProductCard from "@/components/products/ProductCard";

import { getProducts } from "@/services/productService";
import { getWishlist } from "@/services/wishlistService";

import SearchProducts from "./SearchProducts";

import styles from "./page.module.css";

export default async function ProductsPage({
  searchParams,
}) {
  const params = await searchParams;

  const page =
    Number(params?.page) || 1;

  const search =
    params?.search || "";

  const [
    productsResult,
    wishlistResult,
  ] = await Promise.all([
    getProducts({
      page,
      limit: 8,
      search,
    }),
    getWishlist(),
  ]);

  const products =
    productsResult.data || [];

  const wishlist =
    wishlistResult.data || [];

  /*
   * Pagination comes from the backend
   * inside the pagination object.
   */
  const totalPages =
    productsResult.pagination
      ?.totalPages || 1;

  const totalProducts =
    productsResult.pagination
      ?.totalProducts || 0;

  /*
   * Create a Set containing the IDs
   * of products already in the wishlist.
   */
  const wishlistProductIds =
    new Set(
      wishlist.map(
        (item) =>
          item.productId?._id ||
          item.productId
      )
    );

  /*
   * Preserve the search query when
   * changing pagination pages.
   */
  const createPageUrl = (
    pageNumber
  ) => {
    const query =
      new URLSearchParams();

    if (search) {
      query.set(
        "search",
        search
      );
    }

    if (pageNumber > 1) {
      query.set(
        "page",
        String(pageNumber)
      );
    }

    const queryString =
      query.toString();

    return queryString
      ? `/products?${queryString}`
      : "/products";
  };

  return (
    <main className={styles.page}>
      <div className="container py-4 py-md-5">
        <Breadcrumbs
          items={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Products",
            },
          ]}
        />

        <header
          className={styles.header}
        >
          <div>
            <span
              className={
                styles.eyebrow
              }
            >
              Marketplace
            </span>

            <h1
              className={styles.title}
            >
              Explore products
            </h1>

            <p
              className={
                styles.description
              }
            >
              Discover products
              available across the
              marketplace.
            </p>
          </div>

          <div
            className={
              styles.resultCount
            }
          >
            <strong>
              {totalProducts}
            </strong>

            <span>
              {search
                ? "matching products"
                : "products"}
            </span>
          </div>
        </header>

        <SearchProducts />

        {search && (
          <div
            className={
              styles.searchSummary
            }
          >
            <span>
              Showing results for{" "}
              <strong>
                "{search}"
              </strong>
            </span>

            <Link
              href="/products"
              className={
                styles.clearSearch
              }
            >
              Clear search
            </Link>
          </div>
        )}

        <section
          className={
            styles.productsSection
          }
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <h2
              className={
                styles.sectionTitle
              }
            >
              {search
                ? "Search results"
                : "All products"}
            </h2>

            <p
              className={
                styles.sectionSubtitle
              }
            >
              Browse available
              products and save your
              favorites to your
              wishlist.
            </p>
          </div>

          {products.length === 0 ? (
            <div
              className={
                styles.emptyState
              }
            >
              <div
                className={
                  styles.emptyIcon
                }
              >
                <FiSearch
                  aria-hidden="true"
                />
              </div>

              <h2>
                No products found
              </h2>

              <p>
                {search
                  ? "Try searching for a different product."
                  : "There are no products available right now."}
              </p>

              {search && (
                <Link
                  href="/products"
                  className={
                    styles.emptyButton
                  }
                >
                  View all products
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="row g-3 g-md-4">
                {products.map(
                  (product) => (
                    <div
                      key={
                        product._id
                      }
                      className="col-12 col-sm-6 col-lg-4 col-xl-3"
                    >
                      <ProductCard
                        product={
                          product
                        }
                        initialIsWishlisted={wishlistProductIds.has(
                          product._id
                        )}
                      />
                    </div>
                  )
                )}
              </div>

              {totalPages > 1 && (
                <nav
                  className={
                    styles.pagination
                  }
                  aria-label="Products pagination"
                >
                  <Link
                    href={createPageUrl(
                      page - 1
                    )}
                    className={`${styles.paginationButton} ${
                      page <= 1
                        ? styles.disabled
                        : ""
                    }`}
                    aria-disabled={
                      page <= 1
                    }
                  >
                    <FiChevronLeft
                      aria-hidden="true"
                    />

                    <span>
                      Previous
                    </span>
                  </Link>

                  <div
                    className={
                      styles.pageIndicator
                    }
                  >
                    <span
                      className={
                        styles.currentPage
                      }
                    >
                      {page}
                    </span>

                    <span
                      className={
                        styles.pageSeparator
                      }
                    >
                      /
                    </span>

                    <span>
                      {totalPages}
                    </span>
                  </div>

                  <Link
                    href={createPageUrl(
                      page + 1
                    )}
                    className={`${styles.paginationButton} ${
                      page >=
                      totalPages
                        ? styles.disabled
                        : ""
                    }`}
                    aria-disabled={
                      page >=
                      totalPages
                    }
                  >
                    <span>
                      Next
                    </span>

                    <FiChevronRight
                      aria-hidden="true"
                    />
                  </Link>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}