import { ReactNode } from "react";

interface PolicySectionProps {
  title: string;
  children: ReactNode;
}

export function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <section className="mb-10">
      <h2 className="text-display text-2xl mb-4 text-[color:var(--foreground)]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
