import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/profile.service";
import { supabase } from "@/lib/supabase";
import { SplitText } from "@/components/immersive/SplitText";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthBackground } from "@/components/auth/AuthBackground";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Lenoraa" },
      { name: "description", content: "Sign in to your Lenoraa account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (email === "demo@lenoraa.com") {
        await new Promise(r => setTimeout(r, 1200));
        setIsSuccess(true);
        setTimeout(() => navigate({ to: "/account" }), 1200);
      } else {
        const { user } = await signIn.mutateAsync({ email, password });
        console.log("Authenticated User ID:", user?.id);
        setIsSuccess(true);
        
        setTimeout(async () => {
          try {
            if (!user) {
              navigate({ to: "/" });
              return;
            }
            const profile = await profileService.getProfile(user);
            console.log("Fetched Profile:", profile);
            console.log("Profile Role:", profile?.role);
            
            if (profile?.role === 'admin') {
              console.log("Redirect Destination: /admin");
              navigate({ to: "/admin" });
            } else {
              console.log("Redirect Destination: /");
              navigate({ to: "/" });
            }
          } catch (e: any) {
            console.error("Profile load failed during redirect:", e);
            setErrorMsg(e.message || "Failed to load user profile. Please try again or contact support.");
            setIsSuccess(false);
          }
        }, 1200);
      }
    } catch (err: any) {
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("email not confirmed")) {
        // Redirect to verify page
        navigate({ to: "/auth/verify", search: { email } });
      } else {
        setErrorMsg(err.message || "Invalid credentials. Please try again.");
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
      setErrorMsg(err.message || "Failed to sign in with Google.");
      setIsOAuthLoading(false);
    }
  };

  return (
    <>
      <AuthBackground />
      <div className="relative flex min-h-[80vh] items-center justify-center pt-32 pb-24 px-4">
        <AuthCard>
          <div className="text-center mb-8">
            <div className="text-eyebrow text-[color:var(--muted-foreground)]">Welcome back</div>
            <SplitText as="h1" text="Sign in" className="text-display mt-3 text-3xl md:text-4xl" />
          </div>

          {errorMsg && (
            <div className="mb-4 text-center text-sm text-red-500 bg-red-500/10 py-2 rounded">
              {errorMsg}
            </div>
          )}

          <OAuthButton
            provider="google"
            onClick={() => handleOAuth("google")}
            disabled={signIn.isPending || isOAuthLoading || isSuccess}
          />

          <AuthDivider />

          <form onSubmit={handleSubmit}>
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <AuthButton
              type="submit"
              isLoading={signIn.isPending}
              isSuccess={isSuccess}
              loadingText="Entering Lenoraa"
              successText="Welcome Back"
            >
              Enter the atelier
            </AuthButton>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4 text-sm text-[color:var(--muted-foreground)]">
            <Link to="/auth/forgot" className="transition hover:text-[color:var(--gold)]">
              Forgot password?
            </Link>
            <div className="flex gap-2">
              <span>New to Lenoraa?</span>
              <Link to="/auth/signup" className="text-[color:var(--foreground)] transition hover:text-[color:var(--gold)]">
                Create an account
              </Link>
            </div>
          </div>
        </AuthCard>
      </div>
    </>
  );
}
