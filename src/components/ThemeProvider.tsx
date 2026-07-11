import { useEffect } from "react";
import { useTheme } from "@/lib/store";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

function currentTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

/**
 * Applies the current world theme + ambience + time-of-day to <html>.
 * Any page can call useTheme().setTheme("radiance", "petals") to transform
 * the entire universe. Time-of-day layers a subtle atmospheric tint on top
 * so the site feels alive throughout the day.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "default") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => root.setAttribute("data-tod", currentTimeOfDay());
    apply();
    const id = window.setInterval(apply, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return <>{children}</>;
}
