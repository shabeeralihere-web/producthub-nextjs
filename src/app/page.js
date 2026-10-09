import Link from "next/link";
import styles from "./page.module.css";
import { getFeaturedProducts } from "@/services/productService";
import HomeReveal from "@/components/home/HomeReveal";
import ProductCard from "@/components/products/ProductCard";

export default async function HomePage() {
  let products = [];

  try {
    const result = await getFeaturedProducts();
    products = result.data || [];
  } catch (error) {
    console.error("Failed to load featured products:", error);
  }

  return (
    <main className={styles.home}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>

        <div className="container">
          <div className={styles.heroGrid}>
            <HomeReveal className={styles.heroContent}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowDot}></span>
                A simpler way to shop
              </div>

              <h1 className={styles.heroTitle}>
                Find what you want.
                <span> Buy with confidence.</span>
              </h1>

              <p className={styles.heroText}>
                Discover products from independent sellers, keep your
                purchases organized, and enjoy a simpler shopping experience
                from one place.
              </p>

              <div className={styles.heroActions}>
                <Link href="/products" className={styles.primaryButton}>
                  Explore products
                  <span>↗</span>
                </Link>

                <Link href="/signup" className={styles.secondaryButton}>
                  Start selling
                </Link>
              </div>

              <div className={styles.heroMeta}>
                <div>
                  <strong>Simple</strong>
                  <span>Easy to browse</span>
                </div>

                <div>
                  <strong>Flexible</strong>
                  <span>Buy or sell</span>
                </div>

                <div>
                  <strong>Organized</strong>
                  <span>Manage everything</span>
                </div>
              </div>
            </HomeReveal>

            <HomeReveal
              className={styles.heroVisual}
              delay="160ms"
            >
              <div className={styles.heroPanel}>
                <div className={styles.panelTop}>
                  <div>
                    <span>PRODUCTHUB</span>
                    <strong>Discover something new</strong>
                  </div>

                  <div className={styles.panelIndicator}>
                    <span></span>
                    Live
                  </div>
                </div>

                <div className={styles.panelMain}>
                  <div className={styles.panelCircle}>
                    <span>✦</span>
                  </div>

                  <div>
                    <small>SHOP YOUR WAY</small>
                    <h3>Browse. Choose. Enjoy.</h3>
                  </div>
                </div>

                <div className={styles.panelBottom}>
                  <span>Products</span>
                  <span>Cart</span>
                  <span>Orders</span>
                </div>
              </div>
            </HomeReveal>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className={styles.featureStrip}>
        <div className="container">
          <HomeReveal className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <span className={styles.featureNumber}>01</span>
              <div>
                <strong>Discover</strong>
                <p>Explore products from different sellers.</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.featureNumber}>02</span>
              <div>
                <strong>Choose</strong>
                <p>Compare what fits your needs.</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.featureNumber}>03</span>
              <div>
                <strong>Order</strong>
                <p>Keep your purchases organized.</p>
              </div>
            </div>
          </HomeReveal>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className={styles.productsSection}>
        <div className="container">
          <HomeReveal>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionLabel}>
                  Worth a look
                </span>

                <h2>Featured products</h2>

                <p>
                  Explore products currently available on ProductHub.
                </p>
              </div>

              <Link
                href="/products"
                className={styles.textLink}
              >
                View all products
                <span>→</span>
              </Link>
            </div>
          </HomeReveal>

          {products.length > 0 ? (
            <div className={styles.productGrid}>
              {products.map((product, index) => (
                <HomeReveal
                  key={product._id}
                  delay={`${index * 70}ms`}
                >
                  <ProductCard product={product} />
                </HomeReveal>
              ))}
            </div>
          ) : (
            <HomeReveal>
              <div className={styles.emptyProducts}>
                <span>Nothing featured yet.</span>
                <p>
                  New products will appear here as sellers add them.
                </p>

                <Link
                  href="/products"
                  className={styles.primaryButton}
                >
                  Browse products
                  <span>↗</span>
                </Link>
              </div>
            </HomeReveal>
          )}
        </div>
      </section>

      {/* SHOPPING EXPERIENCE */}
      <section className={styles.experienceSection}>
        <div className="container">
          <div className={styles.experienceGrid}>
            <HomeReveal className={styles.experienceIntro}>
              <span className={styles.sectionLabel}>
                Designed to stay simple
              </span>

              <h2>
                Everything you need.
                <span> Nothing you don't.</span>
              </h2>

              <p>
                ProductHub keeps shopping straightforward — from discovering
                a product to keeping track of what you ordered.
              </p>

              <Link
                href="/products"
                className={styles.secondaryButton}
              >
                Start exploring
              </Link>
            </HomeReveal>

            <div className={styles.experienceList}>
              <HomeReveal
                className={styles.experienceCard}
                delay="80ms"
              >
                <span>01</span>

                <div>
                  <h3>Find products quickly</h3>
                  <p>
                    Browse a focused marketplace without getting lost in
                    unnecessary steps.
                  </p>
                </div>

                <strong>→</strong>
              </HomeReveal>

              <HomeReveal
                className={styles.experienceCard}
                delay="150ms"
              >
                <span>02</span>

                <div>
                  <h3>Keep your cart organized</h3>
                  <p>
                    Add what you want and adjust quantities before checkout.
                  </p>
                </div>

                <strong>→</strong>
              </HomeReveal>

              <HomeReveal
                className={styles.experienceCard}
                delay="220ms"
              >
                <span>03</span>

                <div>
                  <h3>Track your purchases</h3>
                  <p>
                    Keep your orders and delivery details together in one
                    place.
                  </p>
                </div>

                <strong>→</strong>
              </HomeReveal>
            </div>
          </div>
        </div>
      </section>

      {/* SELLER SECTION */}
      <section className={styles.sellerSection}>
        <div className="container">
          <HomeReveal className={styles.sellerCard}>
            <div className={styles.sellerGlow}></div>

            <div className={styles.sellerContent}>
              <span className={styles.sectionLabel}>
                For sellers
              </span>

              <h2>
                Have something worth selling?
              </h2>

              <p>
                Bring your products to ProductHub, manage your listings,
                and keep your store organized from your seller dashboard.
              </p>

              <div className={styles.sellerActions}>
                <Link
                  href="/signup"
                  className={styles.primaryButton}
                >
                  Become a seller
                  <span>↗</span>
                </Link>

                <Link
                  href="/login"
                  className={styles.textLink}
                >
                  Already have an account?
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className={styles.sellerVisual}>
              <div className={styles.sellerOrb}>
                <span>↗</span>
              </div>

              <div className={styles.sellerMiniCard}>
                <span>SELLER DASHBOARD</span>
                <strong>Manage your products</strong>
              </div>
            </div>
          </HomeReveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalSection}>
        <div className="container">
          <HomeReveal className={styles.finalContent}>
            <span className={styles.sectionLabel}>
              Ready when you are
            </span>

            <h2>
              Your next find
              <span> could be here.</span>
            </h2>

            <p>
              Explore the latest products available on ProductHub.
            </p>

            <Link
              href="/products"
              className={styles.primaryButton}
            >
              Explore products
              <span>↗</span>
            </Link>
          </HomeReveal>
        </div>
      </section>
    </main>
  );
}