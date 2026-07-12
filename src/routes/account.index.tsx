import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/account/")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading: isProfileLoading, error, updateProfile } = useProfile();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    avatar_url: ""
  });

  const loading = isAuthLoading || isProfileLoading;

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        avatar_url: profile.avatar_url || ""
      });
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="surface-glass rounded-md p-10 animate-pulse">
        <div className="h-4 w-16 bg-[color:var(--foreground)]/10 rounded mb-4"></div>
        <div className="h-8 w-48 bg-[color:var(--foreground)]/10 rounded mb-4"></div>
        <div className="h-4 w-32 bg-[color:var(--foreground)]/10 rounded mb-6"></div>
        <div className="h-3 w-40 bg-[color:var(--foreground)]/10 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="surface-glass rounded-md p-10 border border-red-500/20">
        <div className="text-eyebrow text-red-500/80">Error</div>
        <div className="mt-3 text-lg text-[color:var(--muted-foreground)]">
          Could not load profile information.
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 text-sm text-[color:var(--gold)] hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!user || !profile) {
    return null; 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync(formData);
    setIsEditing(false);
  };

  return (
    <div className="surface-glass rounded-md p-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-eyebrow text-[color:var(--muted-foreground)]">Profile</div>
          <div className="text-display mt-3 text-3xl">Personal Details</div>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-ghost-lux">
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Full Name</label>
            <input 
              required 
              type="text" 
              value={formData.full_name} 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition" 
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Phone Number</label>
            <input 
              type="text" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition" 
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={updateProfile.isPending} className="btn-lux flex-1 justify-center">
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost-lux flex-1 justify-center">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-center gap-6 mb-8">
            <div className="h-20 w-20 rounded-full bg-black/5 overflow-hidden flex items-center justify-center border border-[color:var(--border)]">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name || "User"} className="w-full h-full object-cover" />
              ) : (
                <span className="text-display text-2xl text-[color:var(--muted-foreground)]">
                  {(profile.full_name || "G").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="text-display text-2xl">{profile.full_name || "Guest"}</div>
              <div className="text-sm text-[color:var(--muted-foreground)]">{profile.email}</div>
              {profile.phone && (
                <div className="text-sm text-[color:var(--muted-foreground)] mt-1">{profile.phone}</div>
              )}
            </div>
          </div>
          
          <div className="mt-8 border-t border-[color:var(--border)] pt-8">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
              Member since {new Date(profile.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
