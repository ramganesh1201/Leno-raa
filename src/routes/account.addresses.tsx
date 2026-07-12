import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAddresses } from "@/hooks/useAddresses";
import type { AddressType } from "@/services/address.service";

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});

function AddressesPage() {
  const { addresses, isLoading, addAddress, updateAddress, deleteAddress } = useAddresses();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="surface-glass rounded-md p-10 animate-pulse">
        <div className="h-6 w-32 bg-[color:var(--foreground)]/10 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-24 w-full bg-[color:var(--foreground)]/5 rounded"></div>
          <div className="h-24 w-full bg-[color:var(--foreground)]/5 rounded"></div>
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
    <div className="space-y-12">
      <div className="surface-glass rounded-md p-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-eyebrow text-[color:var(--muted-foreground)]">Addresses</div>
            <div className="text-display mt-3 text-3xl">Shipping Destinations</div>
          </div>
          {!isAdding && !editingId && (
            <button onClick={() => setIsAdding(true)} className="btn-ghost-lux">
              Add address
            </button>
          )}
        </div>

        {isAdding && (
          <div className="mt-10 border-t border-[color:var(--border)] pt-10">
            <h3 className="text-xl mb-6">Add New Address</h3>
            <AddressForm 
              onSave={async (data) => {
                await addAddress.mutateAsync(data);
                setIsAdding(false);
              }}
              onCancel={handleCancel}
              isPending={addAddress.isPending}
            />
          </div>
        )}

        {!isAdding && addresses.length === 0 && !editingId && (
          <div className="mt-16 text-center">
            <p className="text-sm text-[color:var(--muted-foreground)]">
              Add a shipping address for a smoother checkout ritual.
            </p>
          </div>
        )}

        <div className="mt-10 space-y-6">
          {addresses.map((address) => (
            <div key={address.id}>
              {editingId === address.id ? (
                <div className="border border-[color:var(--border)] bg-black/5 p-6 rounded-md">
                  <h3 className="text-xl mb-6">Edit Address</h3>
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
                <div className={`p-6 border ${address.is_default ? 'border-[color:var(--gold)]' : 'border-[color:var(--border)]'} rounded-md flex justify-between`}>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-[color:var(--foreground)]">{address.name}</span>
                      {address.is_default && (
                        <span className="text-[10px] uppercase tracking-widest text-[color:var(--gold)] bg-[color:var(--gold)]/10 px-2 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-[color:var(--muted-foreground)] mt-2">{address.phone}</p>
                    <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                      {address.address}<br />
                      {address.city}, {address.state} {address.zipcode}<br />
                      {address.country}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button onClick={() => handleEdit(address.id)} className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-[color:var(--gold)] transition">Edit</button>
                    <button onClick={() => deleteAddress.mutate(address.id)} className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-red-500 transition">Remove</button>
                    {!address.is_default && (
                      <button onClick={() => updateAddress.mutate({ id: address.id, updates: { is_default: true } })} className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition mt-auto">Set Default</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddressForm({ 
  initialData, 
  onSave, 
  onCancel,
  isPending 
}: { 
  initialData?: AddressType; 
  onSave: (data: any) => void; 
  onCancel: () => void;
  isPending: boolean;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    country: initialData?.country || "",
    zipcode: initialData?.zipcode || "",
    is_default: initialData?.is_default || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Phone</label>
          <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition" />
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Address</label>
        <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">City</label>
          <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">State/Province</label>
          <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Zip/Postal Code</label>
          <input required type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">Country</label>
          <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full bg-transparent border border-[color:var(--border)] p-3 text-sm focus:border-[color:var(--gold)] outline-none transition" />
        </div>
      </div>
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} className="accent-[color:var(--gold)]" />
          <span className="text-sm text-[color:var(--muted-foreground)]">Set as default address</span>
        </label>
      </div>
      <div className="flex gap-4 pt-6">
        <button type="submit" disabled={isPending} className="btn-lux flex-1 justify-center">{isPending ? "Saving..." : "Save Address"}</button>
        <button type="button" onClick={onCancel} className="btn-ghost-lux flex-1 justify-center">Cancel</button>
      </div>
    </form>
  );
}
