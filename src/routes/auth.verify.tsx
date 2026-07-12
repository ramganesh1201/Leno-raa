import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SplitText } from "@/components/immersive/SplitText";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthBackground } from "@/components/auth/AuthBackground";

export const Route = createFileRoute("/auth/verify")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) || "",
    };
  },
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { email } = Route.useSearch();
  const { resendVerification } = useAuth();
  
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleResend = async () => {
    if (!email) {
      setErrorMsg("No email address provided.");
      return;
    }
    
    setIsResending(true);
    setErrorMsg("");
    try {
      await resendVerification.mutateAsync(email);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000); // Reset success state after 3s
    } catch (err: any) {
      // Supabase rate limits resends, so handle gracefully
      if (err.status === 429) {
         setErrorMsg("Please wait a moment before requesting another email.");
      } else {
         setErrorMsg(err.message || "Failed to resend verification email.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <AuthBackground />
      <div className="relative flex min-h-[80vh] items-center justify-center pt-32 pb-24 px-4">
        <AuthCard>
          <div className="text-center mb-8">
            <div className="text-eyebrow text-[color:var(--muted-foreground)]">Almost there</div>
            <SplitText as="h1" text="Verify Your Email" className="text-display mt-3 text-3xl md:text-4xl" />
          </div>

          <div className="text-center mb-8 text-[color:var(--muted-foreground)] text-sm md:text-base leading-relaxed">
            We have sent a verification link to<br />
            <strong className="text-[color:var(--foreground)] mt-2 inline-block text-lg">{email || "your email address"}</strong>
            <br /><br />
            Please click the link in that email to complete your registration and enter the atelier.
          </div>

          {errorMsg && (
            <div className="mb-6 text-center text-sm text-red-500 bg-red-500/10 py-2 rounded">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <AuthButton
              type="button"
              onClick={handleResend}
              isLoading={resendVerification.isPending || isResending}
              isSuccess={isSuccess}
              loadingText="Sending"
              successText="Email Sent"
              className="bg-transparent border border-[color:var(--border)] text-[color:var(--foreground)] hover:bg-[color:var(--border)]/50"
            >
              Resend Verification Email
            </AuthButton>

            <Link to="/auth/login" className="w-full" disabled={resendVerification.isPending || isResending}>
              <AuthButton type="button" disabled={resendVerification.isPending || isResending}>
                Go to Sign In
              </AuthButton>
            </Link>
          </div>
        </AuthCard>
      </div>
    </>
  );
}
