import { useState, useEffect } from "react";
import { Image as ImageIcon, ImageOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PaymentProofImageProps {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

export function PaymentProofImage({
  src,
  alt = "Payment Proof",
  className = "",
  onClick,
}: PaymentProofImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(src);
  const [status, setStatus] = useState<"loading" | "success" | "error" | "retrying">("loading");

  useEffect(() => {
    setCurrentSrc(src);
    setStatus("loading");
  }, [src]);

  const handleError = async () => {
    // If we've already retried and failed, show error placeholder
    if (status === "retrying" || !currentSrc) {
      setStatus("error");
      return;
    }

    try {
      setStatus("retrying");
      // Check if it's a supabase storage public URL that failed (e.g. because bucket is private)
      const isSupabaseUrl = currentSrc.includes("/storage/v1/object/public/payment-proofs/");
      
      if (isSupabaseUrl) {
        // Extract the path e.g. /user_id/filename.ext
        const urlObj = new URL(currentSrc);
        const pathParts = urlObj.pathname.split("/public/payment-proofs/");
        if (pathParts.length === 2) {
          const filePath = decodeURIComponent(pathParts[1]);
          const { data, error } = await supabase.storage
            .from("payment-proofs")
            .createSignedUrl(filePath, 3600);
            
          if (error || !data?.signedUrl) {
            setStatus("error");
            return;
          }
          
          setCurrentSrc(data.signedUrl);
          return; // Let the image attempt to load the signedUrl
        }
      }
      
      // If it wasn't a standard URL or couldn't extract path
      setStatus("error");
    } catch (err) {
      console.error("Failed to generate fallback signed URL:", err);
      setStatus("error");
    }
  };

  const handleLoad = () => {
    setStatus("success");
  };

  return (
    <div
      className={`relative bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden ${className}`}
      onClick={status === "success" ? onClick : undefined}
    >
      {/* Loading Skeleton */}
      {(status === "loading" || status === "retrying") && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
          <ImageIcon className="text-neutral-400 dark:text-neutral-500 opacity-50" size={32} />
        </div>
      )}

      {/* Error Placeholder */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800">
          <ImageOff size={32} className="mb-2 opacity-50" />
          <span className="text-xs font-medium text-center px-2">Payment proof unavailable</span>
        </div>
      )}

      {/* Actual Image */}
      {currentSrc && status !== "error" && (
        <img
          src={currentSrc}
          alt={alt}
          onError={handleError}
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            status === "success" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
