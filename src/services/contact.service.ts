import { supabase } from "@/lib/supabase";

export interface ContactMessagePayload {
  full_name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
}

export const contactService = {
  async submitContactForm(payload: ContactMessagePayload) {
    const { data, error } = await supabase.from("contact_messages").insert([
      {
        full_name: payload.full_name,
        email: payload.email,
        phone_number: payload.phone_number || null,
        subject: payload.subject,
        message: payload.message,
      },
    ]);

    if (error) {
      console.error("Error submitting contact form:", error);
      throw new Error(error.message || "Failed to submit your message. Please try again later.");
    }

    return data;
  },
};
