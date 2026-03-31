import { Bell, CheckCheck, Trash2, Settings, Filter, Sparkles, Clock, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function Notifications() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Proposal Approved",
      message: "Your proposal for Tech Corp project has been approved by the client.",
      time: "5 minutes ago",
      read: false,
      icon: CheckCircle,
      color: "#22c55e",
    },
    {
      id: 2,
      type: "info",
      title: "New Task Assigned",
      message: "Sarah Johnson assigned you a new task: 'Update marketing dashboard'",
      time: "15 minutes ago",
      read: false,
      icon: Info,
      color: "#422462",
    },
    {
      id: 3,
      type: "warning",
      title: "Payment Due",
      message: "Invoice #INV-2024-045 payment is due in 3 days",
      time: "1 hour ago",
      read: false,
      icon: AlertCircle,
      color: "#f59e0b",
    },
    {
      id: 4,
      type: "info",
      title: "Meeting Reminder",
      message: "Team standup meeting starts in 30 minutes",
      time: "2 hours ago",
      read: true,
      icon: Clock,
      color: "#5A4079",
    },
    {
      id: 5,
      type: "success",
      title: "Project Completed",
      message: "E-Commerce Platform Redesign project has been marked as completed",
      time: "3 hours ago",
      read: true,
      icon: CheckCircle,
      color: "#22c55e",
    },
    {
      id: 6,
      type: "info",
      title: "New Comment",
      message: "Mike Chen commented on your task: 'Looks good, ready to deploy'",
      time: "5 hours ago",
      read: true,
      icon: Info,
      color: "#422462",
    },
    {
      id: 7,
      type: "warning",
      title: "Budget Alert",
      message: "Marketing department has reached 80% of monthly budget",
      time: "1 day ago",
      read: true,
      icon: AlertCircle,
      color: "#f59e0b",
    },
    {
      id: 8,
      type: "success",
      title: "Leave Approved",
      message: "Your leave request for Jan 20-22 has been approved",
      time: "2 days ago",
      read: true,
      icon: CheckCircle,
      color: "#22c55e",
    },
  ];

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const stats = [
    { label: "Total", value: notifications.length.toString(), gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Unread", value: unreadCount.toString(), gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Today", value: "5", gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "This Week", value: "12", gradient: "from-[#422462] to-[#937CB4]" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Filters */}
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

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => {
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

                {/* Content */}
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
                        >
                          Mark as read
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-red-50">
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

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-12 text-center shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#F0E9FF] to-[#F0E9FF]/50 flex items-center justify-center">
              <Bell className="h-10 w-10 text-[#937CB4]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#200B43] mb-2">No notifications</h3>
              <p className="text-sm text-[#5A4079]">You're all caught up! No unread notifications.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
