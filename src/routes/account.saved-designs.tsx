import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCustomizations } from "@/hooks/useCustomizations";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useShop } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingBag, Edit3, Trash2, Droplets } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/account/saved-designs")({
  component: SavedDesignsPage,
});

function SavedDesignsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { customizations, isLoading, deleteCustomization } = useCustomizations();
  const { addToCart } = useCart();
  
  const localDesigns = useShop((s) => s.savedDesigns);
  const localDelete = useShop((s) => s.deleteDesign);
  const localAddToCart = useShop((s) => s.addCustomToCart);

  if (user && isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 animate-pulse">
        <div className="surface-glass rounded-[24px] p-6 h-64 bg-white/5"></div>
        <div className="surface-glass rounded-[24px] p-6 h-64 bg-white/5"></div>
      </div>
    );
  }

  const designs = user ? customizations : localDesigns;

  if (!designs || designs.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="surface-glass rounded-[24px] p-16 text-center border border-[color:var(--border)] shadow-sm max-w-2xl mx-auto mt-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 text-[color:var(--border)] opacity-50 flex items-center justify-center rounded-full border border-[color:var(--border)] shadow-inner">
          <Sparkles size={32} strokeWidth={1} />
        </div>
        <h2 className="text-display text-2xl mb-3">Create your first custom soap.</h2>
        <p className="text-[color:var(--muted-foreground)] mb-8">
          Design your first personalized ritual in the Studio.
        </p>
        <Link to="/customize" className="btn-lux inline-flex justify-center gap-2">
          <Sparkles size={16} /> Open Studio
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-eyebrow text-[color:var(--muted-foreground)] mb-2">Studio</div>
          <h1 className="text-display text-3xl">Saved Designs</h1>
        </div>
        <Link to="/customize" className="btn-lux hidden sm:inline-flex items-center gap-2 shadow-sm">
          <Sparkles size={16} /> New Design
        </Link>
      </div>
        
      <div className="grid gap-6 md:grid-cols-2">
        <AnimatePresence>
          {designs.filter(Boolean).map((d: any, idx: number) => {
            const isLocal = !user;
            const id = isLocal ? d.id : d.id;
            const name = isLocal ? d.name : d.notes || "Custom Design";
            const shape = d.shape || "Oval";
            const color = d.color || "Ivory";
            const fragrance = d.fragrance || "Unscented";
            const ingredients = d.ingredients || [];
            
            return (
              <motion.div 
                key={id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.1 }}
                className="group surface-glass border border-[color:var(--border)] rounded-[24px] overflow-hidden flex flex-col justify-between shadow-sm hover:border-[color:var(--gold)]/30 hover:shadow-md transition-all duration-500"
              >
                <div className="flex h-32 bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 relative overflow-hidden items-center justify-center border-b border-[color:var(--border)]">
                  {/* Decorative element representing the soap */}
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className={`w-32 h-20 rounded-[40%] bg-[color:var(--gold)]/10 border border-[color:var(--gold)]/20 shadow-inner flex items-center justify-center backdrop-blur-sm transition-all duration-700`}
                  >
                    <Droplets size={24} className="text-[color:var(--gold)]/50" />
                  </motion.div>
                  <div className="absolute top-4 right-4 bg-black/20 dark:bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-white/90">
                    {shape}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-display text-2xl group-hover:text-[color:var(--gold)] transition-colors">{name}</div>
                    {!isLocal && (
                      <div className="text-sm font-medium">₹{d.estimated_price}</div>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">Base & Fragrance</div>
                      <div className="text-sm font-medium">{color} Base · {fragrance}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)] mb-1">Botanicals</div>
                      <div className="text-sm text-[color:var(--muted-foreground)] line-clamp-1">
                        {ingredients.length > 0 ? ingredients.join(", ") : "None selected"}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 pt-0 mt-auto">
                  <div className="flex justify-between items-center border-t border-[color:var(--border)] pt-4">
                    <button 
                      onClick={async () => {
                        try {
                          if (isLocal) {
                            localAddToCart(d);
                          } else {
                            await addToCart.mutateAsync({ productId: null, quantity: 1, customizationId: id });
                          }
                          toast.success("Added to bag");
                        } catch (error) {
                          toast.error("Failed to add to bag");
                        }
                      }} 
                      disabled={!isLocal && addToCart.isPending}
                      className="flex items-center gap-2 text-xs uppercase tracking-widest text-[color:var(--foreground)] hover:text-[color:var(--gold)] transition-colors font-medium"
                    >
                      <ShoppingBag size={14} /> {!isLocal && addToCart.isPending ? "Adding..." : "Order Design"}
                    </button>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          if(isLocal) localDelete(id);
                          else deleteCustomization.mutate(id);
                          toast.success("Design deleted");
                        }} 
                        className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] hover:text-red-500 transition-colors flex items-center gap-1.5 font-medium"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Mobile Floating Action */}
      <button 
        onClick={() => navigate({ to: '/customize' })}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-[color:var(--foreground)] text-[color:var(--background)] rounded-full flex items-center justify-center shadow-2xl z-50 hover:bg-[color:var(--gold)] transition-colors"
      >
        <Sparkles size={24} />
      </button>
    </div>
  );
}
