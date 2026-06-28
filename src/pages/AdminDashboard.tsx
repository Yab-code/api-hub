import React, { useState, useEffect, useRef } from 'react';

interface TerminalMessage {
  type: 'success' | 'info' | 'warning' | 'error' | 'default';
  text: string;
}

const AdminDashboard: React.FC = () => {
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const [logs, setLogs] = useState<TerminalMessage[]>([
    { type: 'default', text: '// Initializing APIHub Core v4.12.0' },
    { type: 'success', text: '[OK] Authentication service cluster connected.' },
    { type: 'success', text: '[OK] Redis cache layer warmed (4.2GB indexed).' },
    { type: 'info', text: '[INFO] Fetching metrics for \'Auth-Gateway-Primary\'...' },
    { type: 'default', text: '  CPU: 12.4% | MEM: 1.2GB/4.0GB | REQ/s: 4.5k' },
    { type: 'error', text: '[ERR] Endpoint \'/v1/legacy/sync\' returned 502 (Bad Gateway)' },
    { type: 'default', text: '// Retrying connection to upstream legacy-service...' },
    { type: 'success', text: '[OK] Connection re-established.' }
  ]);

  const logTemplates: TerminalMessage[] = [
    { type: 'info', text: '[INFO] Processing batch request #9921...' },
    { type: 'success', text: '[OK] Token validation cluster balanced.' },
    { type: 'warning', text: '[WARN] High latency detected on EU-WEST-2 node.' },
    { type: 'info', text: '[INFO] Auto-scaling event: Adding 2 new instances to Gateway group.' },
    { type: 'success', text: '[OK] SSL certificate auto-renewed for api.apihub.com.' },
    { type: 'error', text: '[ERR] Failed request to /v1/billing: timeout from Stripe API.' }
  ];

  // Dynamic system events generator
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      setLogs((prevLogs) => {
        const nextLogs = [...prevLogs, randomLog];
        // Limit log array size to prevent bloat
        return nextLogs.slice(-20);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="space-y-xl">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Platform Control Center</h1>
          <p className="text-on-surface-variant font-body-md">System health and admin-level analytics.</p>
        </div>
        <div className="flex gap-sm">
          <div className="px-md py-sm bg-surface-container-high rounded-lg text-on-surface-variant font-body-sm flex items-center gap-xs shadow-sm select-none">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Past 7 Days
          </div>
          <button className="px-md py-sm bg-primary text-on-primary rounded-lg font-body-sm font-bold flex items-center gap-xs hover:brightness-110 transition-all shadow-sm active:scale-95">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        {/* Total Users */}
        <div className="glass-panel p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-primary-container/10 rounded-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">group</span>
            </div>
            <span className="text-tertiary font-bold text-body-sm flex items-center gap-xs bg-tertiary-container/10 px-sm py-xs rounded-full">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              12%
            </span>
          </div>
          <p className="text-on-surface-variant text-label-caps font-label-caps uppercase tracking-wider mb-xs">Total Users</p>
          <h3 className="text-headline-sm font-headline-sm font-bold">14,282</h3>
        </div>

        {/* Total APIs */}
        <div className="glass-panel p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-primary-container/10 rounded-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">api</span>
            </div>
            <span className="text-tertiary font-bold text-body-sm flex items-center gap-xs bg-tertiary-container/10 px-sm py-xs rounded-full">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              8.4%
            </span>
          </div>
          <p className="text-on-surface-variant text-label-caps font-label-caps uppercase tracking-wider mb-xs">Total APIs</p>
          <h3 className="text-headline-sm font-headline-sm font-bold">842</h3>
        </div>

        {/* Active Users */}
        <div className="glass-panel p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-primary-container/10 rounded-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">bolt</span>
            </div>
            <span className="text-error font-bold text-body-sm flex items-center gap-xs bg-error-container/10 px-sm py-xs rounded-full">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              2.1%
            </span>
          </div>
          <p className="text-on-surface-variant text-label-caps font-label-caps uppercase tracking-wider mb-xs">Active Users (24h)</p>
          <h3 className="text-headline-sm font-headline-sm font-bold">3,120</h3>
        </div>

        {/* Uptime */}
        <div className="glass-panel p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-primary-container/10 rounded-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">health_and_safety</span>
            </div>
            <span className="text-tertiary font-bold text-body-sm flex items-center gap-xs bg-tertiary-container/10 px-sm py-xs rounded-full">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Stable
            </span>
          </div>
          <p className="text-on-surface-variant text-label-caps font-label-caps uppercase tracking-wider mb-xs">System Uptime</p>
          <h3 className="text-headline-sm font-headline-sm font-bold">99.98%</h3>
        </div>
      </div>

      {/* Traffic and Growth charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* System Traffic SVG Chart */}
        <div className="lg:col-span-2 glass-panel p-lg rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h4 className="font-headline-sm text-headline-sm font-bold">System Traffic</h4>
              <p className="text-on-surface-variant text-body-sm">Global API request volume per hour</p>
            </div>
            <div className="flex items-center gap-md">
              <div className="flex items-center gap-xs">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                <span className="text-body-sm text-on-surface-variant">Production</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
                <span className="text-body-sm text-on-surface-variant">Staging</span>
              </div>
            </div>
          </div>
          <div className="h-64 relative w-full pt-4">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,150 Q100,50 200,120 T400,60 T600,100 T800,40 V200 H0 Z" fill="url(#chart-fill)"></path>
              <path d="M0,150 Q100,50 200,120 T400,60 T600,100 T800,40" fill="none" stroke="#3525cd" strokeWidth="3"></path>
              <circle cx="400" cy="60" fill="#3525cd" r="4"></circle>
              <circle cx="400" cy="60" fill="#3525cd" fillOpacity="0.1" r="10"></circle>
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between px-xs pt-md border-t border-outline-variant/10 text-label-caps text-on-surface-variant text-[9px]">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>23:59</span>
            </div>
          </div>
        </div>

        {/* User Growth Bar Chart */}
        <div className="glass-panel p-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-headline-sm text-headline-sm font-bold mb-xs">User Growth</h4>
            <p className="text-on-surface-variant text-body-sm mb-xl">New registrations by region</p>
          </div>
          <div className="flex-1 flex items-end gap-sm px-md pb-md min-h-[160px]">
            <div className="flex-1 bg-primary-container/20 rounded-t-lg h-[60%] hover:bg-primary-container/40 transition-colors relative group cursor-pointer">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">1.2k users</div>
            </div>
            <div className="flex-1 bg-primary-container/40 rounded-t-lg h-[85%] hover:bg-primary-container transition-colors relative group cursor-pointer">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">2.8k users</div>
            </div>
            <div className="flex-1 bg-primary-container/20 rounded-t-lg h-[45%] hover:bg-primary-container/40 transition-colors relative group cursor-pointer">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">0.9k users</div>
            </div>
            <div className="flex-1 bg-primary-container/30 rounded-t-lg h-[70%] hover:bg-primary-container/50 transition-colors relative group cursor-pointer">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">1.9k users</div>
            </div>
            <div className="flex-1 bg-primary h-[95%] rounded-t-lg relative group cursor-pointer">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">3.4k users</div>
            </div>
          </div>
          <div className="flex justify-between text-label-caps text-on-surface-variant pt-sm px-sm text-[10px]">
            <span>NA</span>
            <span>EU</span>
            <span>AS</span>
            <span>SA</span>
            <span>AF</span>
          </div>
        </div>
      </div>

      {/* Live Activity Feed and Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Real-time Activity Feed */}
        <div className="glass-panel rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-lg py-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
            <h4 className="font-headline-sm text-headline-sm font-bold">System Events</h4>
            <span className="flex items-center gap-sm text-body-sm text-tertiary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
              </span>
              Live Updates
            </span>
          </div>
          <div className="flex-1 divide-y divide-outline-variant/10 overflow-y-auto max-h-[350px]">
            <div className="p-md flex items-start gap-md hover:bg-surface-variant/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-tertiary-container/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-base">
                  <p className="font-bold text-body-sm">API Deployment Successful</p>
                  <span className="text-label-caps text-on-surface-variant text-[10px]">2m ago</span>
                </div>
                <p className="text-on-surface-variant text-body-sm">Payments Gateway v2.4.0 is now live in production region US-EAST-1.</p>
              </div>
            </div>
            
            <div className="p-md flex items-start gap-md hover:bg-surface-variant/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-error-container/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-error">warning</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-base">
                  <p className="font-bold text-body-sm">Rate Limit Triggered</p>
                  <span className="text-label-caps text-on-surface-variant text-[10px]">15m ago</span>
                </div>
                <p className="text-on-surface-variant text-body-sm">Suspicious activity detected from IP 192.168.1.1. Temporary block applied.</p>
              </div>
            </div>
            
            <div className="p-md flex items-start gap-md hover:bg-surface-variant/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">person_add</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-base">
                  <p className="font-bold text-body-sm">New Enterprise Signup</p>
                  <span className="text-label-caps text-on-surface-variant text-[10px]">42m ago</span>
                </div>
                <p className="text-on-surface-variant text-body-sm">GlobalTech Corp has subscribed to the Platinum Enterprise Plan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialized Component: API Terminal */}
        <div className="bg-[#0F172A] rounded-xl shadow-xl overflow-hidden flex flex-col font-mono text-[13px]">
          <div className="px-md py-sm bg-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
              <span className="text-[#94A3B8] text-xs ml-md">System Logs / Main</span>
            </div>
            <span className="material-symbols-outlined text-[#94A3B8] text-[18px]">terminal</span>
          </div>
          <div className="p-lg space-y-sm text-[#CBD5E1] h-[350px] overflow-y-auto">
            {logs.map((log, index) => (
              <p
                key={index}
                className={
                  log.type === 'success' ? 'text-[#a7f3d0]' : // light green
                  log.type === 'info' ? 'text-[#c7d2fe]' : // light indigo
                  log.type === 'warning' ? 'text-[#fef08a]' : // light yellow
                  log.type === 'error' ? 'text-[#fca5a5]' : // light red
                  log.text.startsWith('//') ? 'text-[#64748b]' : // comment slate
                  'text-[#CBD5E1]'
                }
              >
                {log.text}
              </p>
            ))}
            <div ref={terminalEndRef} className="animate-pulse inline-block w-2 h-4 bg-slate-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
