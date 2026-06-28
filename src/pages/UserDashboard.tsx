import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiHubService } from '../services/api';
import type { ApiItem, ActivityLog } from '../services/mockDb';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [favoriteApis, setFavoriteApis] = useState<ApiItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState<string>('{ "status": "success", "latency": "42ms" }');
  const [terminalLoading, setTerminalLoading] = useState(false);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const favs = await apiHubService.getFavorites();
        const logs = await apiHubService.getActivities();
        setFavoriteApis(favs);
        setActivities(logs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRunCurl = async () => {
    setTerminalLoading(true);
    setTerminalOutput('# Fetching auth token...');
    await new Promise((resolve) => setTimeout(resolve, 800));
    setTerminalOutput(`{\n  "status": "success",\n  "token": "mock-jwt-token-header...",\n  "user": "${user?.name}",\n  "role": "${user?.role}"\n}`);
    setTerminalLoading(false);
  };

  return (
    <div className="space-y-lg">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            {getGreeting()}, {user?.name || 'Jane'}!
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Here's what happened with your APIs in the last 24 hours.
          </p>
        </div>
        <div className="flex gap-sm h-fit">
          <div className="bg-surface border border-outline-variant/30 text-on-surface-variant px-md py-sm rounded-xl font-body-sm flex items-center gap-sm shadow-sm select-none">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            Last 30 Days
          </div>
          <button
            onClick={() => navigate('/apis/manage/new')}
            className="bg-primary text-white px-md py-sm rounded-xl font-body-sm hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 flex items-center gap-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New API
          </button>
        </div>
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Stats Cards */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-lg rounded-xl shadow-sm hover:border-primary/40 transition-colors group cursor-pointer active:scale-[0.98]">
            <div className="flex items-center justify-between mb-sm">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Total Requests</span>
              <div className="p-xs bg-primary-container/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
              </div>
            </div>
            <div className="flex items-end gap-sm">
              <span className="font-headline-sm text-headline-sm">1.2M</span>
              <span className="text-tertiary font-body-sm mb-base flex items-center">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                12%
              </span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-lg rounded-xl shadow-sm hover:border-primary/40 transition-colors group cursor-pointer active:scale-[0.98]">
            <div className="flex items-center justify-between mb-sm">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Avg Latency</span>
              <div className="p-xs bg-primary-container/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">speed</span>
              </div>
            </div>
            <div className="flex items-end gap-sm">
              <span className="font-headline-sm text-headline-sm">42ms</span>
              <span className="text-tertiary font-body-sm mb-base flex items-center">
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                4ms
              </span>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-lg rounded-xl shadow-sm hover:border-primary/40 transition-colors group cursor-pointer active:scale-[0.98]">
            <div className="flex items-center justify-between mb-sm">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Active Keys</span>
              <div className="p-xs bg-primary-container/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">key</span>
              </div>
            </div>
            <div className="flex items-end gap-sm">
              <span className="font-headline-sm text-headline-sm">{user?.apiKeyCount || 18}</span>
              <span className="text-on-surface-variant font-body-sm mb-base">{user?.plan} Workspace</span>
            </div>
          </div>
        </div>

        {/* Usage Summary Chart (Large Card) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 p-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h3 className="font-body-lg font-bold text-on-surface">API Usage Summary</h3>
              <p className="font-body-sm text-on-surface-variant">Total requests over the last 30 days</p>
            </div>
            <div className="flex gap-base items-center">
              <span className="w-3 h-3 bg-primary rounded-full"></span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">Production Traffic</span>
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[220px] flex items-end gap-xs px-sm pb-sm">
            {/* Mock Chart bars */}
            <div className="flex-1 bg-primary/5 hover:bg-primary/20 transition-colors h-[40%] rounded-t-sm relative group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-sm py-xs rounded hidden group-hover:block whitespace-nowrap">12k requests</div>
            </div>
            <div className="flex-1 bg-primary/5 hover:bg-primary/20 transition-colors h-[55%] rounded-t-sm"></div>
            <div className="flex-1 bg-primary/5 hover:bg-primary/20 transition-colors h-[45%] rounded-t-sm"></div>
            <div className="flex-1 bg-primary/5 hover:bg-primary/20 transition-colors h-[65%] rounded-t-sm"></div>
            <div className="flex-1 bg-primary/5 hover:bg-primary/20 transition-colors h-[80%] rounded-t-sm relative group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-sm py-xs rounded hidden group-hover:block whitespace-nowrap">34k requests</div>
            </div>
            <div className="flex-1 bg-primary/10 hover:bg-primary/20 transition-colors h-[75%] rounded-t-sm"></div>
            <div className="flex-1 bg-primary/10 hover:bg-primary/20 transition-colors h-[60%] rounded-t-sm"></div>
            <div className="flex-1 bg-primary/20 hover:bg-primary/30 transition-colors h-[90%] rounded-t-sm border-t-2 border-primary"></div>
            <div className="flex-1 bg-primary/20 hover:bg-primary/30 transition-colors h-[85%] rounded-t-sm border-t-2 border-primary"></div>
            <div className="flex-1 bg-primary/30 hover:bg-primary/40 transition-colors h-[100%] rounded-t-sm border-t-2 border-primary relative group">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-sm py-xs rounded hidden group-hover:block whitespace-nowrap">Today: 52k</div>
            </div>
          </div>
          
          <div className="flex justify-between mt-md pt-md border-t border-outline-variant/10">
            <span className="font-label-caps text-[10px] text-on-surface-variant">May 01</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant">May 15</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant">May 30</span>
          </div>
        </div>

        {/* Favorite APIs Bento Section */}
        <div className="col-span-12">
          <div className="flex items-center justify-between mb-lg mt-md">
            <h3 className="font-headline-sm text-on-surface">Favorite APIs</h3>
            <Link className="text-primary font-body-sm hover:underline" to="/apis">Browse all APIs</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {loading ? (
              [1, 2, 3, 4].map(n => (
                <div key={n} className="bg-surface border border-outline-variant/30 p-lg rounded-xl h-44 animate-pulse"></div>
              ))
            ) : (
              <>
                {favoriteApis.map((api) => (
                  <div
                    key={api.id}
                    onClick={() => navigate(`/apis/${api.id}`)}
                    className="bg-surface border border-outline-variant/30 p-lg rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
                  >
                    <div className="w-12 h-12 mb-lg bg-white p-sm rounded-lg border border-outline-variant/20 shadow-sm flex items-center justify-center overflow-hidden">
                      <img className="w-full h-full object-contain" alt={api.name} src={api.logo} />
                    </div>
                    <h4 className="font-body-lg font-bold text-on-surface mb-xs truncate">{api.name}</h4>
                    <p className="text-body-sm text-on-surface-variant mb-xl line-clamp-2">{api.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className={`px-sm py-xs rounded-full font-label-caps text-[10px] ${
                        api.status === 'Active' ? 'bg-tertiary/10 text-tertiary' :
                        api.status === 'Connected' ? 'bg-primary/10 text-primary' :
                        'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {api.status}
                      </span>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                  </div>
                ))}
                
                {/* Add New API Card */}
                <div
                  onClick={() => navigate('/apis/manage/new')}
                  className="bg-surface-container-low border-2 border-dashed border-outline-variant/40 p-lg rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-surface-variant/30 transition-colors h-full min-h-[180px]"
                >
                  <div className="w-12 h-12 mb-md bg-white/50 text-on-surface-variant flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">add</span>
                  </div>
                  <p className="font-body-md font-bold text-on-surface-variant">Add New API</p>
                  <p className="text-[12px] text-on-surface-variant/70">Connect another service</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-lg border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="font-body-lg font-bold text-on-surface">Recent Activity</h3>
              <button
                onClick={async () => {
                  await apiHubService.clearActivities();
                  setActivities([]);
                }}
                className="text-primary font-label-caps text-[12px] hover:underline"
              >
                Clear all
              </button>
            </div>
            
            <div className="p-0 divide-y divide-outline-variant/5">
              {loading ? (
                [1, 2, 3].map(n => (
                  <div key={n} className="h-16 w-full animate-pulse bg-surface"></div>
                ))
              ) : activities.length === 0 ? (
                <div className="p-xl text-center text-on-surface-variant text-body-sm">
                  No recent activities recorded.
                </div>
              ) : (
                activities.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex items-center gap-md p-md hover:bg-surface-variant/20 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      act.type === 'success' ? 'bg-tertiary-container/10 text-tertiary' :
                      act.type === 'warning' ? 'bg-error-container/10 text-error' :
                      'bg-primary-container/10 text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {act.type === 'success' ? 'check_circle' : act.type === 'warning' ? 'warning' : 'info'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm text-on-surface truncate">{act.action}</p>
                      <p className="text-[12px] text-on-surface-variant">{act.timeAgo}</p>
                    </div>
                    <span className={`font-code text-[12px] ${act.type === 'warning' ? 'text-error' : 'text-on-surface-variant'}`}>
                      {act.statusText}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="p-md bg-surface-container-low text-center border-t border-outline-variant/10">
            <Link to="/history" className="font-body-sm text-primary font-bold hover:underline">
              View Full Audit Log
            </Link>
          </div>
        </div>

        {/* Quick Actions / Terminal */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-surface-container-highest border border-outline-variant/30 p-lg rounded-xl shadow-sm">
            <h3 className="font-body-lg font-bold text-on-surface mb-lg">Quick Actions</h3>
            <div className="flex flex-col gap-sm">
              <button
                onClick={() => navigate('/apis/manage/new')}
                className="w-full bg-primary-container text-white py-sm px-md rounded-xl font-body-sm font-bold flex items-center justify-between hover:bg-primary transition-all active:scale-[0.98]"
              >
                <span className="flex items-center gap-sm">
                  <span className="material-symbols-outlined">add_box</span>
                  Create New API
                </span>
                <kbd className="font-code text-[10px] opacity-70 px-sm py-xs bg-white/20 rounded">⌘N</kbd>
              </button>
              
              <Link to="/settings" className="w-full bg-white border border-outline-variant/30 text-on-surface-variant py-sm px-md rounded-xl font-body-sm hover:border-primary hover:text-primary transition-all flex items-center gap-sm">
                <span className="material-symbols-outlined">settings</span>
                Manage Settings
              </Link>
              
              <a href="#docs" className="w-full bg-white border border-outline-variant/30 text-on-surface-variant py-sm px-md rounded-xl font-body-sm hover:border-primary hover:text-primary transition-all flex items-center gap-sm">
                <span className="material-symbols-outlined">description</span>
                View Docs
              </a>
            </div>
          </div>

          {/* Interactive API Terminal Mini Component */}
          <div className="bg-[#0F172A] p-lg rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between mb-md">
              <div className="flex items-center gap-xs">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                <span className="ml-sm text-[#94A3B8] font-code text-[12px]">test-request.sh</span>
              </div>
              <button
                onClick={handleRunCurl}
                disabled={terminalLoading}
                className="text-[11px] font-bold text-indigo-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 active:scale-95 transition-all"
              >
                {terminalLoading ? 'Running...' : 'Run request'}
              </button>
            </div>
            
            <div className="font-code text-code flex-1 text-slate-300 flex flex-col justify-between font-mono text-[13px]">
              <div>
                <div className="flex gap-sm">
                  <span className="text-[#818CF8]">$</span>
                  <span>curl -X POST https://api.apihub.com/v1/auth</span>
                </div>
                <div className="pl-sm border-l border-slate-700 mt-xs mb-xs">
                  <span className="text-slate-500"># Authenticating with production keys...</span>
                </div>
              </div>
              
              <div className="bg-slate-900/50 p-sm rounded text-[#34D399] whitespace-pre overflow-x-auto text-[11px] max-h-24">
                {terminalOutput}
              </div>
            </div>
            
            <div className="mt-lg pt-sm border-t border-slate-800 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-code">Geist Mono v1.0</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('curl -X POST https://api.apihub.com/v1/auth');
                  alert('Command copied to clipboard!');
                }}
                className="text-white hover:text-primary transition-colors focus:outline-none"
                title="Copy Curl Command"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
