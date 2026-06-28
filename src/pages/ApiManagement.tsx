import React, { useState } from 'react';

interface ManagedApi {
  id: string;
  name: string;
  icon: string;
  creator: string;
  status: 'active' | 'deprecated';
  requests24h: string;
  trend: string;
  trendUp: boolean;
  endpoints: number;
  version: string;
  selected: boolean;
}

const APIS: ManagedApi[] = [
  { id: '1', name: 'Payment Gateway Pro', icon: 'payments', creator: 'Julian D.', status: 'active', requests24h: '4.2M', trend: '12%', trendUp: true, endpoints: 18, version: 'v2.4.0', selected: false },
  { id: '2', name: 'User Discovery API', icon: 'person_search', creator: 'Sarah M.', status: 'active', requests24h: '1.8M', trend: '5%', trendUp: true, endpoints: 9, version: 'v1.2.3', selected: false },
  { id: '3', name: 'Legacy Auth Service', icon: 'lock_person', creator: 'Admin', status: 'deprecated', requests24h: '12K', trend: '34%', trendUp: false, endpoints: 4, version: 'v0.9.1', selected: false },
  { id: '4', name: 'AI Inference Engine', icon: 'auto_awesome', creator: 'Alex R.', status: 'active', requests24h: '920K', trend: '22%', trendUp: true, endpoints: 7, version: 'v3.0.0', selected: false },
  { id: '5', name: 'Storage Blob API', icon: 'cloud_upload', creator: 'System', status: 'active', requests24h: '3.1M', trend: '8%', trendUp: true, endpoints: 12, version: 'v2.1.0', selected: false },
];

const ApiManagement: React.FC = () => {
  const [apis, setApis] = useState<ManagedApi[]>(APIS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Deprecated'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleSelect = (id: string) =>
    setApis(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  const toggleSelectAll = () => {
    const allSelected = filtered.every(a => a.selected);
    const ids = new Set(filtered.map(a => a.id));
    setApis(prev => prev.map(a => ids.has(a.id) ? { ...a, selected: !allSelected } : a));
  };

  const filtered = apis.filter(api => {
    const matchSearch = api.name.toLowerCase().includes(search.toLowerCase()) || api.creator.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || api.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const selectedCount = apis.filter(a => a.selected).length;

  return (
    <div className="space-y-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">API Management</h1>
          <p className="text-on-surface-variant mt-1">Monitor, deprecate, and manage your organization's interface ecosystem.</p>
        </div>
        <div className="flex items-center gap-sm">
          <button className="flex items-center gap-sm px-md py-sm border border-outline text-on-surface-variant rounded-xl hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined">file_download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="font-bold">Add API</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        {[
          { label: 'Total APIs', value: apis.length, icon: 'api', color: 'text-primary' },
          { label: 'Active', value: apis.filter(a => a.status === 'active').length, icon: 'check_circle', color: 'text-emerald-600' },
          { label: 'Deprecated', value: apis.filter(a => a.status === 'deprecated').length, icon: 'warning', color: 'text-yellow-600' },
          { label: 'Total Requests (24h)', value: '10.1M', icon: 'trending_up', color: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-md rounded-xl">
            <div className="flex items-center gap-sm mb-xs">
              <span className={`material-symbols-outlined text-[20px] ${stat.color}`}>{stat.icon}</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{stat.label}</span>
            </div>
            <div className="font-headline-sm text-headline-sm font-bold text-on-surface">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="glass-panel border border-outline-variant/30 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-lg border-b border-outline-variant/30 flex flex-col lg:flex-row gap-lg justify-between items-center bg-surface-container-low/30">
          <div className="flex flex-wrap items-center gap-sm w-full lg:w-auto">
            <div className="relative flex-1 min-w-[220px]">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-md py-sm bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-body-sm"
                placeholder="Search APIs, tags, or creators..."
              />
            </div>
            {selectedCount > 0 && (
              <div className="flex items-center gap-sm px-md py-sm bg-primary/10 border border-primary/30 rounded-xl text-primary text-body-sm font-bold">
                <span>{selectedCount} selected</span>
                <button className="hover:text-error transition-colors text-[12px]">Bulk Delete</button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-sm">
            <span className="font-label-caps text-on-surface-variant text-[11px]">FILTER BY STATUS:</span>
            <div className="flex p-1 bg-surface-container-high rounded-xl gap-1">
              {(['All', 'Active', 'Deprecated'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-md py-1.5 text-body-sm rounded-lg transition-all ${statusFilter === f ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest">
                <th className="pl-lg pr-md py-md w-12">
                  <input type="checkbox" onChange={toggleSelectAll} checked={filtered.length > 0 && filtered.every(a => a.selected)} className="rounded border-outline-variant text-primary focus:ring-primary" />
                </th>
                {['Name', 'Creator', 'Status', 'Total Requests (24h)', 'Endpoints', ''].map((col, i) => (
                  <th key={i} className="px-md py-md font-label-caps text-on-surface-variant uppercase tracking-wider text-[11px]">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filtered.map(api => (
                <tr key={api.id} className={`hover:bg-surface-container/30 transition-colors group ${api.selected ? 'bg-primary/5' : ''}`}>
                  <td className="pl-lg pr-md py-lg">
                    <input type="checkbox" checked={api.selected} onChange={() => toggleSelect(api.id)} className="rounded border-outline-variant text-primary focus:ring-primary" />
                  </td>
                  <td className="px-md py-lg">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{api.icon}</span>
                      </div>
                      <div>
                        <div className="font-bold text-on-surface group-hover:text-primary transition-colors">{api.name}</div>
                        <div className="text-xs text-outline font-mono">{api.version}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-md py-lg">
                    <div className="flex items-center gap-sm">
                      <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                        {api.creator.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-body-sm">{api.creator}</span>
                    </div>
                  </td>
                  <td className="px-md py-lg">
                    <span className={`inline-flex items-center gap-1.5 px-sm py-1 rounded-full text-[11px] font-bold ${
                      api.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-700'
                        : 'bg-yellow-500/10 text-yellow-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${api.status === 'active' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                      {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-md py-lg">
                    <div className="flex items-center gap-sm">
                      <span className="font-mono text-body-sm">{api.requests24h}</span>
                      <span className={`text-[10px] flex items-center ${api.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                        <span className="material-symbols-outlined text-xs">{api.trendUp ? 'trending_up' : 'trending_down'}</span>
                        {api.trend}
                      </span>
                    </div>
                  </td>
                  <td className="px-md py-lg">
                    <span className="font-mono text-body-sm">{api.endpoints}</span>
                  </td>
                  <td className="pr-lg pl-md py-lg">
                    <div className="flex items-center gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-error/5 text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-md border-t border-outline-variant/20 flex items-center justify-between text-body-sm text-on-surface-variant">
          <span>Showing {filtered.length} of {apis.length} APIs</span>
          <div className="flex items-center gap-sm">
            <button className="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-40" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="px-sm py-1 bg-primary text-on-primary rounded text-[12px] font-bold">1</span>
            <button className="p-1 rounded hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add API Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-xl w-full max-w-md shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-headline-sm text-on-surface">Add New API</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-md">
              {[{ label: 'API Name', placeholder: 'e.g. Payment Gateway v3' }, { label: 'Base URL', placeholder: 'https://api.example.com/v1' }, { label: 'Version', placeholder: 'v1.0.0' }].map(field => (
                <div key={field.label}>
                  <label className="block font-body-sm font-bold text-on-surface mb-xs">{field.label}</label>
                  <input placeholder={field.placeholder} className="w-full bg-surface-container border border-outline-variant rounded-xl px-md py-sm text-body-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
              ))}
              <div className="flex gap-sm pt-md">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-sm border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-sm bg-primary text-on-primary rounded-xl font-bold hover:brightness-105 active:scale-95 transition-all">Add API</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiManagement;
