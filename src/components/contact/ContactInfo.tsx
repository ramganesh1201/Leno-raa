import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { businessConfig } from "@/config/business";

export function ContactInfo() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h3 className="text-display text-2xl mb-6">Get in Touch</h3>
        <p className="text-[color:var(--muted-foreground)] text-sm leading-relaxed mb-8">
          Whether you have a question about our collections, need assistance with an order, or
          simply wish to say hello, we are here for you.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 rounded-full bg-[color:var(--foreground)]/5 text-[color:var(--foreground)]">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">
              Email
            </p>
            <a
              href={`mailto:${businessConfig.email}`}
              className="text-sm transition hover:text-[color:var(--gold)]"
            >
              {businessConfig.email}
            </a>
            {businessConfig.supportEmail && (
              <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                Support:{" "}
                <a
                  href={`mailto:${businessConfig.supportEmail}`}
                  className="transition hover:text-[color:var(--gold)]"
                >
                  {businessConfig.supportEmail}
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 rounded-full bg-[color:var(--foreground)]/5 text-[color:var(--foreground)]">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">
              Phone
            </p>
            <a
              href={`tel:${businessConfig.phone}`}
              className="text-sm transition hover:text-[color:var(--gold)]"
            >
              {businessConfig.phone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 rounded-full bg-[color:var(--foreground)]/5 text-[color:var(--foreground)]">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">
              Location
            </p>
            <p className="text-sm leading-relaxed max-w-[200px]">{businessConfig.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 rounded-full bg-[color:var(--foreground)]/5 text-[color:var(--foreground)]">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">
              Business Hours
            </p>
            <p className="text-sm leading-relaxed max-w-[200px]">{businessConfig.businessHours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
