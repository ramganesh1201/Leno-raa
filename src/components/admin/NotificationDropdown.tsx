import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAsRead.mutateAsync(undefined); // undefined means mark all
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // Handle individual click
  const handleNotificationClick = async (id: string, actionUrl: string | null) => {
    try {
      await markAsRead.mutateAsync(id);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
    if (actionUrl) {
      // If we have an action URL, we could navigate. Since this is admin, we might need a router instance.
      // But we will just close the dropdown for now as navigating via raw anchor or href depends on setup.
      // We can use window.location.href or a Link component if needed.
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900">
              <h3 className="font-bold text-neutral-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markAsRead.isPending}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <Check size={14} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
              {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-3">
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    You're all caught up.
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">No new notifications.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() =>
                        handleNotificationClick(notification.id, notification.action_url || null)
                      }
                      className={`p-4 border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 cursor-pointer transition-colors ${
                        !notification.is_read
                          ? "bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                            !notification.is_read ? "bg-blue-500" : "bg-transparent"
                          }`}
                        />
                        <div>
                          <h4
                            className={`text-sm ${!notification.is_read ? "font-bold text-neutral-900 dark:text-white" : "font-medium text-neutral-700 dark:text-neutral-300"}`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <span className="text-[10px] text-neutral-400 mt-2 block font-medium">
                            {new Date(notification.created_at).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
