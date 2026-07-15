import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCollection } from "@/lib/catalog";
import { productService } from "@/services/product.service";
import { useShop, useTheme } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { ProductEnvironment } from "@/components/product/ProductEnvironment";
import { ProductGallery } from "@/components/product/ProductGallery";
import { FloatingBenefits } from "@/components/product/FloatingBenefits";
import { RatingStars } from "@/components/product/RatingStars";
import { ProductActions } from "@/components/product/ProductActions";
import { TrustBadges } from "@/components/product/TrustBadges";
import { InteractiveIngredients } from "@/components/product/InteractiveIngredients";
import { ExpandableInfo } from "@/components/product/ExpandableInfo";
import { WhyThisSoap } from "@/components/product/WhyThisSoap";
import { CustomerReviews } from "@/components/product/CustomerReviews";
import { StickyPurchasePanel } from "@/components/product/StickyPurchasePanel";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const product = await productService.getProductBySlug(params.slug);
    if (!product) throw notFound();
    const collection = getCollection(product.collection)!;
    return { product, collection };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — ${loaderData.collection.name} — Lenoraa` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Lenoraa` },
          { property: "og:description", content: loaderData.product.tagline },
        ]
      : [{ title: "Product not found — Lenoraa" }],
  }),
  component: ProductPage,
  pendingComponent: ProductSkeleton,
  notFoundComponent: () => (
    <div className="pt-40 text-center">
      <h1 className="text-display text-4xl">Not in the atelier</h1>
      <Link to="/" className="btn-lux mt-8">Return home</Link>
    </div>
  ),
});

function ProductPage() {
  const { product, collection } = Route.useLoaderData();
  const setTheme = useTheme((s) => s.setTheme);
  const addToLocalCart = useShop((s) => s.addToCart);
  const toggleLocalWishlist = useShop((s) => s.toggleWishlist);
  const markRecentlyViewed = useShop((s) => s.markRecentlyViewed);
  const localSaved = useShop((s) => s.wishlist.includes(product.slug));
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist: supabaseWishlist, toggleWishlist: toggleSupabaseWishlist } = useWishlist();
  const navigate = useNavigate();
  
  const saved = user ? supabaseWishlist.some((w) => w.product_id === product.id) : localSaved;

  useEffect(() => {
    // We still update the global theme to maintain continuity for navigation
    setTheme(collection.slug, product.ambience);
    markRecentlyViewed(product.slug);
  }, [collection.slug, product.slug, product.ambience, setTheme, markRecentlyViewed]);

  const handleAdd = () => {
    if (user) {
      addToCart.mutate({ productId: product.id, quantity: 1 });
    } else {
      addToLocalCart(product.slug);
    }
  };

  const handleBuyNow = () => {
    if (user) {
      addToCart.mutate(
        { productId: product.id, quantity: 1 },
        { onSuccess: () => navigate({ to: "/cart" }) }
      );
    } else {
      addToLocalCart(product.slug);
      navigate({ to: "/cart" });
    }
  };

  const scrollToReviews = () => {
    const el = document.getElementById("reviews");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hasImages = product.images && product.images.length > 0;
  const galleryImages = hasImages ? product.images : (product.image ? [product.image, collection.image, product.image] : [collection.image, collection.image]);

  const expandableItems = [
    {
      title: "Ingredients",
      content: "All our ingredients are sustainably sourced and cold-processed to preserve their natural potency. See the interactive ingredients section above for a detailed breakdown."
    },
    {
      title: "How to Use",
      content: (
        <ol className="list-decimal pl-4 space-y-2">
          <li>Warm the bar between wet palms until fragrance rises.</li>
          <li>Trace slow circles across the skin. Breathe.</li>
          <li>Rinse in cool water. Pat dry. Notice.</li>
        </ol>
      )
    },
    {
      title: "Skin Type",
      content: product.skinType ? product.skinType : `Ideal for all skin types, specifically formulated for the ${collection.name} experience. Dermatologically tested and safe for sensitive skin.`
    },
    {
      title: "Shipping & Returns",
      content: "Free standard shipping on all orders. Expedited shipping available at checkout. If you are not completely satisfied, we offer easy returns within 30 days of purchase."
    }
  ];

  return (
    <ProductEnvironment product={product} collectionImage={collection.image}>
      <div className="relative pt-32 pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          
          {/* Two Column Layout */}
          <div className="grid gap-16 max-md:gap-8 lg:grid-cols-[48%_1fr]">
            
            {/* Left Column: Gallery (Scrolling Cinematic) */}
            <div className="w-full">
              <ProductGallery 
                images={galleryImages} 
                productName={product.name}
                benefits={<FloatingBenefits product={product} />}
              />
            </div>

            {/* Right Column: Details (Sticky) */}
            <div className="w-full lg:sticky lg:top-32 self-start pb-24">
              <Reveal preset="label" className="mb-6">
                <Link
                  to="/collections/$slug"
                  params={{ slug: collection.slug }}
                  className="text-eyebrow text-[color:var(--muted-foreground)] transition hover:text-[color:var(--gold)]"
                >
                  ← {collection.name}
                </Link>
              </Reveal>

              <div className="mb-4">
                <RatingStars rating={4.8} count={248} onReviewsClick={scrollToReviews} />
              </div>

              <SplitText
                as="h1"
                text={product.name}
                delay={0.1}
                className="text-display text-4xl max-md:text-4xl md:text-5xl lg:text-6xl leading-[0.95]"
              />
              
              <Reveal as="p" preset="subheading" delay={0.2} className="mt-6 text-xl italic text-[color:var(--muted-foreground)]">
                {product.tagline}
              </Reveal>

              <Reveal as="p" preset="paragraph" delay={0.3} className="mt-8 text-base leading-relaxed text-[color:var(--muted-foreground)] max-w-[65ch]">
                {product.description}
              </Reveal>

              <div className="mt-10 flex items-baseline gap-6 border-b border-[color:var(--border)] pb-10">
                <div className="text-display text-4xl text-[color:var(--foreground)]">₹{product.price}</div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                  100g · Cold-pressed
                </div>
              </div>

              <ProductActions 
                onAdd={handleAdd} 
                isAdding={addToCart.isPending}
                onSave={() => {
                  if (user) {
                    toggleSupabaseWishlist.mutate(product.id);
                  } else {
                    toggleLocalWishlist(product.slug);
                  }
                }}
                isSaving={toggleSupabaseWishlist.isPending}
                isSaved={saved}
                onBuyNow={handleBuyNow}
              />

              <TrustBadges />

              <div className="mt-12">
                <Reveal preset="label" className="text-eyebrow mb-6 text-[color:var(--gold)]">
                  Key Ingredients
                </Reveal>
                <InteractiveIngredients ingredients={product.ingredients} />
              </div>

              <div className="mt-16">
                <ExpandableInfo items={expandableItems} />
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <WhyThisSoap collection={collection.name} />
      
      <CustomerReviews productName={product.name} productId={product.id} />

      {/* Sticky Purchase Panel */}
      <StickyPurchasePanel 
        productName={product.name}
        price={product.price}
        onAdd={handleAdd}
        onBuyNow={handleBuyNow}
        image={product.image}
      />
    </ProductEnvironment>
  );
}
