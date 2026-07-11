import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SplitText } from "@/components/immersive/SplitText";
import { Magnetic } from "@/components/immersive/Magnetic";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({ meta: [{ title: "Reset password — Lenoraa" }, { name: "description", content: "Recover your Lenoraa account." }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center pt-32 pb-24">
      <form
        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        className="surface-glass w-full max-w-md rounded-md p-10"
      >
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Recovery</div>
        <SplitText as="h1" text="Forgot password" className="text-display mt-3 text-4xl" />
        {sent ? (
          <p className="mt-6 text-sm text-[color:var(--muted-foreground)]">
            If an account exists for that email, we'll send a reset link shortly.
          </p>
        ) : (
          <>
            <label className="mt-8 block">
              <div className="text-eyebrow text-[color:var(--muted-foreground)]">Email</div>
              <input type="email" required className="mt-2 w-full border-b border-[color:var(--border)] bg-transparent py-3 outline-none focus:border-[color:var(--gold)]" />
            </label>
            <Magnetic><button className="btn-lux mt-8 w-full justify-center">Send reset link</button></Magnetic>
          </>
        )}
        <div className="mt-6 text-center text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
          <Link to="/auth/login" className="hover:text-[color:var(--gold)]">Back to sign in</Link>
        </div>
      </form>
    </div>
  );
}
