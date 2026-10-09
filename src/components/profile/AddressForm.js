"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const addressSchema = yup.object({
  label: yup
    .string()
    .trim()
    .required("Address label is required")
    .max(50, "Label must be 50 characters or less"),

  fullName: yup
    .string()
    .trim()
    .required("Full name is required"),

  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Enter a valid phone number"),

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

const defaultValues = {
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
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: address || defaultValues,
  });

  const isEditing = Boolean(address);

  const onSubmit = async (formData) => {
    setServerError("");
    setIsSubmitting(true);

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
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to save address"
        );
      }

      reset(defaultValues);

      if (onSaved) {
        onSaved(result.data);
      }
    } catch (error) {
      setServerError(
        error.message || "Unable to save address"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">
              {isEditing ? "Edit Address" : "Add Address"}
            </h4>

            <p className="text-muted mb-0">
              {isEditing
                ? "Update your saved address."
                : "Add an address for faster checkout."}
            </p>
          </div>
        </div>

        {serverError && (
          <div className="alert alert-danger">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">
                Address Label
              </label>

              <input
                type="text"
                className={`form-control ${
                  errors.label ? "is-invalid" : ""
                }`}
                placeholder="Home, Work, etc."
                {...register("label")}
              />

              {errors.label && (
                <div className="invalid-feedback">
                  {errors.label.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Full Name
              </label>

              <input
                type="text"
                className={`form-control ${
                  errors.fullName ? "is-invalid" : ""
                }`}
                {...register("fullName")}
              />

              {errors.fullName && (
                <div className="invalid-feedback">
                  {errors.fullName.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">
                Phone
              </label>

              <input
                type="tel"
                className={`form-control ${
                  errors.phone ? "is-invalid" : ""
                }`}
                {...register("phone")}
              />

              {errors.phone && (
                <div className="invalid-feedback">
                  {errors.phone.message}
                </div>
              )}
            </div>

            <div className="col-12">
              <label className="form-label">
                Address
              </label>

              <textarea
                rows="3"
                className={`form-control ${
                  errors.address ? "is-invalid" : ""
                }`}
                {...register("address")}
              />

              {errors.address && (
                <div className="invalid-feedback">
                  {errors.address.message}
                </div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">
                City
              </label>

              <input
                type="text"
                className={`form-control ${
                  errors.city ? "is-invalid" : ""
                }`}
                {...register("city")}
              />

              {errors.city && (
                <div className="invalid-feedback">
                  {errors.city.message}
                </div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">
                State
              </label>

              <input
                type="text"
                className={`form-control ${
                  errors.state ? "is-invalid" : ""
                }`}
                {...register("state")}
              />

              {errors.state && (
                <div className="invalid-feedback">
                  {errors.state.message}
                </div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">
                PIN Code
              </label>

              <input
                type="text"
                className={`form-control ${
                  errors.pinCode ? "is-invalid" : ""
                }`}
                {...register("pinCode")}
              />

              {errors.pinCode && (
                <div className="invalid-feedback">
                  {errors.pinCode.message}
                </div>
              )}
            </div>

            <div className="col-12 d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                  ? "Update Address"
                  : "Save Address"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}