import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiHubService } from '../services/api';
import type { ApiItem } from '../services/mockDb';

type SortOption = 'Recently Added' | 'Name (A-Z)' | 'Usage Frequency' | 'Stability Score';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('Recently Added');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await apiHubService.getFavorites();
        setFavorites(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (e: React.MouseEvent, apiId: string) => {
    e.stopPropagation();
    await apiHubService.toggleFavorite(apiId);
    setFavorites(prev => prev.filter(a => a.id !== apiId));
  };

  const filtered = favorites
    .filter(api => api.name.toLowerCase().includes(search.toLowerCase()) || api.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'Name (A-Z)') return a.name.localeCompare(b.name);
      if (sort === 'Stability Score') return parseFloat(b.uptime) - parseFloat(a.uptime);
      return 0;
    });

  return (
    <div className="space-y-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <div className="flex items-center gap-sm text-primary mb-xs">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-label-caps text-label-caps uppercase tracking-widest">Collections</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Saved APIs</h1>
          <p className="text-on-surface-variant font-body-md">
            You have <span className="font-bold text-on-background">{favorites.length}</span> saved APIs.
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-md items-center glass-panel p-sm rounded-xl border border-outline-variant/30 shadow-sm">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-xl pr-md py-sm bg-transparent border-none focus:ring-0 text-body-md outline-none placeholder:text-on-surface-variant/50"
            placeholder="Search your favorites..."
          />
        </div>
        <div className="h-6 w-px bg-outline-variant/30 hidden md:block" />
        <div className="flex items-center gap-md w-full md:w-auto px-md">
          <span className="text-body-sm text-on-surface-variant whitespace-nowrap">Sort by:</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="bg-transparent border-none text-body-sm font-bold text-primary focus:ring-0 cursor-pointer py-sm pr-lg outline-none"
          >
            {(['Recently Added', 'Name (A-Z)', 'Usage Frequency', 'Stability Score'] as SortOption[]).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* API Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {[1, 2, 3].map(i => <div key={i} className="glass-panel rounded-xl h-52 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-3xl text-center">
          <span className="material-symbols-outlined text-[64px] text-outline opacity-40 block mb-md">star_border</span>
          <h2 className="font-headline-sm text-on-surface mb-xs">{search ? 'No matches found' : 'No favorites yet'}</h2>
          <p className="text-on-surface-variant text-body-sm mb-lg">
            {search ? 'Try a different search term.' : 'Star APIs from the Explorer to save them here.'}
          </p>
          {!search && (
            <button onClick={() => navigate('/explore')} className="bg-primary text-on-primary px-xl py-sm rounded-xl font-bold hover:brightness-105 active:scale-95 transition-all">
              Browse APIs
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filtered.map(api => (
            <div
              key={api.id}
              onClick={() => navigate(`/apis/${api.id}`)}
              className="group glass-panel rounded-xl border border-outline-variant/30 p-lg hover:shadow-lg hover:border-primary/30 transition-all duration-300 relative overflow-hidden cursor-pointer"
            >
              {/* Remove Button */}
              <button
                onClick={e => handleRemoveFavorite(e, api.id)}
                className="absolute top-md right-md p-sm text-on-surface-variant hover:text-error transition-colors bg-surface-container-low rounded-full opacity-0 group-hover:opacity-100 z-10"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>heart_minus</span>
              </button>

              <div className="flex items-start gap-md mb-lg">
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center p-sm flex-shrink-0">
                  <img className="w-full h-full object-contain opacity-80" alt={api.name} src={api.logo} />
                </div>
                <div>
                  <h3 className="font-bold text-on-background group-hover:text-primary transition-colors">{api.name}</h3>
                  <span className="bg-tertiary/10 text-tertiary px-sm py-xs rounded-full text-[10px] font-bold uppercase tracking-wider">{api.category}</span>
                </div>
              </div>

              <p className="text-body-sm text-on-surface-variant mb-xl line-clamp-2">{api.description}</p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-md items-center">
                  <div className="flex items-center gap-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[12px] text-on-surface-variant">{api.uptime}</span>
                  </div>
                  <div className="flex items-center gap-xs text-yellow-500 text-[12px]">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    {api.rating}
                  </div>
                </div>
                <button className="flex items-center gap-sm bg-primary/10 text-primary text-body-sm px-md py-sm rounded-lg hover:bg-primary hover:text-on-primary active:scale-95 transition-all group-hover:shadow-sm">
                  <span className="material-symbols-outlined text-sm">play_circle</span>
                  Test API
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
