"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";
import { toast } from "react-toastify";

import { useAuth } from "@/context/AuthContext";

import styles from "./page.module.css";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password =
        "Password is required.";
    }

    setErrors(newErrors);

    return (
      !newErrors.email &&
      !newErrors.password
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    setErrors({
      email: "",
      password: "",
      general: "",
    });

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          setErrors((current) => ({
            ...current,
            password:
              "Invalid email or password.",
          }));

          return;
        }

        setErrors((current) => ({
          ...current,
          general:
            result.message ||
            "Unable to sign in. Please try again.",
        }));

        return;
      }

      login(result.data);

      toast.success("Signed in successfully");

      const role = result.data?.role;

      if (role === "admin") {
        router.push("/admin");
      } else if (role === "seller") {
        router.push("/seller");
      } else {
        router.push("/products");
      }
    } catch (error) {
      setErrors((current) => ({
        ...current,
        general:
          "Unable to connect to the server. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      {errors.general && (
        <div
          className={styles.generalError}
          role="alert"
        >
          {errors.general}
        </div>
      )}

      <div className={styles.field}>
        <label
          htmlFor="email"
          className={styles.label}
        >
          Email address
        </label>

        <div
          className={`${styles.inputWrapper} ${
            errors.email
              ? styles.inputWrapperError
              : ""
          }`}
        >
          <FiMail
            className={styles.inputIcon}
            aria-hidden="true"
          />

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck="false"
            disabled={loading}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email
                ? "email-error"
                : undefined
            }
            className={styles.input}
          />
        </div>

        {errors.email && (
          <p
            id="email-error"
            className={styles.fieldError}
            role="alert"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label
          htmlFor="password"
          className={styles.label}
        >
          Password
        </label>

        <div
          className={`${styles.inputWrapper} ${
            errors.password
              ? styles.inputWrapperError
              : ""
          }`}
        >
          <FiLock
            className={styles.inputIcon}
            aria-hidden="true"
          />

          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loading}
            aria-invalid={Boolean(
              errors.password
            )}
            aria-describedby={
              errors.password
                ? "password-error"
                : undefined
            }
            className={`${styles.input} ${styles.passwordInput}`}
          />

          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() =>
              setShowPassword(
                (current) => !current
              )
            }
            disabled={loading}
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            title={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <FiEyeOff size={17} />
            ) : (
              <FiEye size={17} />
            )}
          </button>
        </div>

        {errors.password && (
          <p
            id="password-error"
            className={styles.fieldError}
            role="alert"
          >
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={loading}
      >
        <span>
          {loading
            ? "Signing in..."
            : "Sign in"}
        </span>

        {!loading && (
          <FiArrowRight
            size={17}
            aria-hidden="true"
          />
        )}

        {loading && (
          <span
            className={styles.spinner}
            aria-hidden="true"
          />
        )}
      </button>
    </form>
  );
}