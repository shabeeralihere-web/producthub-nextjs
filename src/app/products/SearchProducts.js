"use client";

import { useEffect, useRef, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { FiSearch } from "react-icons/fi";

import styles from "./page.module.css";

export default function SearchProducts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch =
    searchParams.get("search") || "";

  const [search, setSearch] =
    useState(currentSearch);

  const previousSearch = useRef(
    currentSearch
  );

  useEffect(() => {
    if (
      currentSearch !==
      previousSearch.current
    ) {
      setSearch(currentSearch);

      previousSearch.current =
        currentSearch;
    }
  }, [currentSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmedSearch =
        search.trim();

      const currentSearch =
        searchParams.get("search") || "";

      if (
        trimmedSearch === currentSearch
      ) {
        return;
      }

      const params = new URLSearchParams(
        searchParams.toString()
      );

      if (trimmedSearch) {
        params.set(
          "search",
          trimmedSearch
        );
      } else {
        params.delete("search");
      }

      params.delete("page");

      const queryString =
        params.toString();

      const nextUrl = queryString
        ? `${pathname}?${queryString}`
        : pathname;

      router.replace(nextUrl);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    search,
    pathname,
    router,
    searchParams,
  ]);

  return (
    <section
      className={styles.searchSection}
    >
      <div
        className={styles.searchForm}
      >
        <FiSearch
          className={styles.searchIcon}
          aria-hidden="true"
        />

        <input
          type="search"
          name="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search products..."
          className={
            styles.searchInput
          }
          aria-label="Search products"
        />
      </div>
    </section>
  );
}