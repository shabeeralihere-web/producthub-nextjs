import { getCurrentUser } from "@/services/authService";

export async function requireSeller() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      reason: "unauthenticated",
    };
  }

  if (user.role !== "seller") {
    return {
      authorized: false,
      reason: "forbidden",
    };
  }

  return {
    authorized: true,
    user,
  };
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      reason: "unauthenticated",
    };
  }

  if (user.role !== "admin") {
    return {
      authorized: false,
      reason: "forbidden",
    };
  }

  return {
    authorized: true,
    user,
  };
}

export async function requireCustomerAccount() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      reason: "unauthenticated",
    };
  }

  if (!["user", "seller"].includes(user.role)) {
    return {
      authorized: false,
      reason: "forbidden",
    };
  }

  return {
    authorized: true,
    user,
  };
}