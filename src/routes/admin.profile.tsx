import { createFileRoute } from "@tanstack/react-router";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Shield, Key, Mail, User, Clock, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/profile")({
  component: AdminProfilePage,
});

function AdminProfilePage() {
  const { profile } = useProfile();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: "New passwords do not match." });
      return;
    }
    
    setIsUpdating(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
      if (error) throw error;
      setMessage({ type: 'success', text: "Password updated successfully." });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Failed to update password." });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Profile</h1>
        <p className="text-neutral-500 mt-1">Manage your administrator account settings and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-3xl shrink-0 border-4 border-white dark:border-neutral-900 shadow-md">
            {(profile?.full_name || profile?.email || "?")[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile?.full_name || "Administrator"}</h2>
            <p className="text-sm text-neutral-500 flex items-center justify-center gap-1 mt-1">
              <Mail size={14} />
              {profile?.email}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mt-2 border border-blue-200 dark:border-blue-900/50">
            <Shield size={12} />
            Super Admin
          </div>
        </div>

        {/* Settings & Security */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 flex items-center gap-2">
              <Key className="text-neutral-500" size={18} />
              <h2 className="font-bold">Security & Password</h2>
            </div>
            <div className="p-6">
              {message && (
                <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 text-sm font-medium ${
                  message.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {message.type === 'error' ? <AlertTriangle size={18} className="shrink-0" /> : <Shield size={18} className="shrink-0" />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {isUpdating ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 flex items-center gap-2">
              <Clock className="text-neutral-500" size={18} />
              <h2 className="font-bold">Recent Activity</h2>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {[
                { action: "Logged in", ip: "192.168.1.1", time: "Just now" },
                { action: "Updated Site Settings", ip: "192.168.1.1", time: "2 hours ago" },
                { action: "Approved Payment (Order #412)", ip: "192.168.1.1", time: "Yesterday" },
                { action: "Logged out", ip: "10.0.0.45", time: "2 days ago" },
              ].map((log, i) => (
                <div key={i} className="p-4 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{log.action}</p>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">{log.ip}</p>
                  </div>
                  <div className="text-neutral-400 text-xs">
                    {log.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
