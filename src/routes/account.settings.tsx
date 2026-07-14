import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/hooks/usePreferences";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Bell, Shield, LogOut, Trash2, Mail, Moon } from "lucide-react";

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
      <div className="surface-glass rounded-[24px] p-10 animate-pulse">
        <div className="h-6 w-32 bg-[color:var(--foreground)]/10 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-48 w-full bg-[color:var(--foreground)]/5 rounded-[20px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-eyebrow text-[color:var(--muted-foreground)] mb-2">Configuration</div>
          <h1 className="text-display text-3xl">Settings</h1>
        </div>
      </div>

      <div className="grid gap-8">
        
        {/* Account & Locale Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="surface-glass rounded-[24px] border border-[color:var(--border)] overflow-hidden shadow-sm"
        >
          <div className="p-8 border-b border-[color:var(--border)] bg-black/5 dark:bg-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[color:var(--foreground)] text-[color:var(--background)] flex items-center justify-center shadow-sm">
              <Globe size={18} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[color:var(--foreground)]">Account & Display</h2>
              <p className="text-sm text-[color:var(--muted-foreground)]">Manage your language and world theme.</p>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-3 flex items-center gap-2">
                  <Globe size={14} /> Language
                </label>
                <div className="relative">
                  <select 
                    name="language" 
                    value={formData.language} 
                    onChange={handleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-4 rounded-xl text-sm focus:border-[color:var(--gold)] outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="en">English (US)</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[color:var(--muted-foreground)]">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-3 flex items-center gap-2">
                  <Moon size={14} /> World Theme
                </label>
                <div className="relative">
                  <select 
                    name="theme" 
                    value={formData.theme} 
                    onChange={handleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-4 rounded-xl text-sm focus:border-[color:var(--gold)] outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="system">System Default</option>
                    <option value="light">Always Light</option>
                    <option value="dark">Always Dark</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[color:var(--muted-foreground)]">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications & Privacy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="surface-glass rounded-[24px] border border-[color:var(--border)] overflow-hidden shadow-sm"
        >
          <div className="p-8 border-b border-[color:var(--border)] bg-black/5 dark:bg-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[color:var(--foreground)] text-[color:var(--background)] flex items-center justify-center shadow-sm">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[color:var(--foreground)]">Notifications & Privacy</h2>
              <p className="text-sm text-[color:var(--muted-foreground)]">Control how we communicate with you.</p>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-[color:var(--border)]">
              <div className="mt-1 flex-shrink-0">
                <input 
                  type="checkbox" 
                  name="marketing_emails" 
                  checked={formData.marketing_emails} 
                  onChange={handleChange} 
                  className="accent-[color:var(--gold)] w-5 h-5" 
                />
              </div>
              <div>
                <span className="text-base font-medium text-[color:var(--foreground)] block flex items-center gap-2">
                  <Mail size={16} className="text-[color:var(--gold)]" /> Marketing Communications
                </span>
                <span className="text-sm text-[color:var(--muted-foreground)] mt-1 block">Receive exclusive offers, atelier updates, and early access to new collections.</span>
              </div>
            </label>

            <div className="h-px bg-[color:var(--border)] w-full"></div>

            <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-[color:var(--border)]">
              <div className="mt-1 flex-shrink-0">
                <input 
                  type="checkbox" 
                  name="notifications" 
                  checked={formData.notifications} 
                  onChange={handleChange} 
                  className="accent-[color:var(--gold)] w-5 h-5" 
                />
              </div>
              <div>
                <span className="text-base font-medium text-[color:var(--foreground)] block flex items-center gap-2">
                  <Package size={16} className="text-[color:var(--gold)]" /> Order Notifications
                </span>
                <span className="text-sm text-[color:var(--muted-foreground)] mt-1 block">Get essential updates on your ritual status, shipping, and delivery.</span>
              </div>
            </label>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="surface-glass rounded-[24px] border border-red-500/20 overflow-hidden shadow-sm"
        >
          <div className="p-8 border-b border-red-500/10 bg-red-500/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shadow-sm border border-red-500/20">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-lg font-medium text-red-500">Security & Account</h2>
              <p className="text-sm text-red-500/80">Manage access to your account.</p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="text-base font-medium text-[color:var(--foreground)]">Sign out of Atelier</h3>
                <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                  You will need to sign in again to access your saved rituals.
                </p>
              </div>
              
              <button 
                onClick={handleSignOut} 
                disabled={signOut.isPending}
                className="btn-ghost-lux text-[color:var(--foreground)] hover:text-red-500 hover:border-red-500/30 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} /> {signOut.isPending ? "Signing out..." : "Sign out"}
              </button>
            </div>
            
            <div className="h-px bg-[color:var(--border)] w-full my-8"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="text-base font-medium text-red-500">Delete Account</h3>
                <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                  Permanently remove your account and all associated data.
                </p>
              </div>
              
              <button 
                className="btn-ghost-lux bg-red-500/5 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
// Using lucide-react icons, I need to add Package to the imports
import { Package } from "lucide-react";
