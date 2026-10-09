
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];

function isAuthPage(pathname) {
  return pathname === "/login" || pathname === "/signup";
}

function getRoleRedirect(role) {
  if (role === "seller") return "/seller";
  if (role === "admin") return "/admin";

  return "/products";
}

async function getCurrentUser(accessToken) {
  try {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      console.error("BACKEND_URL is missing from environment variables.");
      return null;
    }

    const response = await fetch(
      `${backendUrl}/api/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    return result.data ?? null;
  } catch (error) {
    console.error("Proxy authentication check failed:", error.message);
    return null;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  console.log("PROXY RUNNING:", pathname);

  const accessToken = request.cookies.get("accessToken")?.value;

  // Logged-out visitors can access only public pages.
  if (!accessToken) {
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Verify the session before allowing protected pages.
  const user = await getCurrentUser(accessToken);

  if (!user) {
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    response.cookies.delete("accessToken");

    return response;
  }

  const role = user.role;

  // Redirect authenticated users away from login/signup.
  if (isAuthPage(pathname)) {
    return NextResponse.redirect(
      new URL(getRoleRedirect(role), request.url)
    );
  }

  // Only admins may access admin pages.
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    if (role !== "admin") {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }
  }

  // Only sellers may access seller pages.
  if (
    pathname === "/seller" ||
    pathname.startsWith("/seller/")
  ) {
    if (role !== "seller") {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};