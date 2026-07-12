import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { SplitText } from "@/components/immersive/SplitText";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthBackground } from "@/components/auth/AuthBackground";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Lenoraa" },
      { name: "description", content: "Join Lenoraa and begin your ritual." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    try {
      const { user, session } = await signUp.mutateAsync({ 
        email, 
        password, 
        fullName: `${firstName} ${lastName}`.trim() 
      });
      setIsSuccess(true);
      
      // If session is null, email confirmation is required
      // If user.identities is empty, it means the email is already registered (if email enumeration protection is on)
      if (!session || (user?.identities && user.identities.length === 0)) {
        setTimeout(() => navigate({ to: "/auth/verify", search: { email } }), 500);
      } else {
        // Email confirmation disabled, user is signed in
        setTimeout(() => navigate({ to: "/account" }), 500);
      }
    } catch (err: any) {
      if (err.status === 429) {
        setErrorMsg("Too many attempts. Please try again later.");
      } else {
        setErrorMsg(err.message || "Failed to create account.");
      }
    }
  };

  const handleOAuth = async (provider: "google") => {
    setIsOAuthLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign up with Google.");
      setIsOAuthLoading(false);
    }
  };

  return (
    <>
      <AuthBackground />
      <div className="relative flex min-h-[90vh] items-center justify-center pt-32 pb-24 px-4">
        <AuthCard>
          <div className="text-center mb-8">
            <div className="text-eyebrow text-[color:var(--muted-foreground)]">Begin your journey</div>
            <SplitText as="h1" text="Create Account" className="text-display mt-3 text-3xl md:text-4xl" />
          </div>

          {errorMsg && (
            <div className="mb-4 text-center text-sm text-red-500 bg-red-500/10 py-2 rounded">
              {errorMsg}
            </div>
          )}

          <OAuthButton
            provider="google"
            onClick={() => handleOAuth("google")}
            disabled={signUp.isPending || isOAuthLoading || isSuccess}
          />

          <AuthDivider />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <AuthInput
                label="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <AuthInput
                label="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              required
            />
            <AuthInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
              }}
              error={passwordError}
              required
            />

            <AuthButton
              type="submit"
              isLoading={signUp.isPending}
              isSuccess={isSuccess}
              loadingText="Preparing your atelier"
              successText="Welcome"
            >
              Join the atelier
            </AuthButton>

            <div className="mt-8 text-center text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
              <Link to="/auth/login" className="relative transition-colors duration-300 hover:text-[color:var(--gold)] before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-0 before:bg-[color:var(--gold)] before:transition-all before:duration-300 hover:before:w-full pb-1">
                Already have an account?
              </Link>
            </div>
          </form>
        </AuthCard>
      </div>
    </>
  );
}
