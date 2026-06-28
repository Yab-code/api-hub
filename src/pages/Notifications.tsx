import React, { useState } from 'react';

interface NotificationItem {
  id: string;
  category: 'security' | 'system' | 'info' | 'warning';
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
  actionLabel?: string;
  actionRoute?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      category: 'security',
      title: 'New Login Detected',
      message: 'A new login was detected from a Chromium browser on Linux (IP: 192.168.1.1). If this wasn\'t you, please reset your password immediately.',
      timeAgo: '2 mins ago',
      unread: true,
      actionLabel: 'Secure Account',
    },
    {
      id: '2',
      category: 'system',
      title: 'API Deployment Successful',
      message: 'Your "Payment Gateway V2" API has been successfully deployed to the Production environment. All health checks passed.',
      timeAgo: '1 hour ago',
      unread: false,
    },
    {
      id: '3',
      category: 'info',
      title: 'Weekly Usage Report',
      message: 'Your usage increased by 14% this week. View the full breakdown of endpoint latency and throughput.',
      timeAgo: '3 hours ago',
      unread: true,
      actionLabel: 'View Statistics',
    },
    {
      id: '4',
      category: 'warning',
      title: 'Rate Limit Warning',
      message: 'The "Search API" endpoint reached 85% of its monthly rate limit. Consider upgrading your plan to avoid service interruption.',
      timeAgo: 'Yesterday',
      unread: false,
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'system' | 'security'>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => {
      if (notif.id === id) {
        return { ...notif, unread: false };
      }
      return notif;
    }));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, unread: false })));
  };

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Avoid triggering card click (mark as read)
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifs = notifications.filter(notif => {
    if (activeFilter === 'unread') return notif.unread;
    if (activeFilter === 'system') return notif.category === 'system' || notif.category === 'info';
    if (activeFilter === 'security') return notif.category === 'security' || notif.category === 'warning';
    return true; // 'all'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mb-xl">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Notifications</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Stay updated with your API performance and account activity.</p>
        </div>
        
        {notifications.some(n => n.unread) && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-sm px-md py-sm border border-outline text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all active:scale-95 font-body-sm text-body-sm focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-sm border-b border-outline-variant/30 mb-lg overflow-x-auto pb-px">
        {(['all', 'unread', 'system', 'security'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-md py-md border-b-2 font-bold transition-all capitalize whitespace-nowrap focus:outline-none ${
              activeFilter === filter
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-sm">
        {filteredNotifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-3xl text-center" id="empty-state">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-primary mb-md">
              <span className="material-symbols-outlined text-[32px]">notifications_off</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">All caught up!</h2>
            <p className="text-on-surface-variant max-w-sm">No new notifications. We'll let you know when something important happens.</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkAsRead(notif.id)}
              className={`notification-card border rounded-xl p-lg flex gap-lg cursor-pointer transition-all ${
                notif.unread
                  ? 'bg-primary-container/5 border-primary/20 shadow-sm'
                  : 'bg-surface border-outline-variant/30 hover:bg-surface-variant/10'
              }`}
            >
              {/* Category Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                notif.category === 'security' || notif.category === 'warning' ? 'bg-error-container/20 text-error' :
                notif.category === 'system' ? 'bg-tertiary-container/10 text-tertiary' :
                'bg-secondary-container/30 text-primary'
              }`}>
                <span className="material-symbols-outlined">
                  {notif.category === 'security' ? 'security' :
                   notif.category === 'warning' ? 'warning' :
                   notif.category === 'system' ? 'check_circle' : 'info'}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-xs">
                  <h3 className="font-bold text-on-surface truncate">{notif.title}</h3>
                  <span className="font-label-caps text-label-caps text-on-surface-variant text-[11px] whitespace-nowrap pl-md">{notif.timeAgo}</span>
                </div>
                <p className="text-on-surface-variant font-body-sm text-body-sm mb-md">
                  {notif.message}
                </p>
                {notif.actionLabel && (
                  <div className="flex gap-sm">
                    <button className="bg-primary px-md py-xs rounded-lg text-white font-body-sm text-body-sm active:scale-95 transition-transform">
                      {notif.actionLabel}
                    </button>
                    <button
                      onClick={(e) => handleDismiss(e, notif.id)}
                      className="px-md py-xs rounded-lg border border-outline-variant text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
              
              {/* Unread circle indicator */}
              {notif.unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0 animate-pulse"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredNotifs.length > 0 && (
        <div className="mt-xl flex justify-center">
          <button className="px-xl py-sm text-primary font-bold hover:bg-primary-container/10 rounded-lg transition-all active:scale-95 focus:outline-none">
            Load previous notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
