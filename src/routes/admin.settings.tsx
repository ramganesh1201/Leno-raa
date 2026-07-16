import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import {
  Save,
  Store,
  CreditCard,
  Truck,
  FileText,
  Share2,
  Search,
  Link as LinkIcon,
} from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin_site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").single();
      if (error && error.code !== "PGRST116") throw error; // ignore no rows error
      return data || {};
    },
  });

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (newData: any) => {
      const { data: existing } = await supabase.from("site_settings").select("id").single();
      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update(newData)
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_settings").insert([newData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_site_settings"] });
      alert("Settings saved successfully!");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === "number" ? parseFloat(value) : value;
    setFormData((prev: any) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const tabs = [
    { id: "general", label: "General", icon: Store },
    { id: "payments", label: "Payments (UPI)", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "policies", label: "Legal Policies", icon: FileText },
    { id: "social", label: "Social & SEO", icon: Share2 },
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
        <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Business Settings</h1>
        <p className="text-neutral-500 mt-1">
          Configure your store's core details, payment methods, and policies.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 p-4">
          <nav className="flex md:flex-col gap-1 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? "text-blue-500" : ""} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6 lg:p-10 relative">
          <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <h3 className="text-lg font-bold mb-4">Store Details</h3>
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium mb-1">Store Name</label>
                      <input
                        type="text"
                        name="merchant_name"
                        value={formData.merchant_name || ""}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors"
                        placeholder="Lenoraa"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Support Phone</label>
                        <input
                          type="text"
                          name="support_phone"
                          value={formData.support_phone || ""}
                          onChange={handleChange}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors"
                          placeholder="+91 0000000000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Support Email</label>
                        <input
                          type="email"
                          name="support_email"
                          value={formData.support_email || ""}
                          onChange={handleChange}
                          className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors"
                          placeholder="support@lenoraa.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                  <h3 className="text-lg font-bold mb-4">Branding</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium mb-1">Logo URL</label>
                      <input
                        type="text"
                        name="logo_url"
                        value={formData.logo_url || ""}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors text-sm"
                        placeholder="https://..."
                      />
                      <p className="text-xs text-neutral-500 mt-1">Primary logo for header.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Favicon URL</label>
                      <input
                        type="text"
                        name="favicon_url"
                        value={formData.favicon_url || ""}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors text-sm"
                        placeholder="https://..."
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        16x16 or 32x32 icon for browser tabs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <h3 className="text-lg font-bold mb-4">UPI Configuration</h3>
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium mb-1">UPI ID</label>
                      <input
                        type="text"
                        name="upi_id"
                        value={formData.upi_id || ""}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors font-mono"
                        placeholder="merchant@upi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">QR Code Image URL</label>
                      <input
                        type="text"
                        name="upi_qr_url"
                        value={formData.upi_qr_url || ""}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors text-sm"
                        placeholder="https://..."
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Upload the QR to Supabase Storage and paste the public URL here.
                      </p>
                    </div>

                    {formData.upi_qr_url && (
                      <div className="mt-4 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 inline-block bg-white dark:bg-neutral-950">
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                          QR Preview
                        </p>
                        <img
                          src={formData.upi_qr_url}
                          alt="QR Preview"
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <h3 className="text-lg font-bold mb-4">Shipping Rates</h3>
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Standard Shipping Charge (₹)
                      </label>
                      <input
                        type="number"
                        name="shipping_charge"
                        value={formData.shipping_charge ?? 0}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Free Shipping Threshold (₹)
                      </label>
                      <input
                        type="number"
                        name="free_shipping_threshold"
                        value={formData.free_shipping_threshold ?? 0}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Orders above this amount will have ₹0 shipping.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "policies" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <h3 className="text-lg font-bold mb-4">Legal Documents</h3>
                  <p className="text-sm text-neutral-500 mb-4">
                    These will be displayed in the footer and checkout pages.
                  </p>
                  <div className="space-y-6 max-w-3xl">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Return & Refund Policy
                      </label>
                      <textarea
                        name="return_policy"
                        value={formData.return_policy || ""}
                        onChange={handleChange}
                        rows={6}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors custom-scrollbar"
                        placeholder="Enter return policy here..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Privacy Policy</label>
                      <textarea
                        name="privacy_policy"
                        value={formData.privacy_policy || ""}
                        onChange={handleChange}
                        rows={6}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors custom-scrollbar"
                        placeholder="Enter privacy policy here..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Terms of Service</label>
                      <textarea
                        name="terms_of_service"
                        value={formData.terms_of_service || ""}
                        onChange={handleChange}
                        rows={6}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors custom-scrollbar"
                        placeholder="Enter terms of service here..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <h3 className="text-lg font-bold mb-4">Social Media Links</h3>
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <LinkIcon size={14} /> Instagram URL
                      </label>
                      <input
                        type="text"
                        name="instagram_url"
                        value={formData.instagram_url || ""}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors text-sm"
                        placeholder="https://instagram.com/lenoraa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <LinkIcon size={14} /> Facebook URL
                      </label>
                      <input
                        type="text"
                        name="facebook_url"
                        value={formData.facebook_url || ""}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors text-sm"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        <LinkIcon size={14} /> WhatsApp URL
                      </label>
                      <input
                        type="text"
                        name="whatsapp_url"
                        value={formData.whatsapp_url || ""}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors text-sm"
                        placeholder="https://wa.me/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                  <h3 className="text-lg font-bold mb-4">Search Engine Optimization</h3>
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-sm font-medium mb-1">Global Meta Title</label>
                      <input
                        type="text"
                        name="meta_title"
                        value={formData.meta_title || ""}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors"
                        placeholder="Lenoraa | Handcrafted Luxury Soaps"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Global Meta Description
                      </label>
                      <textarea
                        name="meta_description"
                        value={formData.meta_description || ""}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                        placeholder="Shop the finest handcrafted..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex justify-end">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Save size={18} />
                {saveMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
