import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SplitText } from "@/components/immersive/SplitText";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthBackground } from "@/components/auth/AuthBackground";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({
    meta: [
      { title: "Reset password — Lenoraa" },
      { name: "description", content: "Recover your Lenoraa account." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setSent(true);
      }, 500);
    }, 1200);
  };

  return (
    <>
      <AuthBackground />
      <div className="relative flex min-h-[80vh] items-center justify-center pt-32 pb-24 px-4">
        <AuthCard>
          <div className="text-center mb-8">
            <div className="text-eyebrow text-[color:var(--muted-foreground)]">Recovery</div>
            <SplitText as="h1" text="Forgot password" className="text-display mt-3 text-3xl md:text-4xl" />
          </div>
          
          {sent ? (
            <p className="mt-6 text-sm text-[color:var(--muted-foreground)] text-center leading-relaxed">
              If an account exists for that email, we'll send a reset link shortly.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <AuthInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <AuthButton
                type="submit"
                isLoading={isLoading}
                isSuccess={isSuccess}
                loadingText="Verifying details"
                successText="Link Sent"
              >
                Send reset link
              </AuthButton>
            </form>
          )}

          <div className="mt-8 text-center text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            <Link to="/auth/login" className="relative transition-colors duration-300 hover:text-[color:var(--gold)] before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-0 before:bg-[color:var(--gold)] before:transition-all before:duration-300 hover:before:w-full pb-1">
              Back to sign in
            </Link>
          </div>
        </AuthCard>
      </div>
    </>
  );
}
