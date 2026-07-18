import { Leaf, ShieldCheck, Droplets, Rabbit, Recycle, FlaskConical } from "lucide-react";

export function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, label: "Dermatologically Tested" },
    { icon: Droplets, label: "100% Cold Processed" },
    { icon: Rabbit, label: "Cruelty Free" },
    { icon: Leaf, label: "Natural Oils" },
    { icon: Recycle, label: "Reusable Packaging" },
    { icon: FlaskConical, label: "No Sulphates" },
  ];

  return (
    <div className="mt-12 py-8 border-y border-[color:var(--border)]">
      <div className="grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-6">
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <div
              key={i}
              className="flex flex-row md:flex-col items-center justify-start md:justify-center gap-3 md:gap-3 text-left md:text-center group cursor-default bg-[color:var(--muted)]/30 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none"
            >
              <div className="rounded-full bg-[color:var(--background)] md:bg-[color:var(--muted)] p-2 md:p-3 text-[color:var(--muted-foreground)] transition-colors duration-300 group-hover:bg-[color:var(--gold)]/10 group-hover:text-[color:var(--gold)] shrink-0 shadow-sm md:shadow-none">
                <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[color:var(--foreground)] md:text-[color:var(--muted-foreground)] max-w-full md:max-w-[80px] leading-snug">
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
