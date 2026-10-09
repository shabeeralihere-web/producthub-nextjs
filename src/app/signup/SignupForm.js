"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";

import { signupSchema } from "@/validations/authSchemas";
import { useAuth } from "@/context/AuthContext";

import styles from "./page.module.css";

export default function SignupForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordRules = {
    minLength: passwordValue.length >= 6,
    uppercase: /[A-Z]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    special: /[^A-Za-z0-9]/.test(passwordValue),
  };

  const onSubmit = async (formData) => {
    try {
      const { confirmPassword, ...registrationData } =
        formData;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError("root", {
          message:
            result.message ||
            "Unable to create your account.",
        });

        return;
      }

      login(result.data);

      toast.success("Account created successfully");

      if (result.data?.role === "seller") {
        router.push("/seller");
      } else {
        router.push("/products");
      }
    } catch (error) {
      setError("root", {
        message:
          "Unable to connect to the server. Please try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
      noValidate
    >
      {errors.root && (
        <div
          className={styles.generalError}
          role="alert"
        >
          {errors.root.message}
        </div>
      )}

      <div className={styles.nameGrid}>
        <div className={styles.field}>
          <label
            htmlFor="firstName"
            className={styles.label}
          >
            First name
          </label>

          <div
            className={`${styles.inputWrapper} ${
              errors.firstName
                ? styles.inputWrapperError
                : ""
            }`}
          >
            <FiUser
              className={styles.inputIcon}
              aria-hidden="true"
            />

            <input
              id="firstName"
              type="text"
              placeholder="First name"
              autoComplete="given-name"
              disabled={isSubmitting}
              className={styles.input}
              {...register("firstName")}
            />
          </div>

          {errors.firstName && (
            <p className={styles.fieldError}>
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label
            htmlFor="lastName"
            className={styles.label}
          >
            Last name
          </label>

          <div
            className={`${styles.inputWrapper} ${
              errors.lastName
                ? styles.inputWrapperError
                : ""
            }`}
          >
            <FiUser
              className={styles.inputIcon}
              aria-hidden="true"
            />

            <input
              id="lastName"
              type="text"
              placeholder="Last name"
              autoComplete="family-name"
              disabled={isSubmitting}
              className={styles.input}
              {...register("lastName")}
            />
          </div>

          {errors.lastName && (
            <p className={styles.fieldError}>
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

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
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck="false"
            disabled={isSubmitting}
            className={styles.input}
            {...register("email")}
          />
        </div>

        {errors.email && (
          <p className={styles.fieldError}>
            {errors.email.message}
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
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            autoComplete="new-password"
            disabled={isSubmitting}
            className={`${styles.input} ${styles.passwordInput}`}
            {...register("password", {
              onChange: (event) => {
                setPasswordValue(event.target.value);
              },
            })}
          />

          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() =>
              setShowPassword((current) => !current)
            }
            disabled={isSubmitting}
            aria-label={
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

        <div className={styles.passwordRequirements}>
          <div className={styles.requirementsTitle}>
            Password must contain:
          </div>

          <div className={styles.requirementsGrid}>
            <PasswordRule
              valid={passwordRules.minLength}
              text="At least 6 characters"
            />

            <PasswordRule
              valid={passwordRules.uppercase}
              text="One uppercase letter"
            />

            <PasswordRule
              valid={passwordRules.lowercase}
              text="One lowercase letter"
            />

            <PasswordRule
              valid={passwordRules.number}
              text="One number"
            />

            <PasswordRule
              valid={passwordRules.special}
              text="One special character"
            />
          </div>
        </div>

        {errors.password && (
          <p className={styles.fieldError}>
            {errors.password.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label
          htmlFor="confirmPassword"
          className={styles.label}
        >
          Confirm password
        </label>

        <div
          className={`${styles.inputWrapper} ${
            errors.confirmPassword
              ? styles.inputWrapperError
              : ""
          }`}
        >
          <FiLock
            className={styles.inputIcon}
            aria-hidden="true"
          />

          <input
            id="confirmPassword"
            type={
              showConfirmPassword ? "text" : "password"
            }
            placeholder="Re-enter your password"
            autoComplete="new-password"
            disabled={isSubmitting}
            className={`${styles.input} ${styles.passwordInput}`}
            {...register("confirmPassword")}
          />

          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() =>
              setShowConfirmPassword(
                (current) => !current
              )
            }
            disabled={isSubmitting}
            aria-label={
              showConfirmPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showConfirmPassword ? (
              <FiEyeOff size={17} />
            ) : (
              <FiEye size={17} />
            )}
          </button>
        </div>

        {confirmPassword.length > 0 && (
          <p
            className={
              passwordsMatch
                ? styles.passwordMatch
                : styles.passwordMismatch
            }
          >
            {passwordsMatch
              ? "Passwords match"
              : "Passwords do not match"}
          </p>
        )}

        {errors.confirmPassword && (
          <p className={styles.fieldError}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label
          htmlFor="role"
          className={styles.label}
        >
          Account type
        </label>

        <div
          className={`${styles.selectWrapper} ${
            errors.role
              ? styles.inputWrapperError
              : ""
          }`}
        >
          <FiUsers
            className={styles.inputIcon}
            aria-hidden="true"
          />

          <select
            id="role"
            disabled={isSubmitting}
            className={styles.select}
            {...register("role")}
          >
            <option value="user">Customer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        {errors.role && (
          <p className={styles.fieldError}>
            {errors.role.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        <span>
          {isSubmitting
            ? "Creating account..."
            : "Create account"}
        </span>

        {!isSubmitting && (
          <FiArrowRight
            size={17}
            aria-hidden="true"
          />
        )}

        {isSubmitting && (
          <span
            className={styles.spinner}
            aria-hidden="true"
          />
        )}
      </button>
    </form>
  );
}

function PasswordRule({ valid, text }) {
  return (
    <div
      className={`${styles.passwordRule} ${
        valid ? styles.passwordRuleValid : ""
      }`}
    >
      <span className={styles.ruleIcon}>
        <FiCheck size={11} />
      </span>

      <span>{text}</span>
    </div>
  );
}