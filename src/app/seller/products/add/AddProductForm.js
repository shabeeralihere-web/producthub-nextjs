"use client";

import {
  FiImage,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";

import { productSchema } from "@/validations/productSchemas";

import styles from "./AddProductForm.module.css";

export default function AddProductForm() {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      category: "",
      image: null,
    },
  });

  const imageValue = watch("image");

  useEffect(() => {
    const file = imageValue?.[0];

    if (!file) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [imageValue]);

  const imageField = register("image");

  const handleImageChange = (event) => {
    imageField.onChange(event);
  };

  const removeImage = () => {
    setValue("image", null, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setImagePreview("");
  };

  const onSubmit = async (formData) => {
    const imageFile = formData.image?.[0];

    if (!imageFile) {
      setError("image", {
        type: "manual",
        message: "Product image is required",
      });
      return;
    }

    try {
      const body = new FormData();

      body.append("name", formData.name);
      body.append("price", formData.price);
      body.append("category", formData.category);
      body.append("image", imageFile);

      const response = await fetch(
        "/api/products/add",
        {
          method: "POST",
          body,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError("root", {
          type: "server",
          message:
            result.message || "Unable to add product",
        });
        return;
      }

      router.push("/seller/products");
      router.refresh();
    } catch (error) {
      setError("root", {
        type: "server",
        message:
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={styles.form}
    >
      {errors.root && (
        <div className={styles.serverError}>
          {errors.root.message}
        </div>
      )}

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              Product Image
            </h2>

            <p className={styles.cardDescription}>
              Upload a clear image of your product.
            </p>
          </div>

          <FiImage
            size={19}
            className={styles.headerIcon}
          />
        </div>

        {!imagePreview ? (
          <label
            htmlFor="image"
            className={`${styles.uploadArea} ${
              errors.image ? styles.uploadError : ""
            }`}
          >
            <div className={styles.uploadIcon}>
              <FiUploadCloud size={20} />
            </div>

            <div className={styles.uploadContent}>
              <span className={styles.uploadTitle}>
                Upload product image
              </span>

              <span className={styles.uploadText}>
                Choose an image from your device
              </span>
            </div>

            <span className={styles.uploadButton}>
              Choose Image
            </span>

            <input
              id="image"
              type="file"
              accept="image/*"
              className={styles.fileInput}
              {...imageField}
              onChange={handleImageChange}
            />
          </label>
        ) : (
          <div className={styles.previewArea}>
            <img
              src={imagePreview}
              alt="Product preview"
              className={styles.previewImage}
            />

            <button
              type="button"
              className={styles.removeImage}
              onClick={removeImage}
              disabled={isSubmitting}
            >
              <FiX size={14} />
              Remove
            </button>
          </div>
        )}

        {errors.image && (
          <div className={styles.fieldError}>
            {errors.image.message}
          </div>
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              Product Information
            </h2>

            <p className={styles.cardDescription}>
              Add the basic information for your product.
            </p>
          </div>
        </div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label
              htmlFor="name"
              className={styles.label}
            >
              Product Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter product name"
              className={`${styles.input} ${
                errors.name ? styles.inputError : ""
              }`}
              {...register("name")}
            />

            {errors.name && (
              <div className={styles.fieldError}>
                {errors.name.message}
              </div>
            )}
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label
                htmlFor="price"
                className={styles.label}
              >
                Price
              </label>

              <div className={styles.inputWithPrefix}>
                <span className={styles.prefix}>
                  ₹
                </span>

                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={`${styles.input} ${
                    styles.priceInput
                  } ${
                    errors.price
                      ? styles.inputError
                      : ""
                  }`}
                  {...register("price")}
                />
              </div>

              {errors.price && (
                <div className={styles.fieldError}>
                  {errors.price.message}
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label
                htmlFor="category"
                className={styles.label}
              >
                Category
              </label>

              <select
                id="category"
                className={`${styles.input} ${
                  styles.select
                } ${
                  errors.category
                    ? styles.inputError
                    : ""
                }`}
                {...register("category")}
              >
                <option value="">
                  Select category
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Mobiles">
                  Mobiles
                </option>

                <option value="Computers">
                  Computers
                </option>

                <option value="Audio">
                  Audio
                </option>

                <option value="Accessories">
                  Accessories
                </option>
              </select>

              {errors.category && (
                <div className={styles.fieldError}>
                  {errors.category.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Adding Product..."
            : "Add Product"}
        </button>
      </div>
    </form>
  );
}