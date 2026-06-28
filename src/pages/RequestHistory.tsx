import React, { useState } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type StatusFilter = 'All Statuses' | '2xx Success' | '4xx Client Error' | '5xx Server Error';
type MethodFilter = 'All Methods' | HttpMethod;

interface HistoryEntry {
  id: string;
  method: HttpMethod;
  apiName: string;
  endpoint: string;
  status: number;
  latency: string;
  timestamp: string;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'bg-blue-500/10 text-blue-600',
  POST: 'bg-green-500/10 text-green-600',
  PUT: 'bg-yellow-500/10 text-yellow-600',
  DELETE: 'bg-red-500/10 text-red-600',
  PATCH: 'bg-purple-500/10 text-purple-600',
};

const MOCK_HISTORY: HistoryEntry[] = [
  { id: '1', method: 'GET', apiName: 'Payment Gateway', endpoint: '/v1/transactions/tx_9921', status: 200, latency: '124ms', timestamp: '2 mins ago' },
  { id: '2', method: 'POST', apiName: 'OpenAI API', endpoint: '/v1/chat/completions', status: 200, latency: '891ms', timestamp: '5 mins ago' },
  { id: '3', method: 'GET', apiName: 'Weather API', endpoint: '/v2/current?city=London', status: 404, latency: '67ms', timestamp: '12 mins ago' },
  { id: '4', method: 'DELETE', apiName: 'Storage API', endpoint: '/v1/objects/img_992', status: 204, latency: '43ms', timestamp: '1 hour ago' },
  { id: '5', method: 'POST', apiName: 'Auth Service', endpoint: '/v1/auth/token', status: 500, latency: '2.1s', timestamp: '2 hours ago' },
  { id: '6', method: 'PUT', apiName: 'User API', endpoint: '/v2/users/usr_019', status: 200, latency: '185ms', timestamp: '3 hours ago' },
  { id: '7', method: 'GET', apiName: 'Analytics', endpoint: '/v1/events?limit=100', status: 200, latency: '320ms', timestamp: 'Yesterday' },
  { id: '8', method: 'PATCH', apiName: 'Payment Gateway', endpoint: '/v1/subscriptions/sub_44', status: 401, latency: '55ms', timestamp: 'Yesterday' },
];

const getStatusConfig = (status: number) => {
  if (status < 300) return { color: 'bg-emerald-500', textColor: 'text-emerald-700' };
  if (status < 500) return { color: 'bg-yellow-400', textColor: 'text-yellow-700' };
  return { color: 'bg-red-500', textColor: 'text-red-700' };
};

const RequestHistory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('All Methods');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All Statuses');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = MOCK_HISTORY.filter(entry => {
    const matchSearch = entry.apiName.toLowerCase().includes(search.toLowerCase()) ||
                        entry.endpoint.toLowerCase().includes(search.toLowerCase());
    const matchMethod = methodFilter === 'All Methods' || entry.method === methodFilter;
    const matchStatus =
      statusFilter === 'All Statuses' ||
      (statusFilter === '2xx Success' && entry.status >= 200 && entry.status < 300) ||
      (statusFilter === '4xx Client Error' && entry.status >= 400 && entry.status < 500) ||
      (statusFilter === '5xx Server Error' && entry.status >= 500);
    return matchSearch && matchMethod && matchStatus;
  });

  const handleExportCSV = () => {
    const headers = 'Method,API Name,Endpoint,Status,Latency,Timestamp\n';
    const rows = filtered.map(e => `${e.method},${e.apiName},${e.endpoint},${e.status},${e.latency},${e.timestamp}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'request_history.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Request History</h1>
          <p className="text-on-surface-variant font-body-sm">Monitor and debug all incoming API calls in real-time.</p>
        </div>
        <div className="flex items-center gap-sm">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-sm px-md py-sm border border-outline-variant/30 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors text-body-sm"
          >
            <span className="material-symbols-outlined">download</span>
            Export CSV
          </button>
          <button className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all text-body-sm">
            <span className="material-symbols-outlined">ios_share</span>
            Export JSON
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        {[
          { label: 'Total Requests', value: MOCK_HISTORY.length, icon: 'api', color: 'text-primary' },
          { label: '2xx Success', value: MOCK_HISTORY.filter(e => e.status < 300).length, icon: 'check_circle', color: 'text-emerald-600' },
          { label: '4xx Errors', value: MOCK_HISTORY.filter(e => e.status >= 400 && e.status < 500).length, icon: 'warning', color: 'text-yellow-600' },
          { label: '5xx Errors', value: MOCK_HISTORY.filter(e => e.status >= 500).length, icon: 'error', color: 'text-red-600' },
        ].map((s, i) => (
          <div key={i} className="glass-panel p-md rounded-xl">
            <div className="flex items-center gap-sm mb-xs">
              <span className={`material-symbols-outlined text-[20px] ${s.color}`}>{s.icon}</span>
            </div>
            <div className="font-headline-sm text-headline-sm font-bold text-on-surface">{s.value}</div>
            <div className="text-on-surface-variant font-body-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-md rounded-xl border border-outline-variant/20 shadow-sm flex flex-col lg:flex-row gap-md items-center">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-md py-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-body-sm"
            placeholder="Filter by endpoint or API name..."
          />
        </div>
        <div className="flex flex-wrap gap-sm items-center w-full lg:w-auto">
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value as MethodFilter)}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-md py-sm text-body-sm outline-none focus:ring-2 focus:ring-primary/20"
          >
            {['All Methods', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m}>{m}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as StatusFilter)}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-md py-sm text-body-sm outline-none focus:ring-2 focus:ring-primary/20"
          >
            {['All Statuses', '2xx Success', '4xx Client Error', '5xx Server Error'].map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-md py-sm cursor-pointer hover:bg-surface-variant/10">
            <span className="material-symbols-outlined text-outline text-sm">calendar_today</span>
            <span className="text-body-sm text-on-surface-variant">Last 24 Hours</span>
          </div>
          <button className="p-sm text-primary hover:bg-primary/5 rounded-lg transition-colors">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/30">
                {['Method', 'API Name', 'Endpoint', 'Status', 'Latency', 'Timestamp'].map((col, i) => (
                  <th key={col} className={`px-lg py-md font-label-caps text-label-caps text-outline uppercase text-[11px] ${i === 5 ? 'text-right' : ''}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-lg py-2xl text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[36px] block mb-sm opacity-30">search_off</span>
                    No requests matched your filters
                  </td>
                </tr>
              ) : filtered.map(entry => {
                const stConfig = getStatusConfig(entry.status);
                const isExpanded = expandedId === entry.id;
                return (
                  <React.Fragment key={entry.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      className="hover:bg-surface-container-low/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-lg py-md">
                        <span className={`px-sm py-0.5 rounded text-[10px] font-bold ${METHOD_COLORS[entry.method]}`}>
                          {entry.method}
                        </span>
                      </td>
                      <td className="px-lg py-md font-body-sm font-medium text-on-surface">{entry.apiName}</td>
                      <td className="px-lg py-md font-mono text-code text-on-surface-variant text-[12px]">{entry.endpoint}</td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <div className={`w-2 h-2 rounded-full ${stConfig.color}`} />
                          <span className={`font-body-sm ${stConfig.textColor}`}>{entry.status}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md font-body-sm text-on-surface-variant">{entry.latency}</td>
                      <td className="px-lg py-md font-body-sm text-on-surface-variant text-right">{entry.timestamp}</td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-surface-container/30">
                        <td colSpan={6} className="px-lg py-md">
                          <div className="text-body-sm text-on-surface-variant space-y-xs">
                            <div><strong className="text-on-surface">Request URL:</strong> <code className="font-mono text-primary">https://api.hub.com{entry.endpoint}</code></div>
                            <div><strong className="text-on-surface">Method:</strong> {entry.method}</div>
                            <div><strong className="text-on-surface">Status:</strong> {entry.status}</div>
                            <div><strong className="text-on-surface">Latency:</strong> {entry.latency}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-md border-t border-outline-variant/20 flex items-center justify-between text-body-sm text-on-surface-variant">
          <span>Showing {filtered.length} of {MOCK_HISTORY.length} requests</span>
          <div className="flex items-center gap-sm">
            <button className="p-1 rounded hover:bg-surface-container disabled:opacity-40" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="px-sm py-1 bg-primary text-on-primary rounded text-[12px] font-bold">1</span>
            <button className="p-1 rounded hover:bg-surface-container">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHistory;
