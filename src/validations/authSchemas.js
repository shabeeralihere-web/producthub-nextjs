import * as yup from "yup";

export const signupSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),

  lastName: yup
    .string()
    .trim()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain a special character"
    ),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),

  role: yup
    .string()
    .oneOf(["user", "seller"], "Invalid account type")
    .required("Account type is required"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required"),
});