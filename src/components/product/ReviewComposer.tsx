import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Star, UploadCloud, X, Image as ImageIcon } from "lucide-react";

export interface ReviewSubmitData {
  rating: number;
  title: string;
  review_text: string;
  is_anonymous: boolean;
  images: File[];
}

export function ReviewComposer({
  productName,
  onSubmit,
}: {
  productName: string;
  onSubmit: (data: ReviewSubmitData) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        rating,
        title,
        review_text: content,
        is_anonymous: isAnonymous,
        images,
      });
      setIsOpen(false);
      setRating(0);
      setTitle("");
      setContent("");
      setIsAnonymous(false);
      setImages([]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 3)); // Max 3 images
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-16 pt-16 border-t border-[color:var(--border)]">
      {!isOpen ? (
        <div className="text-center">
          <h3 className="text-display text-2xl mb-4">Share Your Experience</h3>
          <p className="text-sm text-[color:var(--muted-foreground)] mb-6 max-w-md mx-auto">
            Your review helps others discover the magic of {productName}. We'd love to hear your
            thoughts.
          </p>
          <button onClick={() => setIsOpen(true)} className="btn-lux">
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sum up your experience"
                className="w-full bg-[color:var(--muted)]/30 border border-[color:var(--border)] rounded-xl p-4 text-base focus:outline-none focus:border-[color:var(--gold)] transition-colors placeholder:text-[color:var(--muted-foreground)]/50"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">
                Your Review
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell us what you liked (or didn't like) about this soap..."
                className="w-full bg-[color:var(--muted)]/30 border border-[color:var(--border)] rounded-xl p-4 text-base focus:outline-none focus:border-[color:var(--gold)] transition-colors placeholder:text-[color:var(--muted-foreground)]/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[color:var(--muted-foreground)] mb-2">
                Add Photos (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <div className="flex gap-4 flex-wrap">
                {images.map((file, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[color:var(--border)]">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-[color:var(--border)] rounded-lg text-[color:var(--muted-foreground)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] transition-colors"
                  >
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-[10px] uppercase tracking-wider">Upload</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-[color:var(--border)] bg-transparent text-[color:var(--gold)] focus:ring-[color:var(--gold)] focus:ring-offset-0"
              />
              <label htmlFor="anonymous" className="text-sm text-[color:var(--foreground)] cursor-pointer">
                Post anonymously
              </label>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="btn-lux w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}
