"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiHome,
  FiLoader,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import styles from "../AddressForm.module.css";

const emptyForm = {
  label: "",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
};

export default function AddressForm({
  address = null,
  onSaved,
  onCancel,
}) {
  const router = useRouter();
  const isEditing = Boolean(address);

  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setFormData(emptyForm);
      return;
    }

    setFormData({
      label: address.label || "",
      fullName: address.fullName || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pinCode: address.pinCode || "",
    });
  }, [address]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.label.trim()) {
      return "Address name is required.";
    }

    if (!formData.fullName.trim()) {
      return "Full name is required.";
    }

    if (!formData.phone.trim()) {
      return "Phone number is required.";
    }

    if (!/^\d{10,15}$/.test(formData.phone.trim())) {
      return "Phone number must contain 10 to 15 digits.";
    }

    if (!formData.address.trim()) {
      return "Address is required.";
    }

    if (!formData.city.trim()) {
      return "City is required.";
    }

    if (!formData.state.trim()) {
      return "State is required.";
    }

    if (!formData.pinCode.trim()) {
      return "PIN code is required.";
    }

    if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      return "PIN code must contain 6 digits.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const url = isEditing
        ? `/api/addresses/${address._id}`
        : "/api/addresses";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: formData.label.trim(),
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pinCode: formData.pinCode.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Unable to ${isEditing ? "update" : "save"} address`
        );
      }

      if (onSaved) {
        onSaved(result.data);
        return;
      }

      router.push("/profile/addresses");
      router.refresh();
    } catch (error) {
      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    router.back();
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <FiMapPin size={19} />
        </div>

        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <span className={styles.eyebrow}>
              {isEditing ? "EDIT ADDRESS" : "NEW ADDRESS"}
            </span>

            {isEditing && (
              <span className={styles.editBadge}>Updating saved address</span>
            )}
          </div>

          <h2>{isEditing ? "Edit address" : "Add a new address"}</h2>

          <p>
            {isEditing
              ? "Update the delivery details for this saved address."
              : "Enter your delivery details and save them for future orders."}
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <strong>
            Unable to {isEditing ? "update" : "save"} address
          </strong>
          <span>{error}</span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>Contact details</h3>
              <p>Name and phone number for delivery.</p>
            </div>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.fieldGroup}>
              <label htmlFor="fullName">Full name</label>

              <div className={styles.inputWrapper}>
                <FiUser className={styles.inputIcon} />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={styles.input}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="phone">Phone number</label>

              <div className={styles.inputWrapper}>
                <FiPhone className={styles.inputIcon} />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10–15 digit phone number"
                  className={styles.input}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>Address details</h3>
              <p>Give this address a name and enter the full location.</p>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="label">Address name</label>

            <div className={styles.inputWrapper}>
              <FiHome className={styles.inputIcon} />

              <input
                id="label"
                name="label"
                type="text"
                value={formData.label}
                onChange={handleChange}
                placeholder="Home, Office, Hostel"
                className={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="address">Full address</label>

            <textarea
              id="address"
              name="address"
              rows={4}
              value={formData.address}
              onChange={handleChange}
              placeholder="House name, street, landmark..."
              className={styles.textarea}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>Location</h3>
              <p>Used to determine where the order should be delivered.</p>
            </div>
          </div>

          <div className={styles.gridThree}>
            <div className={styles.fieldGroup}>
              <label htmlFor="city">City</label>

              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="state">State</label>

              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="pinCode">PIN code</label>

              <input
                id="pinCode"
                name="pinCode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="6 digit PIN"
                className={styles.input}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={loading}
          >
            <FiArrowLeft size={15} />
            Cancel
          </button>

          <button
            type="submit"
            className={styles.saveButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <FiLoader size={16} className={styles.spinner} />
                {isEditing ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <FiCheck size={16} />
                {isEditing ? "Update address" : "Save address"}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}