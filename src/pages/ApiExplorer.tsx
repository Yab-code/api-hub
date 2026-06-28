import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiHubService } from '../services/api';
import type { ApiItem } from '../services/mockDb';

const ApiExplorer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [apis, setApis] = useState<ApiItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const queryParam = searchParams.get('query') || '';
  const categoryParam = searchParams.get('category') || 'All Categories';

  const [search, setSearch] = useState(queryParam);
  const [category, setCategory] = useState(categoryParam);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await apiHubService.getApis();
        const favList = await apiHubService.getFavorites();
        setApis(list);
        setFavorites(favList.map(f => f.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update query params when filtering
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ query: search, category });
  };

  const handleToggleFavorite = async (e: React.MouseEvent, apiId: string) => {
    e.stopPropagation();
    try {
      const isFav = await apiHubService.toggleFavorite(apiId);
      setFavorites(prev => 
        isFav ? [...prev, apiId] : prev.filter(id => id !== apiId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(queryParam.toLowerCase()) ||
                          api.description.toLowerCase().includes(queryParam.toLowerCase());
    const matchesCategory = categoryParam === 'All Categories' || 
                            categoryParam === 'All' ||
                            api.category.toLowerCase().includes(categoryParam.toLowerCase()) ||
                            categoryParam.toLowerCase().includes(api.category.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-xl">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-md text-headline-md text-on-surface">Explore APIs</h1>
        <p className="text-on-surface-variant font-body-md">Discover and connect to top-tier developer services.</p>
      </div>

      {/* Filter Form */}
      <form onSubmit={handleFilterSubmit} className="glass-panel p-md rounded-xl flex flex-col md:flex-row gap-md shadow-sm">
        <div className="flex-1 flex items-center bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary transition-all">
          <span className="material-symbols-outlined text-outline text-[22px] mr-2">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-body-md font-body-md w-full placeholder-on-surface-variant p-0 focus:ring-0"
            placeholder="Search for payments, auth, databases..."
            type="text"
          />
        </div>
        
        <div className="flex gap-md">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm text-body-md font-body-md text-on-surface-variant focus:ring-2 focus:ring-primary outline-none cursor-pointer"
          >
            <option>All Categories</option>
            <option>Payment</option>
            <option>Artificial Intelligence</option>
            <option>Data</option>
            <option>Messaging</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-body-md text-body-md font-semibold hover:brightness-105 transition-colors shadow-sm active:scale-95 whitespace-nowrap"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* API Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {loading ? (
          [1, 2, 3].map(n => (
            <div key={n} className="glass-panel rounded-xl p-lg h-52 animate-pulse" />
          ))
        ) : filteredApis.length === 0 ? (
          <div className="col-span-full py-3xl text-center">
            <span className="material-symbols-outlined text-[48px] text-outline mb-sm">manage_search</span>
            <h3 className="font-headline-sm text-on-surface">No APIs found</h3>
            <p className="text-on-surface-variant text-body-sm mt-xs">Try adjusting your keywords or category filters.</p>
          </div>
        ) : (
          filteredApis.map((api) => {
            const isFav = favorites.includes(api.id);
            return (
              <div
                key={api.id}
                onClick={() => navigate(`/apis/${api.id}`)}
                className="glass-panel rounded-xl p-lg flex flex-col hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center overflow-hidden">
                    <img className="w-8 h-8 object-contain" alt={api.name} src={api.logo} />
                  </div>
                  <div className="flex items-center gap-sm">
                    <button
                      onClick={(e) => handleToggleFavorite(e, api.id)}
                      className={`p-1.5 rounded-full hover:bg-surface-variant/50 transition-colors focus:outline-none`}
                    >
                      <span
                        className="material-symbols-outlined text-[22px] transition-colors"
                        style={{
                          fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0",
                          color: isFav ? '#eab308' : '#777587'
                        }}
                      >
                        star
                      </span>
                    </button>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 font-label-caps text-[10px]">
                      {api.uptime}
                    </span>
                  </div>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-background mb-1 group-hover:text-primary transition-colors">
                  {api.name}
                </h3>
                <span className="text-[11px] font-label-caps text-primary bg-primary/5 border border-primary/10 rounded-full px-2 py-0.5 w-fit mb-3">
                  {api.category}
                </span>

                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 flex-grow line-clamp-2">
                  {api.description}
                </p>

                <div className="flex items-center justify-between border-t border-outline-variant/50 pt-4 mt-auto">
                  <div className="flex items-center gap-1 text-on-surface-variant text-sm">
                    <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-semibold">{api.rating}</span>
                  </div>
                  <span className="text-primary font-body-sm font-bold flex items-center gap-xs group-hover:translate-x-1 transition-transform">
                    View Integration
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ApiExplorer;
