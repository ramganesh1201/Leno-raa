import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useOrders } from "@/hooks/useOrders";
import { useWishlist } from "@/hooks/useWishlist";
import { useShop } from "@/lib/store";
import { motion } from "framer-motion";
import { Package, Heart, Sparkles, Clock, Edit2, ShoppingBag, User } from "lucide-react";

export const Route = createFileRoute("/account/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading: isProfileLoading, error, updateProfile } = useProfile();
  const { orders } = useOrders();
  const { wishlist } = useWishlist();
  const savedDesigns = useShop(s => s.savedDesigns);
  const recentlyViewed = useShop(s => s.recentlyViewed);
  
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
      <div className="surface-glass rounded-[24px] p-10 animate-pulse">
        <div className="h-24 w-full bg-[color:var(--foreground)]/5 rounded-xl mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-[color:var(--foreground)]/5 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="surface-glass rounded-[24px] p-10 border border-red-500/20">
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

  const displayName = profile.full_name || user.user_metadata?.full_name || "Guest";
  const activeOrders = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled").length;

  const stats = [
    { label: "Active Orders", value: activeOrders, icon: Package, to: "/account/orders" },
    { label: "Saved Soaps", value: wishlist.length, icon: Heart, to: "/wishlist" },
    { label: "Custom Rituals", value: savedDesigns.length, icon: Sparkles, to: "/account/saved-designs" },
    { label: "Recently Viewed", value: recentlyViewed.length, icon: Clock, to: "/account/recently-viewed" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden surface-glass rounded-[24px] border border-[color:var(--border)] p-8 md:p-12 shadow-sm"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[color:var(--gold)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/10 text-[color:var(--gold)] flex items-center justify-center shrink-0 shadow-sm">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={32} strokeWidth={1} />
              )}
            </div>
            <div>
              <div className="text-eyebrow text-[color:var(--muted-foreground)] tracking-widest mb-1.5">Welcome back to your Atelier</div>
              <h1 className="text-display text-4xl text-[color:var(--foreground)]">{displayName}</h1>
              <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">Member since {new Date(profile.created_at).getFullYear()}</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 w-full md:w-auto">
            <Link to="/collections/$slug" params={{ slug: "radiance" }} className="btn-lux justify-center whitespace-nowrap shadow-md max-md:w-full max-md:py-4">
              <ShoppingBag size={16} className="mr-2" /> Browse Collection
            </Link>
            <Link to="/customize" className="btn-ghost-lux justify-center whitespace-nowrap bg-black/5 dark:bg-white/5 max-md:w-full max-md:py-4">
              <Sparkles size={16} className="mr-2" /> Customize Soap
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={s.to} className="group block surface-glass rounded-[24px] p-6 border border-[color:var(--border)] hover:border-[color:var(--gold)]/30 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <s.icon size={20} className="text-[color:var(--muted-foreground)] group-hover:text-[color:var(--gold)] transition-colors mb-4" />
              <div className="text-3xl font-light text-[color:var(--foreground)] mb-1">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.2 }}>{s.value}</motion.span>
              </div>
              <div className="text-xs tracking-widest uppercase text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)] transition-colors">{s.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Profile Details Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="surface-glass rounded-[24px] border border-[color:var(--border)] p-8 md:p-10 shadow-sm"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-display text-2xl text-[color:var(--foreground)]">Personal Information</h2>
            <div className="text-sm text-[color:var(--muted-foreground)] mt-2">Manage your atelier identity</div>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm text-[color:var(--muted-foreground)] hover:text-[color:var(--gold)] transition-colors p-2 -mr-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
              <Edit2 size={16} /> <span className="hidden sm:inline font-medium tracking-wide">Edit Profile</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <motion.form 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onSubmit={handleSubmit} 
            className="space-y-6 max-w-md bg-black/5 dark:bg-white/5 p-6 rounded-xl border border-[color:var(--border)]"
          >
            <div>
              <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Full Name</label>
              <input 
                required 
                type="text" 
                value={formData.full_name} 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full bg-transparent border-b border-[color:var(--border)] py-2 text-[color:var(--foreground)] focus:border-[color:var(--gold)] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Phone</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-transparent border-b border-[color:var(--border)] py-2 text-[color:var(--foreground)] focus:border-[color:var(--gold)] outline-none transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={updateProfile.isPending}
                className="btn-lux"
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="text-sm font-medium tracking-wide text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors px-4 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        ) : (
          <div className="grid sm:grid-cols-2 gap-y-8 gap-x-12">
            <div>
              <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Full Name</div>
              <div className="text-lg text-[color:var(--foreground)]">{profile.full_name || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Email</div>
              <div className="text-lg text-[color:var(--foreground)]">{profile.email}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Phone</div>
              <div className="text-lg text-[color:var(--foreground)]">{profile.phone || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Member ID</div>
              <div className="text-sm text-[color:var(--muted-foreground)] font-mono bg-black/5 dark:bg-white/5 px-3 py-1 rounded inline-block">{profile.id.split('-')[0].toUpperCase()}</div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
