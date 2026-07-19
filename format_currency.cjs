const fs = require("fs");

const files = [
  "src/components/ProductCard.tsx",
  "src/components/product/StickyPurchasePanel.tsx",
  "src/routes/account.orders.$orderId.tsx",
  "src/routes/account.orders.tsx",
  "src/routes/account.recently-viewed.tsx",
  "src/routes/account.saved-designs.tsx",
  "src/routes/admin.analytics.tsx",
  "src/routes/admin.coupons.tsx",
  "src/routes/admin.customers.tsx",
  "src/routes/admin.orders.tsx",
  "src/routes/admin.payments.tsx",
  "src/routes/admin.products.tsx",
  "src/routes/cart.tsx",
  "src/routes/checkout.tsx",
  "src/routes/customize.tsx",
  "src/routes/payment.$orderId.tsx",
  "src/routes/products.$slug.tsx",
  "src/routes/wishlist.tsx",
];

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");

  // Custom replacements to be safe
  content = content.replace(
    /₹\{product\.price \|\| "---"\}/g,
    '₹{product.price ? new Intl.NumberFormat("en-IN").format(product.price) : "---"}',
  );

  // Generic replacements for ₹{expr} where expr is simple, like item.price * item.quantity or product.price
  // We avoid replacing if already formatted
  content = content.replace(/₹\{([^}]+)\}/g, (match, expr) => {
    if (
      expr.includes("Intl.NumberFormat") ||
      expr.includes("toLocaleString") ||
      expr.includes("?")
    ) {
      return match; // Skip
    }
    return `₹{new Intl.NumberFormat("en-IN").format(${expr})}`;
  });

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
