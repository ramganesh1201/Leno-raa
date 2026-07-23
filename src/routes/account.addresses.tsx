import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAddresses } from "@/hooks/useAddresses";
import type { AddressType } from "@/services/address.service";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, MapPin, Check } from "lucide-react";

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});

function AddressesPage() {
  const { addresses, isLoading, addAddress, updateAddress, deleteAddress } = useAddresses();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="surface-glass rounded-[24px] p-10 animate-pulse">
        <div className="h-6 w-32 bg-[color:var(--foreground)]/10 rounded mb-8"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-48 w-full bg-[color:var(--foreground)]/5 rounded-[20px]"></div>
          <div className="h-48 w-full bg-[color:var(--foreground)]/5 rounded-[20px]"></div>
        </div>
      </div>
    );
  }

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-eyebrow text-[color:var(--muted-foreground)] mb-2">Destinations</div>
          <h1 className="text-display text-3xl">Shipping Addresses</h1>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-lux hidden sm:inline-flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Add Address
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="surface-glass p-8 rounded-[24px] border border-[color:var(--border)] mb-8 shadow-sm">
              <h3 className="text-xl mb-6 font-medium text-[color:var(--foreground)]">
                Add New Address
              </h3>
              <AddressForm
                onSave={async (data) => {
                  await addAddress.mutateAsync(data);
                  setIsAdding(false);
                }}
                onCancel={handleCancel}
                isPending={addAddress.isPending}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAdding && addresses.length === 0 && !editingId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-glass rounded-[24px] p-16 text-center border border-[color:var(--border)] shadow-sm max-w-2xl mx-auto mt-12"
        >
          <div className="w-24 h-24 mx-auto mb-6 text-[color:var(--border)] opacity-50 flex items-center justify-center rounded-full border border-[color:var(--border)]">
            <MapPin size={32} strokeWidth={1} />
          </div>
          <h2 className="text-display text-2xl mb-3">No saved addresses</h2>
          <p className="text-[color:var(--muted-foreground)] mb-8">
            Add a shipping address for a smoother checkout ritual.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-lux inline-flex items-center gap-2 justify-center"
          >
            <Plus size={16} /> Add Address
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {addresses.map((address: any) => (
            <motion.div
              key={address.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {editingId === address.id ? (
                <div className="surface-glass p-8 rounded-[24px] border border-[color:var(--gold)]/50 shadow-md">
                  <h3 className="text-xl mb-6 font-medium text-[color:var(--foreground)]">
                    Edit Address
                  </h3>
                  <AddressForm
                    initialData={address}
                    onSave={async (data) => {
                      await updateAddress.mutateAsync({ id: address.id, updates: data });
                      setEditingId(null);
                    }}
                    onCancel={handleCancel}
                    isPending={updateAddress.isPending}
                  />
                </div>
              ) : (
                <div
                  className={`h-full p-8 rounded-[24px] border transition-all duration-300 shadow-sm flex flex-col justify-between ${
                    address.is_default
                      ? "border-[color:var(--gold)]/50 bg-[color:var(--gold)]/5"
                      : "border-[color:var(--border)] surface-glass hover:border-[color:var(--gold)]/30"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-lg text-[color:var(--foreground)]">
                        {address.name}
                      </span>
                      {address.is_default && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[color:var(--gold)] bg-[color:var(--gold)]/10 px-2.5 py-1 rounded-full border border-[color:var(--gold)]/20">
                          <Check size={12} /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[color:var(--muted-foreground)] mb-2 font-mono">
                      {address.phone}
                    </p>
                    <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                      {address.address}
                      <br />
                      {address.city}, {address.state} {address.zipcode}
                      <br />
                      {address.country}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-[color:var(--border)]">
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(address.id)}
                        className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors font-medium"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => deleteAddress.mutate(address.id)}
                        className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-red-500 transition-colors font-medium"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                    {!address.is_default && (
                      <button
                        onClick={() =>
                          updateAddress.mutate({ id: address.id, updates: { is_default: true } })
                        }
                        className="text-xs uppercase tracking-widest text-[color:var(--gold)] hover:text-[color:var(--foreground)] transition-colors font-medium"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile Floating Add Button */}
      {!isAdding && !editingId && (
        <button
          onClick={() => setIsAdding(true)}
          className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-[color:var(--foreground)] text-[color:var(--background)] rounded-full flex items-center justify-center shadow-2xl z-50 hover:bg-[color:var(--gold)] transition-colors"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
}

function AddressForm({
  initialData,
  onSave,
  onCancel,
  isPending,
}: {
  initialData?: AddressType;
  onSave: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    alt_phone: initialData?.alt_phone || "",
    house_number: initialData?.house_number || "",
    building_name: initialData?.building_name || "",
    street_area: initialData?.street_area || initialData?.address || "",
    landmark: initialData?.landmark || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    country: initialData?.country || "India",
    zipcode: initialData?.zipcode || "",
    address_type: initialData?.address_type || "Home",
    is_default: initialData?.is_default || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "street_area" ? { address: value } : {}) // keep legacy address synced
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, address: formData.street_area });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Full Name *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors" autoComplete="name" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Mobile Number *</label>
          <input required type="tel" pattern="[6-9][0-9]{9}" title="Valid 10-digit Indian mobile number" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors" autoComplete="tel" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">House / Flat / Door No. *</label>
          <input required type="text" name="house_number" value={formData.house_number} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Building / Apartment Name</label>
          <input type="text" name="building_name" value={formData.building_name} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors" />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Street / Area *</label>
        <input required type="text" name="street_area" value={formData.street_area} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Landmark</label>
          <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="e.g. Near Apollo Hospital" className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Alternate Phone</label>
          <input type="tel" pattern="[6-9][0-9]{9}" title="Valid 10-digit Indian mobile number" name="alt_phone" value={formData.alt_phone} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">City *</label>
          <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">State *</label>
          <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">PIN Code *</label>
          <input required type="text" pattern="[0-9]{6}" title="6-digit Indian PIN code" name="zipcode" value={formData.zipcode} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Type</label>
          <select name="address_type" value={formData.address_type} onChange={handleChange} className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] p-3.5 rounded-xl text-base md:text-sm focus:border-[color:var(--gold)] outline-none transition-colors appearance-none">
            <option value="Home">Home</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer p-4 bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-xl w-max">
          <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} className="accent-[color:var(--gold)] w-5 h-5 md:w-4 md:h-4" />
          <span className="text-base md:text-sm font-medium text-[color:var(--foreground)]">Set as default address</span>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <button type="submit" disabled={isPending} className="btn-lux w-full md:w-auto min-h-[48px]">
          {isPending ? "Saving..." : "Save Address"}
        </button>
        <button type="button" onClick={onCancel} className="text-base md:text-sm font-medium tracking-wide text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors px-4 py-3 min-h-[48px] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-center">
          Cancel
        </button>
      </div>
    </form>
  );
}

