"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  FiArrowRight,
  FiCheck,
  FiChevronRight,
  FiCreditCard,
  FiEdit2,
  FiHome,
  FiLoader,
  FiMapPin,
  FiMinus,
  FiPlus,
  FiSmartphone,
  FiTrash2,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";

import styles from "./CheckoutForm.module.css";

const addressSchema = yup.object({
  label: yup
    .string()
    .trim()
    .required("Address label is required")
    .max(
      50,
      "Label must be 50 characters or less"
    ),

  fullName: yup
    .string()
    .trim()
    .required("Full name is required"),

  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(
      /^[0-9]{10,15}$/,
      "Enter a valid phone number"
    ),

  address: yup
    .string()
    .trim()
    .required("Address is required"),

  city: yup
    .string()
    .trim()
    .required("City is required"),

  state: yup
    .string()
    .trim()
    .required("State is required"),

  pinCode: yup
    .string()
    .trim()
    .required("PIN code is required"),
});

const checkoutSchema = yup.object({
  paymentMethod: yup
    .string()
    .required("Please select a payment method")
    .oneOf(
      ["cod", "upi", "card", "netbanking"],
      "Invalid payment method"
    ),
});

const defaultAddressValues = {
  label: "",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
};

const paymentMethods = [
  {
    value: "cod",
    title: "Cash on Delivery",
    description:
      "Pay when your order is delivered.",
    icon: FiTruck,
  },
  {
    value: "upi",
    title: "UPI",
    description:
      "Pay using your preferred UPI app.",
    icon: FiSmartphone,
  },
  {
    value: "card",
    title: "Credit / Debit Card",
    description:
      "Pay securely using your card.",
    icon: FiCreditCard,
  },
  {
    value: "netbanking",
    title: "Net Banking",
    description:
      "Pay directly from your bank account.",
    icon: FiHome,
  },
];

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

export default function CheckoutForm({
  cartItems = [],
  initialAddresses = [],
}) {
  const router = useRouter();

  const [addresses, setAddresses] =
    useState(initialAddresses);

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState(
    initialAddresses[0]?._id || ""
  );

  const [
    editingAddress,
    setEditingAddress,
  ] = useState(null);

  const [
    showAddressForm,
    setShowAddressForm,
  ] = useState(
    initialAddresses.length === 0
  );

  const [
    addressError,
    setAddressError,
  ] = useState("");

  const [
    isAddressSubmitting,
    setIsAddressSubmitting,
  ] = useState(false);

  const [
    serverError,
    setServerError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    updatingCartId,
    setUpdatingCartId,
  ] = useState(null);

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    reset: resetAddress,
    formState: {
      errors: addressErrors,
    },
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: defaultAddressValues,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
    },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  const selectedPaymentMethod =
    watch("paymentMethod");

  const selectedAddress = addresses.find(
    (address) =>
      address._id === selectedAddressId
  );

  const canAddAddress =
    addresses.length < 2;

  const subtotal = cartItems.reduce(
    (total, item) => {
      const price =
        Number(item.productId?.price) || 0;

      const quantity =
        Number(item.quantity) || 0;

      return total + price * quantity;
    },
    0
  );

  const totalQuantity = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const handleAddAddress = () => {
    setAddressError("");
    setEditingAddress(null);
    resetAddress(defaultAddressValues);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address) => {
    setAddressError("");
    setEditingAddress(address);

    resetAddress({
      label: address.label || "",
      fullName: address.fullName || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pinCode: address.pinCode || "",
    });

    setShowAddressForm(true);
  };

  const handleCancelAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(false);
    setAddressError("");
    resetAddress(defaultAddressValues);
  };

  const saveAddress = async (formData) => {
    setAddressError("");
    setIsAddressSubmitting(true);

    try {
      const isEditing =
        Boolean(editingAddress);

      const url = isEditing
        ? `/api/addresses/${editingAddress._id}`
        : "/api/addresses";

      const method = isEditing
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to save address"
        );
      }

      const savedAddress = result.data;

      if (isEditing) {
        setAddresses((current) =>
          current.map((address) =>
            address._id ===
            savedAddress._id
              ? savedAddress
              : address
          )
        );
      } else {
        setAddresses((current) => [
          savedAddress,
          ...current,
        ]);
      }

      setSelectedAddressId(
        savedAddress._id
      );

      setEditingAddress(null);
      setShowAddressForm(false);
      resetAddress(defaultAddressValues);
    } catch (error) {
      setAddressError(
        error.message ||
          "Unable to save address"
      );
    } finally {
      setIsAddressSubmitting(false);
    }
  };

  const updateQuantity = async (
    cartId,
    quantity
  ) => {
    if (
      quantity < 1 ||
      updatingCartId
    ) {
      return;
    }

    setUpdatingCartId(cartId);
    setServerError("");

    try {
      const response = await fetch(
        "/api/cart/update",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            cartId,
            quantity,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update quantity"
        );
      }

      router.refresh();
    } catch (error) {
      setServerError(
        error.message ||
          "Unable to update cart"
      );
    } finally {
      setUpdatingCartId(null);
    }
  };

  const removeItem = async (cartId) => {
    if (updatingCartId) {
      return;
    }

    setUpdatingCartId(cartId);
    setServerError("");

    try {
      const response = await fetch(
        "/api/cart/remove",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            cartId,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to remove item"
        );
      }

      router.refresh();
    } catch (error) {
      setServerError(
        error.message ||
          "Unable to remove item"
      );
    } finally {
      setUpdatingCartId(null);
    }
  };

  const onSubmit = async (formData) => {
    setServerError("");

    if (!selectedAddress) {
      setServerError(
        "Please select a delivery address."
      );

      return;
    }

    if (cartItems.length === 0) {
      setServerError(
        "Your cart is empty."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            deliveryAddress: {
              fullName:
                selectedAddress.fullName,
              phone:
                selectedAddress.phone,
              address:
                selectedAddress.address,
              city:
                selectedAddress.city,
              state:
                selectedAddress.state,
              pinCode:
                selectedAddress.pinCode,
            },
            paymentMethod:
              formData.paymentMethod,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to place order"
        );
      }

      const createdOrderId =
        result?.data?._id ||
        result?.data?.id ||
        result?.order?._id ||
        result?.order?.id;

      if (createdOrderId) {
        window.location.href = `/orders/${createdOrderId}`;
        return;
      }

      window.location.href =
        "/orders";
    } catch (error) {
      setServerError(
        error.message ||
          "Unable to place order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={styles.checkout}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.mainColumn}>
        {/* DELIVERY */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div
              className={styles.sectionNumber}
            >
              01
            </div>

            <div>
              <span
                className={
                  styles.sectionEyebrow
                }
              >
                Delivery
              </span>

              <h2
                className={
                  styles.sectionTitle
                }
              >
                Delivery address
              </h2>

              <p
                className={
                  styles.sectionDescription
                }
              >
                Choose where you'd like
                your order delivered.
              </p>
            </div>
          </div>

          {addressError && (
            <div
              className={styles.errorMessage}
              role="alert"
            >
              {addressError}
            </div>
          )}

          {addresses.length > 0 &&
            !showAddressForm && (
              <div className={styles.addressList}>
                {addresses.map((address) => {
                  const isSelected =
                    selectedAddressId ===
                    address._id;

                  return (
                    <div
                      key={address._id}
                      className={`${styles.addressCard} ${
                        isSelected
                          ? styles.addressSelected
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className={
                          styles.addressSelect
                        }
                        onClick={() =>
                          setSelectedAddressId(
                            address._id
                          )
                        }
                        aria-pressed={
                          isSelected
                        }
                      >
                        <span
                          className={
                            styles.radio
                          }
                        >
                          {isSelected && (
                            <span
                              className={
                                styles.radioDot
                              }
                            />
                          )}
                        </span>

                        <span
                          className={
                            styles.addressContent
                          }
                        >
                          <span
                            className={
                              styles.addressTop
                            }
                          >
                            <span
                              className={
                                styles.addressLabel
                              }
                            >
                              {address.label}
                            </span>

                            {isSelected && (
                              <span
                                className={
                                  styles.selectedBadge
                                }
                              >
                                <FiCheck />
                                Selected
                              </span>
                            )}
                          </span>

                          <strong
                            className={
                              styles.addressName
                            }
                          >
                            {address.fullName}
                          </strong>

                          <span
                            className={
                              styles.addressPhone
                            }
                          >
                            {address.phone}
                          </span>

                          <span
                            className={
                              styles.addressText
                            }
                          >
                            {address.address}
                            <br />
                            {address.city},{" "}
                            {address.state}
                            <br />
                            PIN:{" "}
                            {address.pinCode}
                          </span>
                        </span>
                      </button>

                      <button
                        type="button"
                        className={
                          styles.editAddressButton
                        }
                        onClick={() =>
                          handleEditAddress(
                            address
                          )
                        }
                        aria-label={`Edit ${address.label} address`}
                      >
                        <FiEdit2 />
                        <span>Edit</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

          {showAddressForm && (
            <div
              className={
                styles.addressForm
              }
            >
              <div
                className={
                  styles.formHeader
                }
              >
                <div>
                  <h3>
                    {editingAddress
                      ? "Edit address"
                      : "Add a new address"}
                  </h3>

                  <p>
                    Enter your delivery
                    details below.
                  </p>
                </div>

                {addresses.length > 0 && (
                  <button
                    type="button"
                    className={
                      styles.closeButton
                    }
                    onClick={
                      handleCancelAddress
                    }
                    aria-label="Close address form"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <label
                    className={
                      styles.label
                    }
                  >
                    Address label
                  </label>

                  <input
                    type="text"
                    placeholder="Home, Work, etc."
                    className={`${styles.input} ${
                      addressErrors.label
                        ? styles.inputError
                        : ""
                    }`}
                    {...registerAddress(
                      "label"
                    )}
                  />

                  {addressErrors.label && (
                    <p
                      className={
                        styles.fieldError
                      }
                    >
                      {
                        addressErrors.label
                          .message
                      }
                    </p>
                  )}
                </div>

                <div className="col-md-6">
                  <label
                    className={
                      styles.label
                    }
                  >
                    Full name
                  </label>

                  <input
                    type="text"
                    className={`${styles.input} ${
                      addressErrors.fullName
                        ? styles.inputError
                        : ""
                    }`}
                    {...registerAddress(
                      "fullName"
                    )}
                  />

                  {addressErrors.fullName && (
                    <p
                      className={
                        styles.fieldError
                      }
                    >
                      {
                        addressErrors.fullName
                          .message
                      }
                    </p>
                  )}
                </div>

                <div className="col-md-6">
                  <label
                    className={
                      styles.label
                    }
                  >
                    Phone number
                  </label>

                  <input
                    type="tel"
                    className={`${styles.input} ${
                      addressErrors.phone
                        ? styles.inputError
                        : ""
                    }`}
                    {...registerAddress(
                      "phone"
                    )}
                  />

                  {addressErrors.phone && (
                    <p
                      className={
                        styles.fieldError
                      }
                    >
                      {
                        addressErrors.phone
                          .message
                      }
                    </p>
                  )}
                </div>

                <div className="col-12">
                  <label
                    className={
                      styles.label
                    }
                  >
                    Address
                  </label>

                  <textarea
                    rows="3"
                    className={`${styles.input} ${styles.textarea} ${
                      addressErrors.address
                        ? styles.inputError
                        : ""
                    }`}
                    {...registerAddress(
                      "address"
                    )}
                  />

                  {addressErrors.address && (
                    <p
                      className={
                        styles.fieldError
                      }
                    >
                      {
                        addressErrors.address
                          .message
                      }
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <label
                    className={
                      styles.label
                    }
                  >
                    City
                  </label>

                  <input
                    type="text"
                    className={`${styles.input} ${
                      addressErrors.city
                        ? styles.inputError
                        : ""
                    }`}
                    {...registerAddress(
                      "city"
                    )}
                  />

                  {addressErrors.city && (
                    <p
                      className={
                        styles.fieldError
                      }
                    >
                      {
                        addressErrors.city
                          .message
                      }
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <label
                    className={
                      styles.label
                    }
                  >
                    State
                  </label>

                  <input
                    type="text"
                    className={`${styles.input} ${
                      addressErrors.state
                        ? styles.inputError
                        : ""
                    }`}
                    {...registerAddress(
                      "state"
                    )}
                  />

                  {addressErrors.state && (
                    <p
                      className={
                        styles.fieldError
                      }
                    >
                      {
                        addressErrors.state
                          .message
                      }
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <label
                    className={
                      styles.label
                    }
                  >
                    PIN code
                  </label>

                  <input
                    type="text"
                    className={`${styles.input} ${
                      addressErrors.pinCode
                        ? styles.inputError
                        : ""
                    }`}
                    {...registerAddress(
                      "pinCode"
                    )}
                  />

                  {addressErrors.pinCode && (
                    <p
                      className={
                        styles.fieldError
                      }
                    >
                      {
                        addressErrors.pinCode
                          .message
                      }
                    </p>
                  )}
                </div>
              </div>

              <div
                className={
                  styles.formActions
                }
              >
                <button
                  type="button"
                  className={
                    styles.primarySmall
                  }
                  disabled={
                    isAddressSubmitting
                  }
                  onClick={handleAddressSubmit(
                    saveAddress
                  )}
                >
                  {isAddressSubmitting ? (
                    <>
                      <FiLoader
                        className={
                          styles.spinner
                        }
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck />
                      {editingAddress
                        ? "Update address"
                        : "Save address"}
                    </>
                  )}
                </button>

                {addresses.length > 0 && (
                  <button
                    type="button"
                    className={
                      styles.secondarySmall
                    }
                    disabled={
                      isAddressSubmitting
                    }
                    onClick={
                      handleCancelAddress
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {!showAddressForm &&
            canAddAddress && (
              <button
                type="button"
                className={
                  styles.addAddressButton
                }
                onClick={
                  handleAddAddress
                }
              >
                <FiMapPin />
                <span>
                  Add a new delivery address
                </span>
                <FiChevronRight />
              </button>
            )}

          {!showAddressForm &&
            !canAddAddress && (
              <p
                className={
                  styles.addressLimit
                }
              >
                You can save up to 2
                addresses.
              </p>
            )}
        </section>

        {/* PAYMENT */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div
              className={styles.sectionNumber}
            >
              02
            </div>

            <div>
              <span
                className={
                  styles.sectionEyebrow
                }
              >
                Payment
              </span>

              <h2
                className={
                  styles.sectionTitle
                }
              >
                Payment method
              </h2>

              <p
                className={
                  styles.sectionDescription
                }
              >
                Choose your preferred
                payment method.
              </p>
            </div>
          </div>

          <div className={styles.paymentList}>
            {paymentMethods.map(
              (method) => {
                const Icon = method.icon;

                const isSelected =
                  selectedPaymentMethod ===
                  method.value;

                return (
                  <label
                    key={method.value}
                    className={`${styles.paymentCard} ${
                      isSelected
                        ? styles.paymentSelected
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      value={method.value}
                      className={
                        styles.paymentInput
                      }
                      {...register(
                        "paymentMethod"
                      )}
                    />

                    <span
                      className={
                        styles.paymentIcon
                      }
                    >
                      <Icon />
                    </span>

                    <span
                      className={
                        styles.paymentContent
                      }
                    >
                      <strong>
                        {method.title}
                      </strong>

                      <span>
                        {method.description}
                      </span>
                    </span>

                    <span
                      className={
                        styles.paymentRadio
                      }
                    >
                      {isSelected && (
                        <span />
                      )}
                    </span>
                  </label>
                );
              }
            )}
          </div>

          {errors.paymentMethod && (
            <p
              className={
                styles.fieldError
              }
            >
              {
                errors.paymentMethod
                  .message
              }
            </p>
          )}
        </section>

        {/* CART ITEMS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div
              className={styles.sectionNumber}
            >
              03
            </div>

            <div>
              <span
                className={
                  styles.sectionEyebrow
                }
              >
                Your order
              </span>

              <h2
                className={
                  styles.sectionTitle
                }
              >
                Review your items
              </h2>

              <p
                className={
                  styles.sectionDescription
                }
              >
                Make sure everything looks
                right before placing your
                order.
              </p>
            </div>
          </div>

          <div className={styles.checkoutItems}>
            {cartItems.map((item) => {
              const product =
                item.productId;

              const price =
                Number(product?.price) || 0;

              const quantity =
                Number(item.quantity) || 0;

              const itemTotal =
                price * quantity;

              const isUpdating =
                updatingCartId ===
                item._id;

              return (
                <article
                  key={item._id}
                  className={
                    styles.checkoutItem
                  }
                >
                  <Link
                    href={`/product/${product._id}`}
                    className={
                      styles.itemImageLink
                    }
                  >
                    <div
                      className={
                        styles.itemImageWrapper
                      }
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className={
                          styles.itemImage
                        }
                      />
                    </div>
                  </Link>

                  <div
                    className={
                      styles.itemInfo
                    }
                  >
                    <Link
                      href={`/product/${product._id}`}
                      className={
                        styles.itemNameLink
                      }
                    >
                      <span
                        className={
                          styles.itemCategory
                        }
                      >
                        {product.category}
                      </span>

                      <h3
                        className={
                          styles.itemName
                        }
                      >
                        {product.name}
                      </h3>
                    </Link>

                    <span
                      className={
                        styles.itemUnitPrice
                      }
                    >
                      {formatPrice(
                        price
                      )}{" "}
                      each
                    </span>
                  </div>

                  <div
                    className={
                      styles.itemQuantity
                    }
                  >
                    <span
                      className={
                        styles.quantityLabel
                      }
                    >
                      Quantity
                    </span>

                    <div
                      className={
                        styles.quantityControl
                      }
                    >
                      <button
                        type="button"
                        disabled={
                          isUpdating ||
                          quantity <= 1
                        }
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            quantity - 1
                          )
                        }
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>

                      <span>
                        {isUpdating ? (
                          <FiLoader
                            className={
                              styles.spinner
                            }
                          />
                        ) : (
                          quantity
                        )}
                      </span>

                      <button
                        type="button"
                        disabled={
                          isUpdating
                        }
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            quantity + 1
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  <div
                    className={
                      styles.itemTotal
                    }
                  >
                    <span>
                      Item total
                    </span>

                    <strong>
                      {formatPrice(
                        itemTotal
                      )}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className={
                      styles.removeItem
                    }
                    disabled={isUpdating}
                    onClick={() =>
                      removeItem(item._id)
                    }
                  >
                    {isUpdating ? (
                      <FiLoader
                        className={
                          styles.spinner
                        }
                      />
                    ) : (
                      <FiTrash2 />
                    )}

                    <span>Remove</span>
                  </button>
                </article>
              );
            })}
          </div>

          <Link
            href="/products"
            className={
              styles.continueShopping
            }
          >
            Continue shopping
            <FiArrowRight />
          </Link>
        </section>
      </div>

      {/* SUMMARY */}
      <aside className={styles.sidebar}>
        <div className={styles.summary}>
          <div className={styles.summaryHeader}>
            <div>
              <span
                className={
                  styles.sectionEyebrow
                }
              >
                Order summary
              </span>

              <h2
                className={
                  styles.summaryTitle
                }
              >
                Your order
              </h2>
            </div>

            <span
              className={
                styles.summaryCount
              }
            >
              {totalQuantity}{" "}
              {totalQuantity === 1
                ? "item"
                : "items"}
            </span>
          </div>

          <div className={styles.summaryProducts}>
            {cartItems.map((item) => {
              const product =
                item.productId;

              const quantity =
                Number(item.quantity) || 0;

              const price =
                Number(product?.price) || 0;

              return (
                <div
                  key={item._id}
                  className={
                    styles.summaryProduct
                  }
                >
                  <div
                    className={
                      styles.summaryImageWrapper
                    }
                  >
                    <img
                      src={product.image}
                      alt=""
                      className={
                        styles.summaryImage
                      }
                    />

                    <span
                      className={
                        styles.summaryQuantity
                      }
                    >
                      {quantity}
                    </span>
                  </div>

                  <div
                    className={
                      styles.summaryProductInfo
                    }
                  >
                    <span>
                      {product.name}
                    </span>

                    <small>
                      {formatPrice(price)} each
                    </small>
                  </div>

                  <strong>
                    {formatPrice(
                      price * quantity
                    )}
                  </strong>
                </div>
              );
            })}
          </div>

          <div
            className={
              styles.summaryDivider
            }
          />

          <div
            className={
              styles.summaryRows
            }
          >
            <div
              className={
                styles.summaryRow
              }
            >
              <span>Subtotal</span>
              <strong>
                {formatPrice(subtotal)}
              </strong>
            </div>

            <div
              className={
                styles.summaryRow
              }
            >
              <span>Delivery</span>
              <strong
                className={
                  styles.freeDelivery
                }
              >
                Free
              </strong>
            </div>
          </div>

          <div
            className={
              styles.summaryTotal
            }
          >
            <span>Total</span>

            <strong>
              {formatPrice(subtotal)}
            </strong>
          </div>

          {serverError && (
            <div
              className={
                styles.serverError
              }
              role="alert"
            >
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className={
              styles.placeOrderButton
            }
            disabled={
              isSubmitting ||
              !selectedAddress ||
              cartItems.length === 0
            }
          >
            {isSubmitting ? (
              <>
                <FiLoader
                  className={
                    styles.spinner
                  }
                />

                Placing order...
              </>
            ) : (
              <>
                Place order

                <FiArrowRight />
              </>
            )}
          </button>

          {!selectedAddress && (
            <p
              className={
                styles.checkoutHint
              }
            >
              Select a delivery address
              before placing your order.
            </p>
          )}

          <div
            className={
              styles.checkoutNote
            }
          >
            <FiUser />

            <span>
              Your order will be placed
              using the selected delivery
              address and payment method.
            </span>
          </div>
        </div>
      </aside>
    </form>
  );
}