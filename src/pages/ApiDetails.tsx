import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiHubService } from '../services/api';
import type { ApiItem } from '../services/mockDb';

const TABS = ['Overview', 'Endpoints', 'Code Samples', 'Reviews'];

const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group rounded-xl overflow-hidden bg-[#0f172a]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/70 border-b border-slate-700/50">
        <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">{code}</pre>
    </div>
  );
};

const ApiDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [api, setApi] = useState<ApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const list = await apiHubService.getApis();
        const found = list.find(a => a.id === id);
        if (found) {
          setApi(found);
          const favs = await apiHubService.getFavorites();
          setIsFavorite(favs.some(f => f.id === id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!api) return;
    const result = await apiHubService.toggleFavorite(api.id);
    setIsFavorite(result);
  };

  if (loading) {
    return (
      <div className="space-y-lg animate-pulse">
        <div className="h-32 glass-panel rounded-2xl" />
        <div className="h-64 glass-panel rounded-2xl" />
      </div>
    );
  }

  if (!api) {
    return (
      <div className="flex flex-col items-center justify-center py-3xl text-center">
        <span className="material-symbols-outlined text-[48px] text-outline mb-md">api_off</span>
        <h2 className="font-headline-sm text-on-surface mb-sm">API not found</h2>
        <Link to="/explore" className="text-primary font-bold hover:underline">Browse APIs</Link>
      </div>
    );
  }

  const curlSample = `curl -X GET "https://api.hub.com/v1/${api.id}/data" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;

  const jsSample = `const response = await fetch('https://api.hub.com/v1/${api.id}/data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);`;

  const pythonSample = `import requests

url = "https://api.hub.com/v1/${api.id}/data"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
print(response.json())`;

  return (
    <div className="space-y-xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-sm text-body-sm text-on-surface-variant">
        <Link to="/explore" className="hover:text-primary transition-colors">Explorer</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface">{api.name}</span>
      </nav>

      {/* API Header */}
      <div className="glass-panel rounded-2xl p-xl flex flex-col md:flex-row md:items-start justify-between gap-lg">
        <div className="flex items-start gap-lg">
          <div className="w-16 h-16 rounded-2xl border border-outline-variant bg-white flex items-center justify-center p-2 shadow-sm flex-shrink-0">
            <img className="w-full h-full object-contain" alt={api.name} src={api.logo} />
          </div>
          <div>
            <div className="flex items-center gap-sm flex-wrap">
              <h1 className="font-headline-md text-headline-md text-on-surface">{api.name}</h1>
              <span className="bg-tertiary-container/10 text-tertiary px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">Verified</span>
            </div>
            <p className="text-on-surface-variant mt-1 max-w-2xl font-body-md">{api.description}</p>
            <div className="flex flex-wrap gap-md mt-3">
              <div className="flex items-center gap-1 text-yellow-500">
                {[1,2,3,4].map(i => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                <span className="text-on-surface font-bold ml-1">{api.rating}</span>
              </div>
              <span className="text-outline">•</span>
              <span className="text-on-surface-variant font-body-sm">{api.uptime} uptime</span>
              <span className="text-outline">•</span>
              <span className="text-primary font-body-sm font-bold">{api.category}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-sm flex-shrink-0">
          <button onClick={handleToggleFavorite} className="p-3 border border-outline-variant rounded-xl hover:bg-surface-container transition-colors">
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
                color: isFavorite ? '#eab308' : undefined
              }}
            >star</span>
          </button>
          <button
            onClick={() => navigate(`/tester?api=${api.id}`)}
            className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-xl font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">play_circle</span>
            Test API
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm border-b border-outline-variant/30 overflow-x-auto pb-px">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-md py-md border-b-2 font-bold transition-all whitespace-nowrap focus:outline-none ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          <div className="lg:col-span-2 space-y-lg">
            <div className="glass-panel rounded-xl p-lg">
              <h2 className="font-headline-sm text-on-surface mb-md">About this API</h2>
              <p className="text-on-surface-variant font-body-md leading-relaxed">{api.description}</p>
              <p className="text-on-surface-variant font-body-md leading-relaxed mt-3">
                This API provides enterprise-grade reliability with automatic failover, global CDN distribution, and detailed usage analytics. Supports REST and GraphQL endpoints with webhook delivery.
              </p>
            </div>
            <div className="glass-panel rounded-xl p-lg">
              <h2 className="font-headline-sm text-on-surface mb-md">Key Features</h2>
              <ul className="space-y-sm">
                {['RESTful API with JSON responses', 'OAuth 2.0 & API Key Authentication', '99.99% uptime SLA', 'Rate limiting: 1000 req/min (free tier)', 'Webhook & real-time event support', 'Global CDN with <100ms response time'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-sm text-on-surface-variant font-body-sm">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-lg">
            <div className="glass-panel rounded-xl p-lg">
              <h3 className="font-headline-sm text-on-surface mb-md text-[16px]">Quick Stats</h3>
              <div className="space-y-md">
                {[
                  { label: 'Uptime', value: api.uptime, icon: 'verified_user' },
                  { label: 'Rating', value: api.rating, icon: 'star' },
                  { label: 'Category', value: api.category, icon: 'category' },
                  { label: 'Version', value: 'v2.4.0', icon: 'new_releases' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">{stat.icon}</span>
                      <span className="font-body-sm">{stat.label}</span>
                    </div>
                    <span className="font-bold text-on-surface text-body-sm">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-lg bg-primary/5 border-primary/20">
              <h3 className="font-bold text-on-surface mb-xs">Subscribe to this API</h3>
              <p className="text-on-surface-variant text-body-sm mb-md">Get your API key and start building in minutes.</p>
              <button className="w-full bg-primary text-on-primary py-sm rounded-lg font-bold hover:brightness-105 active:scale-95 transition-all">
                Subscribe — Free Tier
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Endpoints' && (
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-lg border-b border-outline-variant/30">
            <h2 className="font-headline-sm text-on-surface">Available Endpoints</h2>
          </div>
          <div className="divide-y divide-outline-variant/20">
            {[
              { method: 'GET', path: '/v1/data', desc: 'Retrieve data records', status: '200 OK' },
              { method: 'POST', path: '/v1/data', desc: 'Create new data record', status: '201 Created' },
              { method: 'PUT', path: '/v1/data/:id', desc: 'Update existing record', status: '200 OK' },
              { method: 'DELETE', path: '/v1/data/:id', desc: 'Delete a record', status: '204 No Content' },
              { method: 'GET', path: '/v1/health', desc: 'Service health check', status: '200 OK' },
            ].map((ep, i) => (
              <div key={i} className="p-lg flex flex-col sm:flex-row sm:items-center gap-sm hover:bg-surface-container/30 transition-colors">
                <span className={`px-sm py-0.5 rounded text-[11px] font-bold w-fit ${
                  ep.method === 'GET' ? 'bg-blue-500/10 text-blue-600' :
                  ep.method === 'POST' ? 'bg-green-500/10 text-green-600' :
                  ep.method === 'PUT' ? 'bg-yellow-500/10 text-yellow-600' :
                  'bg-red-500/10 text-red-600'
                }`}>{ep.method}</span>
                <code className="font-mono text-body-sm text-on-surface flex-1">{ep.path}</code>
                <span className="text-on-surface-variant text-body-sm">{ep.desc}</span>
                <span className="text-tertiary text-[12px] font-bold">{ep.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Code Samples' && (
        <div className="space-y-lg">
          <CodeBlock code={curlSample} language="cURL" />
          <CodeBlock code={jsSample} language="JavaScript" />
          <CodeBlock code={pythonSample} language="Python" />
        </div>
      )}

      {activeTab === 'Reviews' && (
        <div className="space-y-lg">
          <div className="glass-panel rounded-xl p-xl text-center">
            <div className="text-[64px] font-bold text-on-surface">{api.rating}</div>
            <div className="flex justify-center gap-xs text-yellow-500 my-sm">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${i <= Math.floor(Number(api.rating)) ? 1 : 0}` }}>star</span>
              ))}
            </div>
            <p className="text-on-surface-variant font-body-sm">Based on developer reviews</p>
          </div>
          <div className="space-y-md">
            {[
              { name: 'Alex R.', stars: 5, comment: 'Excellent API! Documentation is clear and the response times are blazing fast.', date: '2 days ago' },
              { name: 'Sarah M.', stars: 4, comment: 'Great integration experience. Minor issues with rate limiting documentation.', date: '1 week ago' },
              { name: 'James K.', stars: 5, comment: 'Best-in-class API for this category. Used it in production with zero issues.', date: '2 weeks ago' },
            ].map((review, i) => (
              <div key={i} className="glass-panel rounded-xl p-lg">
                <div className="flex items-center justify-between mb-sm">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <span className="font-bold text-on-surface">{review.name}</span>
                  </div>
                  <span className="text-on-surface-variant text-body-sm">{review.date}</span>
                </div>
                <div className="flex gap-xs text-yellow-500 mb-sm">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: `'FILL' ${i <= review.stars ? 1 : 0}` }}>star</span>
                  ))}
                </div>
                <p className="text-on-surface-variant font-body-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDetails;
