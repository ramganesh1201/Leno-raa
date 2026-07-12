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
      <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <div key={i} className="flex flex-col items-center justify-center gap-3 text-center group cursor-default">
              <div className="rounded-full bg-[color:var(--muted)] p-3 text-[color:var(--muted-foreground)] transition-colors duration-300 group-hover:bg-[color:var(--gold)]/10 group-hover:text-[color:var(--gold)]">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)] max-w-[80px]">
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
