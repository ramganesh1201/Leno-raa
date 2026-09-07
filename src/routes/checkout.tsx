import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { useAddresses } from "@/hooks/useAddresses";
import { useTheme } from "@/lib/store";
import { SplitText } from "@/components/immersive/SplitText";
import { Reveal } from "@/components/immersive/Reveal";
import { ArrowLeft, Check, Plus, Edit2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { calculateDeliveryFee } from "@/lib/shipping";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — Lenoraa" }],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user } = useAuth();
  const { cart, isLoading: isCartLoading } = useCart();
  const { createOrder } = useOrders();
  const { addresses, isLoading: isAddressesLoading, addAddress } = useAddresses();
  const setTheme = useTheme((s) => s.setTheme);
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [makeDefault, setMakeDefault] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    alt_phone: "",
    house_number: "",
    building_name: "",
    street_area: "",
    landmark: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    address_type: "Home",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTheme("default");
    if (!user && !isCartLoading) {
      navigate({ to: "/auth/login" });
    }
  }, [setTheme, user, isCartLoading, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: prev.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "",
        phone: prev.phone || user.user_metadata?.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isAddressesLoading && addresses.length > 0) {
      if (!selectedAddressId || !addresses.some((a) => a.id === selectedAddressId)) {
        const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        }
      }
    }
  }, [isAddressesLoading, addresses, selectedAddressId]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  const subtotal = cart.reduce((a, i) => {
    const price = i.product?.price || i.customization?.calculated_price || 0;
    return a + price * i.quantity;
  }, 0);

  const cartQuantity = cart.reduce((a, i) => a + i.quantity, 0);
  const shippingCost = calculateDeliveryFee(subtotal);
  const total = subtotal + shippingCost;

  const validateFormData = () => {
    return !!(
      formData.full_name.trim() &&
      formData.phone.trim() &&
      formData.house_number.trim() &&
      formData.street_area.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.pincode.trim()
    );
  };

  const handleSaveNewAddressOnly = async () => {
    if (!validateFormData()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setErrorMsg(null);

    try {
      const saved = await addAddress.mutateAsync({
        name: formData.full_name,
        phone: formData.phone,
        address: formData.street_area || formData.address,
        house_number: formData.house_number,
        building_name: formData.building_name,
        street_area: formData.street_area,
        landmark: formData.landmark,
        alt_phone: formData.alt_phone,
        address_type: formData.address_type,
        city: formData.city,
        state: formData.state,
        country: "India",
        zipcode: formData.pincode,
        is_default: makeDefault || addresses.length === 0,
      });

      if (saved && saved.id) {
        setSelectedAddressId(saved.id);
        setIsAddingNewAddress(false);
        setIsChangingAddress(false);
      }
    } catch (err) {
      console.error("Failed to save address:", err);
      setErrorMsg("Unable to save address. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      let finalShippingDetails;

      if (selectedAddress && !isAddingNewAddress && !isChangingAddress) {
        finalShippingDetails = {
          full_name: selectedAddress.name,
          phone: selectedAddress.phone,
          alt_phone: selectedAddress.alt_phone || "",
          house_number: selectedAddress.house_number || "",
          building_name: selectedAddress.building_name || "",
          street_area: selectedAddress.street_area || "",
          landmark: selectedAddress.landmark || "",
          address: selectedAddress.address || selectedAddress.street_area || "",
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.zipcode,
          address_type: selectedAddress.address_type || "Home",
        };
      } else {
        if (!validateFormData()) {
          setErrorMsg("Please fill in all required fields.");
          setIsSubmitting(false);
          return;
        }

        finalShippingDetails = {
          ...formData,
          address: formData.address || formData.street_area,
        };

        if (saveForFuture && user) {
          try {
            const saved = await addAddress.mutateAsync({
              name: formData.full_name,
              phone: formData.phone,
              address: formData.street_area || formData.address,
              house_number: formData.house_number,
              building_name: formData.building_name,
              street_area: formData.street_area,
              landmark: formData.landmark,
              alt_phone: formData.alt_phone,
              address_type: formData.address_type,
              city: formData.city,
              state: formData.state,
              country: "India",
              zipcode: formData.pincode,
              is_default: makeDefault || addresses.length === 0,
            });
            if (saved && saved.id) {
              setSelectedAddressId(saved.id);
              setIsAddingNewAddress(false);
            }
          } catch (saveErr) {
            console.error("Failed to save address:", saveErr);
            setErrorMsg("Unable to save address. Please try again.");
            setIsSubmitting(false);
            return;
          }
        }
      }

      const order = await createOrder.mutateAsync({
        shippingDetails: finalShippingDetails,
        subtotal,
        shipping_cost: shippingCost,
      });

      navigate({ to: `/payment/${order.id}` });
    } catch (error) {
      console.error("Order creation failed:", error);
      setErrorMsg("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCartLoading || isAddressesLoading) {
    return (
      <div className="relative pt-32 text-center h-screen flex items-center justify-center">
        <div className="text-[color:var(--muted-foreground)] tracking-widest text-sm uppercase animate-pulse">
          Loading checkout...
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="relative pt-32 pb-40 min-h-screen text-center">
        <h2 className="text-display text-2xl mb-4">Your bag is empty.</h2>
        <Link to="/cart" className="btn-lux inline-flex">
          Return to Bag
        </Link>
      </div>
    );
  }

  const showSavedAddressCard = selectedAddress && !isChangingAddress && !isAddingNewAddress;
  const showChangeAddressList = isChangingAddress && addresses.length > 0;
  const showAddressForm = !showSavedAddressCard && !showChangeAddressList;

  return (
    <div className="relative pt-32 pb-40 min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-12">
        <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">
          Secure Checkout
        </Reveal>
        <SplitText
          as="h1"
          text="Shipping Details"
          delay={0.1}
          className="text-display mt-3 text-3xl md:text-4xl"
        />

        <div className="mt-8 md:mt-16 flex flex-col lg:flex-row gap-8 md:gap-16 relative">
          <div className="flex-1 w-full">
            {showSavedAddressCard && (
              <div className="space-y-6 surface-glass p-5 md:p-8 rounded-[20px] border border-[color:var(--border)] shadow-xl">
                <div className="flex justify-between items-center pb-4 border-b border-[color:var(--border)]">
                  <div>
                    <h3 className="text-display text-xl md:text-2xl">Delivery Address</h3>
                  </div>
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setIsChangingAddress(true)}
                      className="text-xs uppercase tracking-widest text-[color:var(--gold)] hover:underline flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 size={14} /> Change Address
                    </button>
                  )}
                </div>

                <div className="relative p-5 md:p-6 rounded-xl border-2 border-[color:var(--gold)] bg-black/10 dark:bg-white/5 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[color:var(--gold)]/20 text-[color:var(--gold)] border border-[color:var(--gold)]/30">
                        <Check size={12} /> Selected
                      </span>
                      {selectedAddress.is_default && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-white/10 text-[color:var(--muted-foreground)]">
                          Default
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-white/10 text-[color:var(--muted-foreground)]">
                        {selectedAddress.address_type || "Home"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsChangingAddress(true)}
                      className="text-xs uppercase tracking-widest text-[color:var(--gold)] hover:text-[color:var(--foreground)] transition-colors font-medium"
                    >
                      Change
                    </button>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="font-semibold text-base text-[color:var(--foreground)]">
                      {selectedAddress.name}
                    </div>
                    <div className="text-[color:var(--foreground)]/80">
                      {[selectedAddress.house_number, selectedAddress.building_name]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <div className="text-[color:var(--foreground)]/80">
                      {selectedAddress.street_area || selectedAddress.address}
                    </div>
                    {selectedAddress.landmark && (
                      <div className="text-[color:var(--muted-foreground)] text-xs">
                        Landmark: {selectedAddress.landmark}
                      </div>
                    )}
                    <div className="text-[color:var(--foreground)]/80">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipcode}
                    </div>
                    <div className="text-[color:var(--foreground)] pt-2 font-mono text-xs">
                      Phone: {selectedAddress.phone}
                      {selectedAddress.alt_phone ? ` | Alt: ${selectedAddress.alt_phone}` : ""}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-2 border-t border-[color:var(--border)]/50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewAddress(true);
                      setIsChangingAddress(false);
                    }}
                    className="text-xs uppercase tracking-widest text-[color:var(--foreground)] hover:text-[color:var(--gold)] transition-colors flex items-center gap-2 py-2"
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-lux w-full justify-center text-lg py-5 md:py-4 shadow-lg rounded-xl"
                  >
                    {isSubmitting ? "Processing..." : "Continue to Payment"}
                  </button>
                </div>
              </div>
            )}

            {showChangeAddressList && (
              <div className="space-y-6 surface-glass p-5 md:p-8 rounded-[20px] border border-[color:var(--border)] shadow-xl">
                <div className="flex justify-between items-center pb-4 border-b border-[color:var(--border)]">
                  <h3 className="text-display text-xl md:text-2xl">Select Delivery Address</h3>
                  <button
                    type="button"
                    onClick={() => setIsChangingAddress(false)}
                    className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr) => {
                    const isSelected = addr.id === selectedAddressId;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setIsChangingAddress(false);
                        }}
                        className={`p-5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[color:var(--gold)] bg-black/10 dark:bg-white/5 shadow-md"
                            : "border-[color:var(--border)] hover:border-[color:var(--muted-foreground)]/50 bg-black/5 dark:bg-white/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-[color:var(--gold)] bg-[color:var(--gold)]/20"
                                  : "border-[color:var(--border)]"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--gold)]" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-base text-[color:var(--foreground)]">
                                {addr.name}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[color:var(--muted-foreground)]">
                                {addr.address_type || "Home"}
                              </span>
                              {addr.is_default && (
                                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[color:var(--gold)]/20 text-[color:var(--gold)] font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pl-8 space-y-1 text-sm text-[color:var(--foreground)]/80">
                          <div>
                            {[addr.house_number, addr.building_name].filter(Boolean).join(", ")}
                          </div>
                          <div>{addr.street_area || addr.address}</div>
                          {addr.landmark && (
                            <div className="text-[color:var(--muted-foreground)] text-xs">
                              Landmark: {addr.landmark}
                            </div>
                          )}
                          <div>
                            {addr.city}, {addr.state} - {addr.zipcode}
                          </div>
                          <div className="pt-1 font-mono text-xs text-[color:var(--muted-foreground)]">
                            Phone: {addr.phone}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[color:var(--border)] flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewAddress(true);
                      setIsChangingAddress(false);
                    }}
                    className="btn-lux inline-flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Add New Address
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsChangingAddress(false)}
                    className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                  >
                    Back to Selected Address
                  </button>
                </div>
              </div>
            )}

            {showAddressForm && (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 surface-glass p-5 md:p-8 rounded-[20px] border border-[color:var(--border)] shadow-xl"
              >
                <div className="flex justify-between items-center pb-2">
                  <h3 className="text-display text-xl md:text-2xl">
                    {addresses.length === 0 ? "Delivery Address" : "Add New Delivery Address"}
                  </h3>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewAddress(false);
                        setIsChangingAddress(false);
                      }}
                      className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm uppercase tracking-widest text-[color:var(--muted-foreground)] font-semibold">
                    Contact Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="full_name"
                        className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="full_name"
                        name="full_name"
                        required
                        type="text"
                        className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-lg p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                        value={formData.full_name}
                        onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        required
                        type="tel"
                        className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-lg p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <h4 className="text-sm uppercase tracking-widest text-[color:var(--muted-foreground)] font-semibold pt-4 border-t border-[color:var(--border)]">
                    Delivery Address
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="house_number"
                        className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                      >
                        House / Flat / Door No. *
                      </label>
                      <input
                        id="house_number"
                        name="house_number"
                        required
                        type="text"
                        className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-xl p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                        value={formData.house_number}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, house_number: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="building_name"
                        className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                      >
                        Building / Apartment Name
                      </label>
                      <input
                        id="building_name"
                        name="building_name"
                        type="text"
                        className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-xl p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                        value={formData.building_name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, building_name: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="street_area"
                      className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                    >
                      Street / Area *
                    </label>
                    <input
                      id="street_area"
                      name="street_area"
                      required
                      type="text"
                      className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-xl p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                      value={formData.street_area}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          street_area: e.target.value,
                          address: e.target.value,
                        }))
                      }
                      autoComplete="street-address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="landmark"
                        className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                      >
                        Landmark
                      </label>
                      <input
                        id="landmark"
                        name="landmark"
                        type="text"
                        placeholder="e.g. Near Apollo Hospital"
                        className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-xl p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                        value={formData.landmark}
                        onChange={(e) => setFormData((p) => ({ ...p, landmark: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="alt_phone"
                        className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                      >
                        Alternate Phone
                      </label>
                      <input
                        id="alt_phone"
                        name="alt_phone"
                        type="tel"
                        pattern="[6-9][0-9]{9}"
                        title="Valid 10-digit Indian mobile number"
                        className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-xl p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                        value={formData.alt_phone}
                        onChange={(e) => setFormData((p) => ({ ...p, alt_phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                      >
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        required
                        type="text"
                        className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-xl p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                        value={formData.city}
                        onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                        autoComplete="address-level2"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                      >
                        State *
                      </label>
                      <input
                        id="state"
                        name="state"
                        required
                        type="text"
                        className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-xl p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                        value={formData.state}
                        onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                        autoComplete="address-level1"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pincode"
                        className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                      >
                        PIN Code *
                      </label>
                      <input
                        id="pincode"
                        name="pincode"
                        required
                        type="text"
                        pattern="[0-9]{6}"
                        title="6-digit Indian PIN code"
                        className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-xl p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                        value={formData.pincode}
                        onChange={(e) => setFormData((p) => ({ ...p, pincode: e.target.value }))}
                        autoComplete="postal-code"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="address_type"
                        className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2"
                      >
                        Address Type
                      </label>
                      <select
                        id="address_type"
                        name="address_type"
                        className="w-full bg-black/5 dark:bg-white/5 border border-[color:var(--border)] rounded-xl p-4 md:p-3 text-[color:var(--foreground)] focus:border-[color:var(--gold)] focus:outline-none transition-colors"
                        value={formData.address_type}
                        onChange={(e) => setFormData((p) => ({ ...p, address_type: e.target.value }))}
                      >
                        <option value="Home" className="bg-neutral-900 text-white">
                          Home
                        </option>
                        <option value="Work" className="bg-neutral-900 text-white">
                          Work / Office
                        </option>
                        <option value="Other" className="bg-neutral-900 text-white">
                          Other
                        </option>
                      </select>
                    </div>
                  </div>

                  {user && (
                    <div className="pt-4 border-t border-[color:var(--border)] space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer text-sm text-[color:var(--foreground)]">
                        <input
                          type="checkbox"
                          checked={saveForFuture}
                          onChange={(e) => setSaveForFuture(e.target.checked)}
                          className="w-4 h-4 rounded border-[color:var(--border)] text-[color:var(--gold)] focus:ring-[color:var(--gold)] accent-[color:var(--gold)]"
                        />
                        <span>Save this address for future orders</span>
                      </label>

                      {saveForFuture && (
                        <label className="flex items-center gap-3 cursor-pointer text-sm text-[color:var(--foreground)]">
                          <input
                            type="checkbox"
                            checked={makeDefault}
                            onChange={(e) => setMakeDefault(e.target.checked)}
                            className="w-4 h-4 rounded border-[color:var(--border)] text-[color:var(--gold)] focus:ring-[color:var(--gold)] accent-[color:var(--gold)]"
                          />
                          <span>Set as default address</span>
                        </label>
                      )}
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <div className="pt-4 md:pt-6 flex flex-col sm:flex-row gap-4">
                  {isAddingNewAddress && (
                    <button
                      type="button"
                      disabled={addAddress.isPending || isSubmitting}
                      onClick={handleSaveNewAddressOnly}
                      className="btn-lux justify-center py-4 px-6 text-sm bg-transparent border border-[color:var(--border)] hover:border-[color:var(--gold)]"
                    >
                      {addAddress.isPending ? "Saving..." : "Save Address"}
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || addAddress.isPending}
                    className="btn-lux flex-1 justify-center text-lg py-5 md:py-4 shadow-lg rounded-xl"
                  >
                    {isSubmitting || addAddress.isPending
                      ? "Processing..."
                      : "Continue to Payment"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8">
              <Link
                to="/cart"
                className="flex items-center gap-2 text-sm uppercase tracking-widest text-[color:var(--foreground)] hover:text-[color:var(--gold)] transition-colors"
              >
                <ArrowLeft size={16} /> Return to Cart
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[380px] shrink-0">
            <details
              className="sticky top-32 group surface-glass p-5 md:p-8 rounded-2xl md:rounded-[20px] border border-[color:var(--border)] shadow-xl"
              open
            >
              <summary className="text-display mb-4 md:mb-8 text-2xl flex justify-between items-center cursor-pointer list-none">
                Order Summary
                <span className="md:hidden transition group-open:rotate-180">+</span>
              </summary>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => {
                  const product = item.product;
                  const price = product?.price || item.customization?.calculated_price || 0;
                  const name = product?.name || "Custom Design";
                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm border-b border-[color:var(--border)] pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <div className="text-[color:var(--foreground)] font-medium">{name}</div>
                        <div className="text-xs text-[color:var(--muted-foreground)]">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-[color:var(--foreground)]">
                        ₹{new Intl.NumberFormat("en-IN").format(price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 border-t border-[color:var(--border)] pt-6 text-sm tracking-widest text-[color:var(--muted-foreground)]">
                <div className="flex justify-between">
                  <span>Subtotal ({cartQuantity} items)</span>
                  <span className="text-[color:var(--foreground)]">
                    ₹{new Intl.NumberFormat("en-IN").format(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[color:var(--foreground)]">
                    {shippingCost === 0 ? "FREE" : `₹${new Intl.NumberFormat("en-IN").format(shippingCost)}`}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-end border-t border-[color:var(--border)] pt-6">
                <span className="text-sm tracking-widest uppercase text-[color:var(--muted-foreground)]">
                  Total
                </span>
                <span className="text-xl md:text-2xl tracking-widest text-[color:var(--foreground)] font-medium">
                  ₹{new Intl.NumberFormat("en-IN").format(total)}
                </span>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
