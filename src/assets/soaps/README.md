# Product Photography

Drop real product photos in this folder to replace the crafted CSS soap
renderings on cards and product pages.

## Adding an image

1. Save the file here using the product slug as the filename, e.g.
   `lavender.jpg`, `orange.webp`, `sandalwood.png`. Supported formats:
   PNG, JPG/JPEG, WEBP.
2. Import it in `src/lib/catalog.ts` and attach it to the `image` field on
   the matching product:

   ```ts
   import lavender from "@/assets/soaps/lavender.jpg";

   // ...inside the products array:
   {
     slug: "lavender",
     // ...
     image: lavender,
   }
   ```

That's it — the card and product page pick it up automatically. Cards use
`object-cover` inside a 4:3 frame, so shoot with the product roughly
centered for consistent framing.

## Recommended specs

- 1600×1200 minimum, sRGB, transparent or soft neutral backdrop.
- Compress WEBP/JPG to ~200–400 KB for fast loading.
- Keep the product away from the frame edges — the card gently scales on
  hover so a little breathing room reads best.
