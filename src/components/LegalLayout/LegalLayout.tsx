import { ReactNode } from "react";

interface LegalLayoutProps {
  title: string;
  updatedAt?: string;
  children: ReactNode;
}

export function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[color:var(--background)] pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <header className="mb-16 border-b border-[color:var(--border)] pb-8 text-center md:text-left">
          <h1 className="text-display text-4xl md:text-5xl font-serif text-[color:var(--foreground)]">{title}</h1>
          {updatedAt && (
            <p className="mt-4 text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
              Last Updated: {updatedAt}
            </p>
          )}
        </header>
        <main className="prose prose-neutral prose-p:leading-relaxed prose-headings:font-serif prose-headings:font-normal prose-a:text-[color:var(--gold)] prose-a:no-underline hover:prose-a:underline max-w-none text-[color:var(--foreground)]/80">
          <div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
