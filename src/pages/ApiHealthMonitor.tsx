import React, { useState } from 'react';

interface MonitoredApi {
  id: string;
  name: string;
  icon: string;
  status: 'operational' | 'degraded' | 'down';
  successRate: string;
  latency: string;
  sparklinePath: string;
  sparklineColor: string;
}

const APIS: MonitoredApi[] = [
  { id: '1', name: 'Payment Gateway v2', icon: 'payments', status: 'operational', successRate: '99.8%', latency: '185ms', sparklinePath: 'M0,25 Q10,15 20,20 T40,10 T60,18 T80,5 T100,12', sparklineColor: '#6366f1' },
  { id: '2', name: 'User Discovery API', icon: 'person_search', status: 'degraded', successRate: '94.2%', latency: '1.2s', sparklinePath: 'M0,15 Q20,15 40,25 T60,28 T80,22 T100,29', sparklineColor: '#f59e0b' },
  { id: '3', name: 'Cloud Storage Sync', icon: 'cloud_sync', status: 'operational', successRate: '99.9%', latency: '45ms', sparklinePath: 'M0,10 Q15,8 30,12 T50,11 T75,9 T100,10', sparklineColor: '#6366f1' },
  { id: '4', name: 'AI Inference Engine', icon: 'auto_awesome', status: 'operational', successRate: '98.1%', latency: '320ms', sparklinePath: 'M0,20 Q25,10 50,15 T75,8 T100,12', sparklineColor: '#6366f1' },
  { id: '5', name: 'Notification Service', icon: 'notifications', status: 'down', successRate: '0%', latency: '—', sparklinePath: 'M0,5 Q25,5 50,5 T75,25 T100,28', sparklineColor: '#ef4444' },
];

const STATUS_CONFIG = {
  operational: { color: 'bg-emerald-500', label: 'Operational', textColor: 'text-emerald-600' },
  degraded: { color: 'bg-yellow-400', label: 'Elevated Latency', textColor: 'text-yellow-600' },
  down: { color: 'bg-red-500', label: 'Outage', textColor: 'text-red-600' },
};

const ApiHealthMonitor: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Critical' | 'External' | 'Internal'>('All');

  const filtered = APIS.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Critical') return matchesSearch && api.status !== 'operational';
    return matchesSearch;
  });

  const overallHealth = Math.round(APIS.filter(a => a.status === 'operational').length / APIS.length * 100);

  return (
    <div className="space-y-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">API Health Monitor</h1>
          <p className="text-on-surface-variant text-body-md">Real-time status and latency metrics for your service mesh.</p>
        </div>
        <div className="flex gap-sm">
          <div className="flex items-center gap-sm bg-surface-container-high/50 border border-outline-variant/30 px-md py-sm rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-body-sm font-bold text-on-surface-variant">Live Monitoring</span>
          </div>
          <button className="flex items-center gap-sm bg-surface-container-lowest border border-outline-variant px-md py-sm rounded-xl font-bold text-body-sm hover:border-primary hover:text-primary transition-all">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Last 24 Hours
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {[
          { label: 'Average Uptime', value: '99.99%', delta: '+0.01%', positive: true, icon: 'verified_user', barWidth: '99%', barColor: 'bg-emerald-500' },
          { label: 'Avg Response Time', value: '240ms', delta: '+12ms', positive: false, icon: 'speed', barWidth: '75%', barColor: 'bg-primary' },
          { label: 'Overall Success Rate', value: '98.5%', delta: '-0.2%', positive: false, icon: 'task_alt', barWidth: '98.5%', barColor: 'bg-primary' },
        ].map((card, i) => (
          <div key={i} className="glass-panel p-lg rounded-xl border border-outline-variant/30">
            <div className="flex items-center justify-between mb-md">
              <span className="text-on-surface-variant font-label-caps text-label-caps uppercase">{card.label}</span>
              <span className="material-symbols-outlined text-primary">{card.icon}</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{card.value}</span>
              <span className={`font-bold text-body-sm ${card.positive ? 'text-emerald-600' : 'text-error'}`}>{card.delta}</span>
            </div>
            <div className="mt-md h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div className={`h-full ${card.barColor} transition-all duration-1000`} style={{ width: card.barWidth }} />
            </div>
          </div>
        ))}
      </div>

      {/* API List */}
      <div className="glass-panel border border-outline-variant/30 rounded-xl overflow-hidden">
        {/* Filter Bar */}
        <div className="p-md border-b border-outline-variant/30 flex flex-col md:flex-row gap-md justify-between items-center bg-surface-container-low/30">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-xl pr-md py-sm bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-body-sm transition-all"
              placeholder="Filter APIs by name or tag..."
            />
          </div>
          <div className="flex items-center gap-sm overflow-x-auto w-full md:w-auto">
            <span className="text-body-sm text-on-surface-variant font-bold whitespace-nowrap">Filter:</span>
            {(['All', 'Critical', 'External', 'Internal'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-md py-xs rounded-full text-body-sm font-bold transition-colors whitespace-nowrap ${filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-lg px-lg py-sm bg-surface-container-low/50 border-b border-outline-variant/20">
          <div className="col-span-4 font-label-caps text-label-caps text-on-surface-variant uppercase">Service</div>
          <div className="col-span-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Trend</div>
          <div className="col-span-2 font-label-caps text-label-caps text-on-surface-variant uppercase text-center">Success Rate</div>
          <div className="col-span-2 font-label-caps text-label-caps text-on-surface-variant uppercase text-center">p99 Latency</div>
          <div className="col-span-1" />
        </div>

        {/* API Rows */}
        <div className="divide-y divide-outline-variant/20">
          {filtered.length === 0 ? (
            <div className="p-2xl text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[36px] block mb-sm">search_off</span>
              No APIs matched your filter
            </div>
          ) : filtered.map(api => {
            const st = STATUS_CONFIG[api.status];
            return (
              <div key={api.id} className="grid grid-cols-1 md:grid-cols-12 gap-lg p-lg items-center hover:bg-surface-container/30 transition-colors cursor-pointer group">
                <div className="col-span-4 flex items-center gap-md">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined">{api.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">{api.name}</h3>
                    <div className="flex items-center gap-sm mt-xs">
                      <span className={`w-2 h-2 rounded-full ${st.color}`} />
                      <span className={`text-[12px] ${st.textColor} font-medium`}>{st.label}</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 hidden md:block">
                  <svg className="w-full h-10" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d={api.sparklinePath} fill="none" stroke={api.sparklineColor} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-[11px] text-on-surface-variant font-label-caps uppercase mb-xs">Success Rate</p>
                  <p className={`font-bold text-body-md ${api.status === 'down' ? 'text-error' : 'text-on-surface'}`}>{api.successRate}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-[11px] text-on-surface-variant font-label-caps uppercase mb-xs">p99 Latency</p>
                  <p className={`font-bold text-body-md ${api.status === 'degraded' ? 'text-yellow-600' : 'text-on-surface'}`}>{api.latency}</p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Status Banner */}
      <div className={`rounded-xl p-lg flex items-center gap-lg ${overallHealth === 100 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
        <span className={`material-symbols-outlined text-[32px] ${overallHealth === 100 ? 'text-emerald-600' : 'text-yellow-600'}`}>
          {overallHealth === 100 ? 'check_circle' : 'warning'}
        </span>
        <div>
          <h3 className="font-bold text-on-surface">{overallHealth === 100 ? 'All Systems Operational' : 'Partial Service Disruption'}</h3>
          <p className="text-on-surface-variant text-body-sm">{overallHealth}% of services are running normally. {overallHealth < 100 && 'Some services may experience elevated latency.'}</p>
        </div>
        <button className="ml-auto text-primary font-bold text-body-sm hover:underline whitespace-nowrap">View Status Page</button>
      </div>
    </div>
  );
};

export default ApiHealthMonitor;
