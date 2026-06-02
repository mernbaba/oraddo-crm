import { Bell, CheckCheck, Trash2, Settings, Filter, Sparkles, Clock, AlertCircle, CheckCircle, Info, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState, useCallback } from "react";
import {
  notificationService,
  ApiNotification,
} from "../services/notificationService";

// Map a notification's `type` string to a Lucide icon + color used by the UI
const TYPE_PRESETS: Record<string, { icon: any; color: string }> = {
  success: { icon: CheckCircle, color: "#22c55e" },
  warning: { icon: AlertCircle, color: "#f59e0b" },
  error: { icon: AlertCircle, color: "#ef4444" },
  info: { icon: Info, color: "#422462" },
  default: { icon: Bell, color: "#5A4079" },
};

// Format a date string to a "x ago" relative-time string
const formatRelativeTime = (dateStr?: string): string => {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Just now";
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
};

// Map a raw API notification to the shape the UI consumes
const mapNotification = (n: ApiNotification) => {
  const preset = TYPE_PRESETS[n.type] || TYPE_PRESETS.default;
  return {
    id: n.id,
    type: n.type || "info",
    title: (n as any).title || n.type || "Notification",
    message: n.message || "",
    time: formatRelativeTime(n.createdAt),
    read: !!n.isRead,
    icon: preset.icon,
    color: preset.color,
  };
};

export function Notifications() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await notificationService.getAll();
      const list = Array.isArray(res.data) ? res.data : [];
      setNotifications(list);
    } catch (err: any) {
      console.error("Failed to load notifications", err);
      setError("Could not load notifications. Please try again.");
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkRead = async (id: number) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await notificationService.markRead(id);
    } catch (err) {
      console.error("Failed to mark notification read", err);
      // Revert
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setNotifications((prev) =>
      prev.map((n) => (unreadIds.includes(n.id) ? { ...n, isRead: true } : n))
    );
    // Fire-and-forget for each id (no bulk endpoint exists yet — see plan G3)
    await Promise.allSettled(
      unreadIds.map((id) => notificationService.markRead(id))
    );
  };

  const handleDelete = async (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationService.delete(id);
    } catch (err) {
      console.error("Failed to delete notification", err);
      // Revert: reload
      load();
    }
  };

  const mapped = notifications.map(mapNotification);
  const filteredNotifications =
    filter === "unread" ? mapped.filter((n) => !n.read) : mapped;

  const unreadCount = mapped.filter((n) => !n.read).length;
  const todayCount = mapped.filter((n) => {
    if (!n.time.includes("hour") && !n.time.includes("minute") && !n.time.includes("s ago")) {
      return false;
    }
    return true;
  }).length;

  const stats = [
    { label: "Total", value: mapped.length.toString(), gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Unread", value: unreadCount.toString(), gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Today", value: todayCount.toString(), gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "This Week", value: "—", gradient: "from-[#422462] to-[#937CB4]" },
  ];

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <Bell className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Notifications</h2>
            <p className="text-[#5A4079]">Stay updated with important alerts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || isLoading}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50"
            onClick={load}
            disabled={isLoading}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
 
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          className={
            filter === "all"
              ? "bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
              : "border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50"
          }
          onClick={() => setFilter("all")}
        >
          All Notifications
        </Button>
        <Button
          size="sm"
          variant={filter === "unread" ? "default" : "outline"}
          className={
            filter === "unread"
              ? "bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
              : "border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50"
          }
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
      </div>
 
      <div className="space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-[#5A4079]">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading notifications…
          </div>
        )}
        {error && !isLoading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {!isLoading && !error && filteredNotifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`
                relative overflow-hidden rounded-xl border border-[#937CB4]/20 backdrop-blur-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 group
                ${notification.read ? 'bg-white/70' : 'bg-white/95'}
              `}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#937CB4]/10 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10 flex items-start gap-4">
                {/* Icon */}
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${notification.color}20` }}
                >
                  <Icon className="h-6 w-6" style={{ color: notification.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`font-semibold ${notification.read ? 'text-[#5A4079]' : 'text-[#200B43]'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-[#422462] flex-shrink-0 ml-2 mt-2"></div>
                    )}
                  </div>
                  <p className="text-sm text-[#5A4079] mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-[#5A4079]">
                      <Clock className="h-3 w-3" />
                      <span>{notification.time}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs hover:bg-[#F0E9FF]"
                          onClick={() => handleMarkRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 hover:bg-red-50"
                        onClick={() => handleDelete(notification.id)}
                        aria-label="Delete notification"
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
 
      {filteredNotifications.length === 0 && !isLoading && !error && (
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-12 text-center shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#F0E9FF] to-[#F0E9FF]/50 flex items-center justify-center">
              <Bell className="h-10 w-10 text-[#937CB4]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#200B43] mb-2">No notifications</h3>
              <p className="text-sm text-[#5A4079]">
                {filter === "unread"
                  ? "You're all caught up! No unread notifications."
                  : "You have no notifications yet."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
