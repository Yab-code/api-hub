import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type RequestTab = 'Headers' | 'Parameters' | 'Body' | 'Auth';
type ResponseView = 'Pretty' | 'Raw';
type SnippetLang = 'cURL' | 'JavaScript' | 'Python' | 'Go';

interface Header { key: string; value: string; enabled: boolean; }
interface ResponseData {
  status: number;
  statusText: string;
  time: number;
  size: string;
  body: string;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-blue-500',
  POST: 'text-green-500',
  PUT: 'text-yellow-500',
  DELETE: 'text-red-500',
  PATCH: 'text-purple-500',
};

const MOCK_RESPONSE: ResponseData = {
  status: 200,
  statusText: 'OK',
  time: 142,
  size: '2.4 KB',
  body: JSON.stringify({
    status: 'success',
    data: {
      user: {
        id: 'usr_9x21',
        username: 'dev_nexus',
        email: 'nexus@apihub.com',
        plan: 'enterprise',
        active: true,
      },
      last_login: '2023-11-20T14:32:01Z',
      api_calls_count: 142055,
    },
    request_id: 'req_f82j190x',
  }, null, 2),
};

const getSnippet = (method: HttpMethod, endpoint: string, lang: SnippetLang): string => {
  const url = `https://api.hub.com/v1/${endpoint}`;
  if (lang === 'cURL') return `curl -X ${method} "${url}" \\\n  -H "Authorization: Bearer YOUR_KEY" \\\n  -H "Content-Type: application/json"`;
  if (lang === 'JavaScript') return `const res = await fetch('${url}', {\n  method: '${method}',\n  headers: { 'Authorization': 'Bearer YOUR_KEY' }\n});\nconsole.log(await res.json());`;
  if (lang === 'Python') return `import requests\nres = requests.${method.toLowerCase()}('${url}',\n  headers={'Authorization': 'Bearer YOUR_KEY'})\nprint(res.json())`;
  return `resp, _ := http.Get("${url}")\ndefer resp.Body.Close()`;
};

const ApiTester: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [method, setMethod] = useState<HttpMethod>('GET');
  const [endpoint, setEndpoint] = useState(searchParams.get('api') ? `${searchParams.get('api')}/data` : 'users/profile');
  const [requestTab, setRequestTab] = useState<RequestTab>('Headers');
  const [responseView, setResponseView] = useState<ResponseView>('Pretty');
  const [snippetLang, setSnippetLang] = useState<SnippetLang>('cURL');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Authorization', value: 'Bearer YOUR_API_KEY', enabled: true },
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: 'X-Request-ID', value: 'req-001', enabled: false },
  ]);
  const [bodyText, setBodyText] = useState(JSON.stringify({ user_id: 129485, options: { detailed: true } }, null, 2));
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
    setResponse({ ...MOCK_RESPONSE, time: Math.round(100 + Math.random() * 200) });
    setLoading(false);
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(getSnippet(method, endpoint, snippetLang));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!response) return;
    const blob = new Blob([response.body], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'response.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">API Tester</h1>
          <p className="text-on-surface-variant font-body-md">Debug and test your endpoints with real-time response data.</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="flex bg-surface-container rounded-lg p-1">
            {(['Main Branch', 'Dev Branch'] as const).map(branch => (
              <button key={branch} className="px-md py-1 rounded-md text-on-surface-variant font-body-sm hover:text-on-surface transition-colors first:bg-white first:shadow-sm first:text-on-surface">
                {branch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Testing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg min-h-[700px]">
        {/* Request Panel */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-md border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">send</span>
              <h2 className="font-headline-sm text-[18px]">Request</h2>
            </div>
            <span className="text-[12px] font-label-caps text-on-surface-variant uppercase">v2.4.0</span>
          </div>

          <div className="flex-1 flex flex-col p-lg gap-lg">
            {/* URL Bar */}
            <div className="flex gap-sm">
              <select
                value={method}
                onChange={e => setMethod(e.target.value as HttpMethod)}
                className={`appearance-none bg-surface-container-low border border-outline-variant rounded-lg px-md py-3 font-body-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer ${METHOD_COLORS[method]}`}
              >
                {(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as HttpMethod[]).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <div className="flex-1 flex items-center bg-surface-container-low border border-outline-variant rounded-lg px-md overflow-hidden">
                <span className="text-on-surface-variant font-mono text-body-sm whitespace-nowrap mr-xs">https://api.hub.com/v1/</span>
                <input
                  value={endpoint}
                  onChange={e => setEndpoint(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 font-mono text-body-sm text-on-surface py-3 outline-none"
                  placeholder="endpoint"
                />
              </div>

              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-primary text-on-primary px-xl py-3 rounded-lg font-body-md font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-sm disabled:opacity-70"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <>
                    <span>Send</span>
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                  </>
                )}
              </button>
            </div>

            {/* Request Tabs */}
            <div className="flex-1 flex flex-col">
              <div className="flex border-b border-outline-variant/20 gap-lg mb-md">
                {(['Headers', 'Parameters', 'Body', 'Auth'] as RequestTab[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setRequestTab(tab)}
                    className={`py-2 font-body-sm transition-colors focus:outline-none ${requestTab === tab ? 'font-bold text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    {tab}{tab === 'Headers' ? ` (${headers.filter(h => h.enabled).length})` : ''}
                  </button>
                ))}
              </div>

              {requestTab === 'Headers' && (
                <div className="flex-1 space-y-sm overflow-y-auto">
                  {headers.map((h, i) => (
                    <div key={i} className="flex items-center gap-sm">
                      <input
                        type="checkbox"
                        checked={h.enabled}
                        onChange={e => setHeaders(prev => prev.map((x, j) => j === i ? { ...x, enabled: e.target.checked } : x))}
                        className="rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <input
                        value={h.key}
                        onChange={e => setHeaders(prev => prev.map((x, j) => j === i ? { ...x, key: e.target.value } : x))}
                        placeholder="Key"
                        className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-lg px-sm py-1.5 text-body-sm focus:ring-2 focus:ring-primary outline-none font-mono"
                      />
                      <input
                        value={h.value}
                        onChange={e => setHeaders(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                        placeholder="Value"
                        className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-lg px-sm py-1.5 text-body-sm focus:ring-2 focus:ring-primary outline-none font-mono"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setHeaders(prev => [...prev, { key: '', value: '', enabled: true }])}
                    className="text-primary text-body-sm font-bold hover:underline flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span> Add Header
                  </button>
                </div>
              )}

              {requestTab === 'Body' && (
                <div className="flex-1 relative">
                  <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#0f172a]">
                    <textarea
                      value={bodyText}
                      onChange={e => setBodyText(e.target.value)}
                      className="w-full h-full bg-transparent text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none"
                      spellCheck={false}
                    />
                  </div>
                </div>
              )}

              {(requestTab === 'Parameters' || requestTab === 'Auth') && (
                <div className="flex items-center justify-center flex-1 text-on-surface-variant text-body-sm">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[32px] mb-sm block">{requestTab === 'Auth' ? 'lock' : 'tune'}</span>
                    No {requestTab.toLowerCase()} configured
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Response Panel */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-md border-b border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-tertiary">analytics</span>
              <h2 className="font-headline-sm text-[18px]">Response</h2>
            </div>
            {response && (
              <div className="flex items-center gap-md">
                <div className="flex items-center gap-xs">
                  <div className={`w-2 h-2 rounded-full ${response.status < 300 ? 'bg-green-500' : response.status < 500 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <span className={`text-[12px] font-bold ${response.status < 300 ? 'text-green-600' : 'text-red-600'}`}>
                    {response.status} {response.statusText}
                  </span>
                </div>
                <span className="text-[12px] text-on-surface-variant border-l border-outline-variant/30 pl-md">{response.time}ms</span>
                <span className="text-[12px] text-on-surface-variant border-l border-outline-variant/30 pl-md">{response.size}</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col p-lg gap-lg">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-primary animate-spin text-[48px]">progress_activity</span>
                  <p className="text-on-surface-variant mt-md font-body-sm">Sending request...</p>
                </div>
              </div>
            ) : response ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex gap-md">
                    {(['Pretty', 'Raw'] as ResponseView[]).map(v => (
                      <button
                        key={v}
                        onClick={() => setResponseView(v)}
                        className={`px-md py-1.5 rounded-lg font-body-sm transition-colors ${responseView === v ? 'bg-surface-container font-bold text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleExport} className="text-primary font-body-sm font-bold flex items-center gap-xs hover:underline">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Export
                  </button>
                </div>
                <div className="flex-1 rounded-xl overflow-hidden bg-[#0f172a] p-4">
                  <pre className="text-sm text-slate-300 font-mono overflow-auto h-full leading-relaxed">{response.body}</pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] mb-md block opacity-30">api</span>
                  <p className="font-body-md">Hit <strong className="text-primary">Send</strong> to see the response</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Quick Snippets & Collaboration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="bg-surface-container-high p-lg rounded-xl flex flex-col">
          <div>
            <h3 className="font-headline-sm text-[16px] text-on-surface mb-sm">Quick Snippets</h3>
            <p className="text-on-surface-variant text-body-sm mb-md">Copy formatted code blocks for your integration.</p>
          </div>
          <div className="flex flex-wrap gap-sm mb-md">
            {(['cURL', 'JavaScript', 'Python', 'Go'] as SnippetLang[]).map(lang => (
              <button
                key={lang}
                onClick={() => setSnippetLang(lang)}
                className={`px-sm py-1 rounded text-[12px] font-bold border transition-colors ${snippetLang === lang ? 'bg-primary text-on-primary border-primary' : 'bg-white border-outline-variant text-on-surface hover:border-primary'}`}
              >
                {lang}
              </button>
            ))}
          </div>
          <div className="flex-1 bg-[#0f172a] rounded-xl p-3 relative">
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap overflow-hidden leading-relaxed">{getSnippet(method, endpoint, snippetLang)}</pre>
            <button onClick={handleCopySnippet} className="absolute top-2 right-2 p-1.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-300 transition-colors">
              <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-2 glass-panel border border-outline-variant/20 rounded-xl p-lg flex items-center gap-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex-1">
            <h3 className="font-headline-sm text-[18px] text-primary mb-xs">Real-time collaboration is here</h3>
            <p className="text-on-surface-variant text-body-sm max-w-md">
              Invite team members to view and comment on your API testing sessions in real-time. Share results instantly with a persistent link.
            </p>
            <button className="mt-md text-primary font-bold text-body-sm flex items-center gap-xs group">
              Learn about Teams
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
          <div className="hidden sm:flex w-24 h-24 bg-primary-container/10 rounded-2xl items-center justify-center border border-primary/20 flex-shrink-0">
            <span className="material-symbols-outlined text-[40px] text-primary">groups</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
