import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiHubService } from '../services/api';
import { ApiItem } from '../services/mockDb';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [featuredApis, setFeaturedApis] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const apis = await apiHubService.getApis();
        // Show top 3 as featured
        setFeaturedApis(apis.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApis();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/apis?query=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}`);
  };

  const handleTrendSearch = (term: string) => {
    navigate(`/apis?query=${encodeURIComponent(term)}`);
  };

  return (
    <div className="pb-3xl">
      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-gutter py-3xl flex flex-col items-center text-center space-y-xl">
        <div className="space-y-md max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant mb-4">
            <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
            <span className="font-label-caps text-label-caps text-on-secondary-container uppercase">Over 50,000 APIs Indexed</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background">
            The World's Largest API Hub
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Discover, connect, and manage all your APIs from a single, unified platform. Built for modern developers who demand speed and reliability.
          </p>
        </div>

        {/* Global Search */}
        <form onSubmit={handleSearch} className="w-full max-w-4xl relative">
          <div className="glass-panel rounded-xl p-md flex flex-col md:flex-row gap-md shadow-sm">
            <div className="flex-1 flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
              <span className="material-symbols-outlined text-primary text-[24px] mr-3">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-body-lg font-body-lg w-full placeholder-on-surface-variant p-0 focus:ring-0"
                placeholder="Search for payments, AI, messaging..."
                type="text"
              />
            </div>
            <div className="flex gap-md">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md text-on-surface-variant focus:ring-2 focus:ring-primary outline-none hidden md:block"
              >
                <option>All Categories</option>
                <option>Payment</option>
                <option>Artificial Intelligence</option>
                <option>Data</option>
                <option>Messaging</option>
              </select>
              <button
                type="submit"
                className="px-6 py-3 bg-primary-container text-on-primary rounded-lg font-body-md text-body-md font-semibold hover:bg-primary transition-colors whitespace-nowrap shadow-sm w-full md:w-auto"
              >
                Search Hub
              </button>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-md text-on-surface-variant font-body-sm text-body-sm pt-4">
          <span>Trending searches:</span>
          <button onClick={() => handleTrendSearch('OpenAI')} className="hover:text-primary transition-colors underline decoration-outline-variant hover:decoration-primary underline-offset-4">OpenAI</button>
          <button onClick={() => handleTrendSearch('Stripe')} className="hover:text-primary transition-colors underline decoration-outline-variant hover:decoration-primary underline-offset-4">Stripe</button>
          <button onClick={() => handleTrendSearch('Twilio')} className="hover:text-primary transition-colors underline decoration-outline-variant hover:decoration-primary underline-offset-4">Twilio</button>
        </div>
      </section>

      {/* Featured APIs (Bento Grid) */}
      <section className="max-w-container-max mx-auto px-gutter py-2xl space-y-lg">
        <div className="flex justify-between items-end mb-xl">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-background">Featured APIs</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Top-tier endpoints trusted by millions.</p>
          </div>
          <Link to="/apis" className="hidden md:flex items-center gap-1 font-body-md text-body-md font-semibold text-primary hover:text-primary-container transition-colors group">
            View all <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {loading ? (
            // Skeleton Loader
            [1, 2, 3].map((n) => (
              <div key={n} className="glass-panel rounded-xl p-lg flex flex-col space-y-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-surface-container rounded-lg"></div>
                  <div className="w-20 h-6 bg-surface-container rounded-full"></div>
                </div>
                <div className="h-6 bg-surface-container w-2/3 rounded"></div>
                <div className="h-12 bg-surface-container w-full rounded"></div>
                <div className="pt-4 border-t border-outline-variant/30 flex justify-between">
                  <div className="h-4 bg-surface-container w-1/4 rounded"></div>
                  <div className="h-4 bg-surface-container w-1/3 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            featuredApis.map((api) => (
              <div key={api.id} className="glass-panel rounded-xl p-lg flex flex-col hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center overflow-hidden">
                    {api.logo ? (
                      <img src={api.logo} alt={api.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {api.category === 'Payment' ? 'payments' : api.category === 'Artificial Intelligence' ? 'psychology' : 'api'}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 font-label-caps text-label-caps">
                    {api.uptime} UPTIME
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">{api.name}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 flex-grow">{api.description}</p>
                <div className="flex items-center justify-between border-t border-outline-variant/50 pt-4">
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-body-sm text-body-sm font-semibold">{api.rating}</span>
                  </div>
                  <Link to={`/apis/${api.id}`} className="text-primary font-body-sm text-body-sm font-semibold hover:text-primary-container">
                    View Docs
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Categories & Stats */}
      <section className="bg-surface-container-low py-3xl border-y border-outline-variant/30 mt-2xl" id="docs">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-2xl">
          {/* Popular Categories */}
          <div className="space-y-lg">
            <h2 className="font-headline-md text-headline-md text-on-background">Popular Categories</h2>
            <div className="grid grid-cols-2 gap-md">
              <Link to="/apis?category=Data" className="glass-panel p-md rounded-xl flex items-center gap-md hover:border-primary hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-primary">data_object</span>
                </div>
                <span className="font-body-md text-body-md font-semibold text-on-background">Data & Storage</span>
              </Link>
              <Link to="/apis?category=Security" className="glass-panel p-md rounded-xl flex items-center gap-md hover:border-primary hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-primary">security</span>
                </div>
                <span className="font-body-md text-body-md font-semibold text-on-background">Security & Auth</span>
              </Link>
              <Link to="/apis?category=Mapping" className="glass-panel p-md rounded-xl flex items-center gap-md hover:border-primary hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-primary">public</span>
                </div>
                <span className="font-body-md text-body-md font-semibold text-on-background">Mapping & Location</span>
              </Link>
              <Link to="/apis?category=Infrastructure" className="glass-panel p-md rounded-xl flex items-center gap-md hover:border-primary hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-primary">cloud</span>
                </div>
                <span className="font-body-md text-body-md font-semibold text-on-background">Cloud Infrastructure</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-lg flex flex-col justify-center">
            <h2 className="font-headline-md text-headline-md text-on-background">By the Numbers</h2>
            <div className="grid grid-cols-2 gap-lg">
              <div className="border-l-2 border-primary pl-md">
                <div className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-bold">50K+</div>
                <div className="font-body-md text-body-md text-on-surface-variant">APIs Indexed</div>
              </div>
              <div className="border-l-2 border-primary pl-md">
                <div className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-bold">2M+</div>
                <div className="font-body-md text-body-md text-on-surface-variant">Active Developers</div>
              </div>
              <div className="border-l-2 border-primary pl-md">
                <div className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-bold">10B+</div>
                <div className="font-body-md text-body-md text-on-surface-variant">Monthly Requests</div>
              </div>
              <div className="border-l-2 border-primary pl-md">
                <div className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-bold">99.9%</div>
                <div className="font-body-md text-body-md text-on-surface-variant">Average Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-container-max mx-auto px-gutter py-3xl text-center" id="pricing">
        <div className="glass-panel rounded-xl p-3xl bg-gradient-to-br from-surface-container-lowest to-surface-container-low border border-outline-variant shadow-sm relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary-container/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-lg max-w-2xl mx-auto">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background text-3xl font-bold">
              Ready to accelerate your development?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Join millions of developers building the future with APIHub. No credit card required.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-md pt-md">
              <Link to="/register" className="px-8 py-4 bg-primary-container text-on-primary rounded-lg font-body-lg text-body-lg font-semibold hover:bg-primary transition-colors shadow-sm">
                Start Building for Free
              </Link>
              <a href="#docs" className="px-8 py-4 bg-surface-container-lowest text-on-background border border-outline-variant rounded-lg font-body-lg text-body-lg font-semibold hover:bg-surface-container-low transition-colors shadow-sm text-center">
                Read the Docs
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
