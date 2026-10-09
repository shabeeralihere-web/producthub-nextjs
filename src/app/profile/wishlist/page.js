import { redirect } from "next/navigation";

import { getWishlist } from "@/services/wishlistService";
import { requireCustomerAccount } from "@/lib/authorization";

import ProfileSidebar from "@/components/profile/ProfileSidebar";
import Wishlist from "@/components/profile/Wishlist";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

export default async function WishlistPage() {
  const { authorized, reason } =
    await requireCustomerAccount();

  if (!authorized) {
    if (reason === "unauthenticated") {
      redirect("/login");
    }

    redirect("/unauthorized");
  }

  let wishlist = [];

  try {
    const result = await getWishlist();

    wishlist = result?.data || [];
  } catch (error) {
    console.error(
      "Failed to load wishlist:",
      error
    );
  }

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Wishlist",
    },
  ];

  return (
    <main className="container py-5">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="row g-4">
        <div className="col-12 col-lg-3">
          <ProfileSidebar />
        </div>

        <div className="col-12 col-lg-9">
          <Wishlist
            initialWishlist={wishlist}
          />
        </div>
      </div>
    </main>
  );
}