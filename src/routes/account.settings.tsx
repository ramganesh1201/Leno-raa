import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/hooks/usePreferences";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/account/settings")({
  component: Settings,
});

function Settings() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { preferences, isLoading, updatePreferences } = usePreferences();
  
  const [formData, setFormData] = useState({
    theme: 'system',
    language: 'en',
    marketing_emails: false,
    notifications: true
  });

  useEffect(() => {
    if (preferences) {
      setFormData({
        theme: preferences.theme || 'system',
        language: preferences.language || 'en',
        marketing_emails: preferences.marketing_emails ?? false,
        notifications: preferences.notifications ?? true
      });
    }
  }, [preferences]);

  const handleSignOut = async () => {
    await signOut.mutateAsync();
    navigate({ to: "/" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    updatePreferences.mutate({ [name]: value });
  };

  if (isLoading) {
    return (
      <div className="surface-glass rounded-md p-10 animate-pulse">
        <div className="h-6 w-32 bg-[color:var(--foreground)]/10 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-24 w-full bg-[color:var(--foreground)]/5 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="surface-glass rounded-md p-10">
        <div className="text-eyebrow text-[color:var(--muted-foreground)]">Settings</div>
        <div className="text-display mt-3 text-3xl mb-8">Preferences</div>
        
        <div className="space-y-8 max-w-md">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-3">Language</label>
            <select 
              name="language" 
              value={formData.language} 
              onChange={handleChange}
              className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition appearance-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-3">World Theme</label>
            <select 
              name="theme" 
              value={formData.theme} 
              onChange={handleChange}
              className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition appearance-none cursor-pointer"
            >
              <option value="system">System Default</option>
              <option value="light">Always Light</option>
              <option value="dark">Always Dark</option>
            </select>
            <p className="text-xs text-[color:var(--muted-foreground)] mt-2">Lenoraa dynamically adapts to collections, but you can force a base theme.</p>
          </div>

          <div className="pt-4 border-t border-[color:var(--border)] space-y-4">
            <label className="flex items-center gap-4 cursor-pointer">
              <input 
                type="checkbox" 
                name="marketing_emails" 
                checked={formData.marketing_emails} 
                onChange={handleChange} 
                className="accent-[color:var(--gold)] w-4 h-4" 
              />
              <div>
                <span className="text-sm text-[color:var(--foreground)] block">Marketing Communications</span>
                <span className="text-xs text-[color:var(--muted-foreground)]">Receive exclusive offers and atelier updates.</span>
              </div>
            </label>

            <label className="flex items-center gap-4 cursor-pointer">
              <input 
                type="checkbox" 
                name="notifications" 
                checked={formData.notifications} 
                onChange={handleChange} 
                className="accent-[color:var(--gold)] w-4 h-4" 
              />
              <div>
                <span className="text-sm text-[color:var(--foreground)] block">Order Notifications</span>
                <span className="text-xs text-[color:var(--muted-foreground)]">Get updates on your ritual status.</span>
              </div>
            </label>
          </div>

        </div>
      </div>

      <div className="surface-glass rounded-md p-10 border border-red-500/10">
        <div className="text-display text-2xl text-red-500/80 mb-2">Danger Zone</div>
        <p className="text-sm text-[color:var(--muted-foreground)] mb-6">
          Sign out of your account or permanently delete your data.
        </p>
        <button 
          onClick={handleSignOut} 
          disabled={signOut.isPending}
          className="btn-ghost-lux text-red-500/80 border-red-500/20 hover:border-red-500/50 hover:text-red-500"
        >
          {signOut.isPending ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  );
}
