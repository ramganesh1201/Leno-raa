import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CinematicIntro } from "@/components/CinematicIntro";
import { AmbienceLayer } from "@/components/immersive/AmbienceLayer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { PageTransition } from "@/components/immersive/PageTransition";

const LuxuryCursor = lazy(() =>
  import("@/components/immersive/LuxuryCursor").then((m) => ({ default: m.LuxuryCursor })),
);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">404</div>
        <h1 className="text-display mt-4 text-3xl md:text-4xl">Off the trail</h1>
        <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">
          This page has drifted away like a petal in the breeze.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-lux">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  if (
    typeof window !== "undefined" &&
    error.message?.includes("Failed to fetch dynamically imported module")
  ) {
    window.location.reload();
    return null;
  }

  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-display text-4xl">Something wilted</h1>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
          A moment please. You can try again or return home.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-lux"
          >
            Try again
          </button>
          <a href="/" className="btn-ghost-lux">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lenoraa — Nature Crafted Into Luxury" },
      {
        name: "description",
        content:
          "Handcrafted luxury skincare and cold-processed soap. Doctor-formulated, botanically sourced, made in small batches.",
      },
      { name: "author", content: "Lenoraa" },
      { property: "og:title", content: "Lenoraa — Nature Crafted Into Luxury" },
      {
        property: "og:description",
        content: "An immersive world of handcrafted luxury soap. Explore five botanical chapters.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('vite:preloadError', function(event) {
                window.location.reload();
              });
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { AuthProvider } from "@/components/auth/AuthProvider";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouter();
  const pathname = routerState.state.location.pathname;
  const isAdmin = pathname.startsWith("/admin");
  const isProductDetail = pathname.startsWith("/products/");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {!isAdmin && <CinematicIntro />}
          {!isAdmin && <AmbienceLayer />}
          {!isAdmin && (
            <Suspense fallback={null}>
              <LuxuryCursor />
            </Suspense>
          )}
          {!isAdmin && <SiteHeader />}
          <main className={!isAdmin ? "min-h-screen" : ""}>
            {isAdmin ? (
              <Outlet />
            ) : (
              <PageTransition>
                <Outlet />
              </PageTransition>
            )}
          </main>
          {!isAdmin && !isProductDetail && <SiteFooter />}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
