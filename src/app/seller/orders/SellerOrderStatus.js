"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./SellerOrders.module.css";

const statuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function SellerOrderStatus({
  orderId,
  itemId,
  currentStatus,
}) {
  const router = useRouter();

  const [status, setStatus] = useState(
    currentStatus
  );

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [error, setError] = useState("");

  async function handleChange(event) {
    const newStatus = event.target.value;

    try {
      setError("");
      setIsUpdating(true);

      const response = await fetch(
        `/api/orders/${orderId}/items/${itemId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to update status"
        );
        return;
      }

      setStatus(newStatus);

      router.refresh();
    } catch (error) {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className={styles.statusWrapper}>
      <label className={styles.statusLabel}>
        Product status
      </label>

      <select
        value={status}
        onChange={handleChange}
        disabled={isUpdating}
        className={styles.statusSelect}
        aria-label="Product order status"
      >
        {statuses.map((itemStatus) => (
          <option
            key={itemStatus}
            value={itemStatus}
          >
            {statusLabels[itemStatus]}
          </option>
        ))}
      </select>

      {isUpdating && (
        <span className={styles.statusUpdating}>
          Updating...
        </span>
      )}

      {error && (
        <span className={styles.statusError}>
          {error}
        </span>
      )}
    </div>
  );
}