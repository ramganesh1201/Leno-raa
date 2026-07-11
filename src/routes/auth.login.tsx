import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAccount } from "@/lib/store";
import { SplitText } from "@/components/immersive/SplitText";
import { Magnetic } from "@/components/immersive/Magnetic";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — Lenoraa" }, { name: "description", content: "Sign in to your Lenoraa account." }] }),
  component: LoginPage,
});

function LoginPage() {
  const signIn = useAccount((s) => s.signIn);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center pt-32 pb-24">
      <form
        onSubmit={(e) => { e.preventDefault(); signIn(email); navigate({ to: "/account" }); }}
        className="surface-glass w-full max-w-md rounded-md p-10"
      >
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Welcome back</div>
        <SplitText as="h1" text="Sign in" className="text-display mt-3 text-5xl" />
        <div className="mt-8 space-y-5">
          <Field label="Email" type="email" value={email} onChange={setEmail} required />
          <Field label="Password" type="password" value="" onChange={() => {}} />
        </div>
        <Magnetic><button className="btn-lux mt-8 w-full justify-center">Enter the atelier</button></Magnetic>
        <div className="mt-6 flex justify-between text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
          <Link to="/auth/forgot" className="hover:text-[color:var(--gold)]">Forgot</Link>
          <Link to="/auth/signup" className="hover:text-[color:var(--gold)]">Create account</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required }: { label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <div className="text-eyebrow text-[color:var(--muted-foreground)]">{label}</div>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-[color:var(--border)] bg-transparent py-3 outline-none focus:border-[color:var(--gold)]"
      />
    </label>
  );
}
