import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, UploadCloud, X } from "lucide-react";

export function ReviewComposer({ productName, onSubmit }: { productName: string, onSubmit: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsOpen(false);
      onSubmit();
    }, 1200);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-[color:var(--border)]">
      {!isOpen ? (
        <div className="text-center">
          <h3 className="text-display text-2xl mb-4">Share Your Experience</h3>
          <p className="text-sm text-[color:var(--muted-foreground)] mb-6 max-w-md mx-auto">
            Your review helps others discover the magic of {productName}. We'd love to hear your thoughts.
          </p>
          <button 
            onClick={() => setIsOpen(true)}
            className="btn-lux"
          >
            Write a Review
          </button>
        </div>
      ) : (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto surface-glass rounded-[24px] p-8 md:p-12 relative"
          onSubmit={handleSubmit}
        >
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <h3 className="text-display text-2xl mb-8">Write a Review</h3>
          
          <div className="space-y-8">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-4">
                Overall Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      className={`h-8 w-8 transition-colors duration-300 ${
                        star <= (hoverRating || rating) 
                          ? "fill-[color:var(--gold)] text-[color:var(--gold)]" 
                          : "fill-transparent text-[color:var(--border)]"
                      }`} 
                      strokeWidth={1}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">
                Review Title
              </label>
              <input 
                required
                type="text"
                placeholder="Sum up your experience"
                className="w-full bg-transparent border-b border-[color:var(--border)] pb-3 pt-2 text-lg focus:outline-none focus:border-[color:var(--gold)] transition-colors placeholder:text-[color:var(--muted-foreground)]/50"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">
                Your Review
              </label>
              <textarea 
                required
                rows={4}
                placeholder="Tell us what you liked (or didn't like) about this soap..."
                className="w-full bg-[color:var(--muted)]/30 border border-[color:var(--border)] rounded-xl p-4 text-base focus:outline-none focus:border-[color:var(--gold)] transition-colors placeholder:text-[color:var(--muted-foreground)]/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-4">
                Add Photos (Optional)
              </label>
              
              <div className="flex gap-4 items-start">
                {image && (
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-[color:var(--border)]">
                    <img src={image} alt="Upload preview" className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/80 backdrop-blur-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {!image && (
                  <label className="flex flex-col items-center justify-center h-24 w-24 rounded-lg border border-dashed border-[color:var(--border)] cursor-pointer hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)]/5 transition-colors">
                    <UploadCloud className="h-6 w-6 text-[color:var(--muted-foreground)] mb-2" />
                    <span className="text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)]">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">
                  Name
                </label>
                <input required type="text" className="w-full bg-transparent border-b border-[color:var(--border)] pb-3 pt-2 focus:outline-none focus:border-[color:var(--gold)] transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">
                  Email
                </label>
                <input required type="email" className="w-full bg-transparent border-b border-[color:var(--border)] pb-3 pt-2 focus:outline-none focus:border-[color:var(--gold)] transition-colors" />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button 
              type="submit" 
              disabled={submitting || rating === 0}
              className="btn-lux w-full md:w-auto"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}
