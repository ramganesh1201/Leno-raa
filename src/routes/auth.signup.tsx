import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAccount } from "@/lib/store";
import { SplitText } from "@/components/immersive/SplitText";
import { Magnetic } from "@/components/immersive/Magnetic";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Create account — Lenoraa" }, { name: "description", content: "Join Lenoraa." }] }),
  component: SignupPage,
});

function SignupPage() {
  const signIn = useAccount((s) => s.signIn);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center pt-32 pb-24">
      <form
        onSubmit={(e) => { e.preventDefault(); signIn(email, name); navigate({ to: "/account" }); }}
        className="surface-glass w-full max-w-md rounded-md p-10"
      >
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Begin</div>
        <SplitText as="h1" text="Create your account" className="text-display mt-3 text-5xl" />
        <div className="mt-8 space-y-5">
          <label className="block">
            <div className="text-eyebrow text-[color:var(--muted-foreground)]">Name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-2 w-full border-b border-[color:var(--border)] bg-transparent py-3 outline-none focus:border-[color:var(--gold)]" />
          </label>
          <label className="block">
            <div className="text-eyebrow text-[color:var(--muted-foreground)]">Email</div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full border-b border-[color:var(--border)] bg-transparent py-3 outline-none focus:border-[color:var(--gold)]" />
          </label>
          <label className="block">
            <div className="text-eyebrow text-[color:var(--muted-foreground)]">Password</div>
            <input type="password" className="mt-2 w-full border-b border-[color:var(--border)] bg-transparent py-3 outline-none focus:border-[color:var(--gold)]" />
          </label>
        </div>
        <Magnetic><button className="btn-lux mt-8 w-full justify-center">Join the atelier</button></Magnetic>
        <div className="mt-6 text-center text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
          <Link to="/auth/login" className="hover:text-[color:var(--gold)]">Already have an account?</Link>
        </div>
      </form>
    </div>
  );
}
