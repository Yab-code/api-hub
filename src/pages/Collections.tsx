import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Collection {
  id: string;
  name: string;
  description: string;
  apiCount: number;
  lastUpdated: string;
  color: string;
  icon: string;
  tags: string[];
}

const COLLECTIONS: Collection[] = [
  { id: '1', name: 'Payment APIs', description: 'All payment processing and financial service integrations', apiCount: 8, lastUpdated: '2 hours ago', color: 'from-blue-500/20 to-indigo-500/20', icon: 'payments', tags: ['Finance', 'Production'] },
  { id: '2', name: 'AI & ML Services', description: 'Machine learning inference and natural language processing', apiCount: 5, lastUpdated: '1 day ago', color: 'from-purple-500/20 to-pink-500/20', icon: 'auto_awesome', tags: ['AI', 'R&D'] },
  { id: '3', name: 'Data & Analytics', description: 'Data pipeline, warehousing, and analytics platforms', apiCount: 12, lastUpdated: '3 days ago', color: 'from-emerald-500/20 to-teal-500/20', icon: 'analytics', tags: ['Data', 'Internal'] },
  { id: '4', name: 'Communication', description: 'Email, SMS, push notifications, and messaging services', apiCount: 6, lastUpdated: '1 week ago', color: 'from-orange-500/20 to-yellow-500/20', icon: 'chat', tags: ['Messaging', 'Production'] },
];

const Collections: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [collections, setCollections] = useState<Collection[]>(COLLECTIONS);

  const filtered = collections.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newCol: Collection = {
      id: Date.now().toString(),
      name: newName,
      description: newDesc || 'No description provided',
      apiCount: 0,
      lastUpdated: 'Just now',
      color: 'from-slate-500/20 to-slate-700/20',
      icon: 'folder',
      tags: ['New'],
    };
    setCollections(prev => [newCol, ...prev]);
    setNewName('');
    setNewDesc('');
    setShowCreate(false);
  };

  return (
    <div className="space-y-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">My Collections</h1>
          <p className="font-body-md text-on-surface-variant mt-xs">Manage and organize your API endpoints and documentation bundles.</p>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative flex-1 md:w-72">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-xl pr-md py-2.5 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body-sm"
              placeholder="Search collections..."
            />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-sm bg-primary text-on-primary px-lg py-2.5 rounded-xl font-bold shadow-sm active:scale-95 transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined">add</span>
            Create Collection
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {[
          { label: 'Total Collections', value: collections.length, delta: '+3 this month', icon: 'folder_zip', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
          { label: 'Total APIs', value: collections.reduce((s, c) => s + c.apiCount, 0), delta: '+12 this week', icon: 'api', iconBg: 'bg-secondary-container/30', iconColor: 'text-secondary' },
          { label: 'Shared Teams', value: 4, delta: 'Across 3 orgs', icon: 'group', iconBg: 'bg-tertiary-container/10', iconColor: 'text-tertiary' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-xl rounded-2xl flex items-center gap-xl">
            <div className={`w-14 h-14 ${stat.iconBg} ${stat.iconColor} rounded-2xl flex items-center justify-center`}>
              <span className="material-symbols-outlined text-[32px]">{stat.icon}</span>
            </div>
            <div>
              <div className="text-on-surface-variant font-label-caps text-[11px] uppercase">{stat.label}</div>
              <div className="font-headline-sm text-headline-sm font-bold text-on-surface">{stat.value}</div>
              <div className="text-body-sm text-tertiary font-bold mt-1">{stat.delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Collection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {filtered.length === 0 ? (
          <div className="col-span-full py-3xl text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] block mb-sm opacity-30">folder_off</span>
            <p className="font-body-md">No collections matched</p>
          </div>
        ) : filtered.map(col => (
          <Link
            key={col.id}
            to={`/collections/${col.id}`}
            className={`group relative bg-gradient-to-br ${col.color} border border-outline-variant/30 rounded-2xl p-xl hover:shadow-lg hover:border-primary/30 transition-all overflow-hidden`}
          >
            <div className="absolute -right-6 -bottom-6 opacity-5">
              <span className="material-symbols-outlined text-[120px]">{col.icon}</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-md">
                <div className="w-12 h-12 bg-surface/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-primary border border-outline-variant/30">
                  <span className="material-symbols-outlined">{col.icon}</span>
                </div>
                <div className="flex gap-xs">
                  {col.tags.map(tag => (
                    <span key={tag} className="px-sm py-0.5 rounded-full bg-surface/60 backdrop-blur-sm text-[10px] font-bold text-on-surface-variant border border-outline-variant/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="font-headline-sm text-on-surface group-hover:text-primary transition-colors mb-xs">{col.name}</h2>
              <p className="text-on-surface-variant text-body-sm mb-lg line-clamp-2">{col.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-md text-on-surface-variant text-body-sm">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary">api</span>
                    <span>{col.apiCount} APIs</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>{col.lastUpdated}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors group-hover:translate-x-1 duration-200">arrow_forward</span>
              </div>
            </div>
          </Link>
        ))}

        {/* Add New Placeholder */}
        <button
          onClick={() => setShowCreate(true)}
          className="border-2 border-dashed border-outline-variant rounded-2xl p-xl flex flex-col items-center justify-center gap-md text-on-surface-variant hover:border-primary hover:text-primary transition-all group min-h-[200px]"
        >
          <span className="material-symbols-outlined text-[48px] opacity-40 group-hover:opacity-100 transition-opacity">add_box</span>
          <span className="font-bold">Create New Collection</span>
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-headline-sm text-on-surface">New Collection</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-md">
              <div>
                <label className="block font-body-sm font-bold text-on-surface mb-xs">Collection Name</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Production APIs"
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-md py-sm text-body-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block font-body-sm font-bold text-on-surface mb-xs">Description</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Brief description..."
                  rows={3}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-md py-sm text-body-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>
              <div className="flex gap-sm pt-md">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-sm border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-sm bg-primary text-on-primary rounded-xl font-bold hover:brightness-105 active:scale-95 transition-all">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
