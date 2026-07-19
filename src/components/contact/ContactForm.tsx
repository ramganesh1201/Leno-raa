import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { contactService } from "@/services/contact.service";
import { toast } from "sonner";

const contactSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone_number: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await contactService.submitContactForm(data);
      toast.success("Message Sent", {
        description: "Thank you for reaching out. We will get back to you shortly.",
      });
      reset();
    } catch (error: any) {
      toast.error("Submission Failed", {
        description: error.message || "There was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
              Full Name *
            </label>
            <input
              id="full_name"
              type="text"
              {...register("full_name")}
              className={`w-full border-b bg-transparent py-3 text-sm outline-none transition-colors ${
                errors.full_name
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-[color:var(--border)] focus:border-[color:var(--gold)]"
              }`}
            />
            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full border-b bg-transparent py-3 text-sm outline-none transition-colors ${
                errors.email
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-[color:var(--border)] focus:border-[color:var(--gold)]"
              }`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="phone_number" className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
              Phone Number (Optional)
            </label>
            <input
              id="phone_number"
              type="tel"
              {...register("phone_number")}
              className="w-full border-b border-[color:var(--border)] bg-transparent py-3 text-sm outline-none transition-colors focus:border-[color:var(--gold)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
              Subject *
            </label>
            <input
              id="subject"
              type="text"
              {...register("subject")}
              className={`w-full border-b bg-transparent py-3 text-sm outline-none transition-colors ${
                errors.subject
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-[color:var(--border)] focus:border-[color:var(--gold)]"
              }`}
            />
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
            Message *
          </label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            className={`w-full resize-none border-b bg-transparent py-3 text-sm outline-none transition-colors ${
              errors.message
                ? "border-red-500/50 focus:border-red-500"
                : "border-[color:var(--border)] focus:border-[color:var(--gold)]"
            }`}
          />
          {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-lux w-full md:w-auto relative overflow-hidden"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--background)]/20 border-t-[color:var(--background)]"></span>
              Sending...
            </span>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
