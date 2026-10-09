"use client";

import { useState } from "react";
import {
  FiEdit2,
  FiHome,
  FiLoader,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import AddressForm from "./AddressForm";
import styles from "./SavedAddresses.module.css";

const MAX_ADDRESSES = 2;

export default function SavedAddresses({ initialAddresses = [] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const canAddAddress = addresses.length < MAX_ADDRESSES;

  const handleAddClick = () => {
    setError("");
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setError("");
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSaved = (savedAddress) => {
    setError("");

    if (!savedAddress) return;

    if (editingAddress) {
      setAddresses((current) =>
        current.map((address) =>
          address._id === savedAddress._id ? savedAddress : address
        )
      );
    } else {
      setAddresses((current) => [savedAddress, ...current]);
    }

    setEditingAddress(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setShowForm(false);
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    setError("");
    setDeletingId(id);

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete address");
      }

      setAddresses((current) =>
        current.filter((address) => address._id !== id)
      );

      if (editingAddress?._id === id) {
        handleCancel();
      }
    } catch (error) {
      setError(error.message || "Unable to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div>
          <div className={styles.sectionLabel}>DELIVERY</div>

          <h2 className={styles.heading}>Your addresses</h2>

          <p className={styles.description}>
            Keep your delivery details ready for checkout.
          </p>
        </div>

        {!showForm && canAddAddress && (
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddClick}
          >
            <FiPlus size={16} />
            Add address
          </button>
        )}
      </div>

      <div className={styles.summaryBar}>
        <div className={styles.summaryItem}>
          <FiMapPin size={15} />
          <span>
            {addresses.length} of {MAX_ADDRESSES} addresses saved
          </span>
        </div>

        <span className={styles.summaryLimit}>
          Maximum {MAX_ADDRESSES}
        </span>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <strong>Something went wrong</strong>
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <div className={styles.formSection}>
          <AddressForm
            address={editingAddress}
            onSaved={handleSaved}
            onCancel={handleCancel}
          />
        </div>
      )}

      {!showForm && addresses.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiMapPin size={24} />
          </div>

          <h3>No saved addresses</h3>

          <p>
            Add a delivery address to make your next checkout faster.
          </p>

          <button
            type="button"
            className={styles.emptyButton}
            onClick={handleAddClick}
          >
            <FiPlus size={16} />
            Add your first address
          </button>
        </div>
      )}

      {!showForm && addresses.length > 0 && (
        <div className={styles.addressList}>
          {addresses.map((address) => {
            const isDeleting = deletingId === address._id;

            return (
              <article
                className={styles.addressCard}
                key={address._id}
              >
                <div className={styles.cardTop}>
                  <div className={styles.cardIdentity}>
                    <div className={styles.addressIcon}>
                      <FiHome size={17} />
                    </div>

                    <div>
                      <h3>{address.label}</h3>
                      <span>Saved delivery address</span>
                    </div>
                  </div>

                  <span className={styles.savedBadge}>Saved</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.personRow}>
                    <FiUser size={14} />
                    <strong>{address.fullName}</strong>
                  </div>

                  <p className={styles.phone}>{address.phone}</p>

                  <div className={styles.addressDetails}>
                    <span>{address.address}</span>
                    <span>
                      {address.city}, {address.state}
                    </span>
                    <span>PIN {address.pinCode}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={() => handleEditClick(address)}
                    disabled={isDeleting}
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleDelete(address._id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <FiLoader
                          size={14}
                          className={styles.spinner}
                        />
                        Deleting
                      </>
                    ) : (
                      <>
                        <FiTrash2 size={14} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!showForm && !canAddAddress && (
        <div className={styles.limitNotice}>
          <FiMapPin size={15} />

          <div>
            <strong>Address limit reached</strong>
            <p>
              You can save up to {MAX_ADDRESSES} addresses. Delete an
              existing address before adding another.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}