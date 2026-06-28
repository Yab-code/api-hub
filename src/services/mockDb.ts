// Mock Database for APIHub Frontend

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'admin';
  avatar: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  apiKeyCount: number;
}

export interface ApiItem {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  uptime: string;
  rating: number;
  status: 'Active' | 'Connected' | 'Testing' | 'Disconnected';
  docsUrl: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  apiCount: number;
}

export interface ActivityLog {
  id: string;
  type: 'success' | 'warning' | 'info';
  action: string;
  timeAgo: string;
  statusText: string;
}

// Initial Mock Data
const INITIAL_USER: User = {
  id: 'usr_1',
  name: 'Jane Developer',
  email: 'developer@company.com',
  role: 'developer',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gok_o0DtLEC3m0jbNL_quGIbn6A-HacR4g9oxWeILFiwglfhBUr4vNTbxkIBdI0NpDARa3PU3xJmKKr4Al6rm_3jkKqpmEhgbOkb1N3x00s6DKL2X5DhSTUD6gkWzbL8aVS8eLGgUGJufK6kjV1aXlfuXCkSlTxEYSvEz8TvJ_8kpkv4Zl8E6lq2Vwvo2fKpRcl9-bVs78_JtqjKubxECUmy06wizaq_kdDZY8UCpnp1NECGq3o1-I3phOYxRCPbEmneSiNetsL5',
  plan: 'Free',
  apiKeyCount: 18,
};

const INITIAL_APIS: ApiItem[] = [
  {
    id: 'api_1',
    name: 'Stripe Payments',
    category: 'Payment',
    description: 'Complete toolkit for internet business. Process payments, manage subscriptions, and send payouts globally.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClVM208dEIfJloH_F38EF3TkGfJJVyv-7fEVQ-NyxXZQpU_5uYE2p-2A1ujNE13GVpnbgPZsmm3uEpqsXYw7SvL19fFp94kGZHtzqflSJ44nRzaPAKXy7N0Dg9rkiUM0sOp5I-_guIKEcyf4BVZjdmbzDEaAYNZFDEzPdCubzolhBiGGri31FjYIo8vTJ_4Hg5-W1KkW1S-HvmSHKG5ciNPj2dUfiPVZEb3ZtokPrOIdauTvdoOdmF5CL-_ueJ0e4jlMFnhgz46cKA',
    uptime: '99.9%',
    rating: 4.9,
    status: 'Active',
    docsUrl: '#docs',
  },
  {
    id: 'api_2',
    name: 'OpenAI GPT-4',
    category: 'Artificial Intelligence',
    description: 'Integrate advanced AI models for natural language processing, image generation, and complex reasoning tasks.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTPEm_Xz7qxzkpyN09tRlkpqIckrxnA99aneruIqs78iKtj_DS2gYkTu7XHH3WB15dxfx3TMxvIiq0nsI8PpZkIe_ZBqNgpiq7Aucx8yFibTsaCvf6hEmZekSJkdsEqnWJG6OWpO372dBiE5us-9I-Bbng2d5SePczT9Zs95cUSUfxA45EqaOHOnF5zBnR8BY5hgQU1TXvUYENraIsxlQbEkfFD_GgJyVu2n947kqyV7vRTs1hl02lFnPBgjzx-Mcafsh58Ey4VffX',
    uptime: '99.8%',
    rating: 4.8,
    status: 'Connected',
    docsUrl: '#docs',
  },
  {
    id: 'api_3',
    name: 'Algolia Search',
    category: 'Data',
    description: 'Instant search results and discovery for web apps. Build rich, autocomplete search interfaces.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwvniJ55BVn_bJcRzChDpKPNtb84-AXc5E-knnyPmnyEHzZJXmJycQocqd0AitfHRVoXgdN0WBkgJ5r8Udb6Q9elyrKqjSniTe8jqxn-4TDK0rLH9MN4J525mhCFnHjMWgz2Qvaxo8I92uX9YiUN_W-NKk5LoUpfi5MgLFxhv9OD1LXIRz32ov-jcqlO0UVOkyT0DJPzbvrLWbx0F6x-mkeEAbPAhjsRzBJDr3xnINSYP-3gm5F7F4VOQK6Tp_edqixJtpmGBMlCV-',
    uptime: '99.95%',
    rating: 4.7,
    status: 'Testing',
    docsUrl: '#docs',
  },
  {
    id: 'api_4',
    name: 'Twilio SMS',
    category: 'Messaging',
    description: 'Customer engagement platform. Build SMS, Voice, and Video applications with robust global infrastructure.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxDiITk2atpJSVRDJnPctVfg6p7Arz6FQVkt5B046cA-uhGtIBeAgtG9cAnGGtWkQHmO60JRWxsFhf3379LO7Ka0Nh4QFP0IA_e8npFUz-UlpHQY_BWQeusI-yePqwHa9F0DT0x5JGHUAh7TB-c3KUzMiiXSzuQ9HzoccfTDNEkfHCHddgLOQPq2D1Zc9DtP51Bq2UB9SAvqUcBzvK-Tw-0BiF6887JOVBMEsTAFIN_M50il6P9kzN1_nqUM2yatTdNfDNci1nJNe4',
    uptime: '99.7%',
    rating: 4.7,
    status: 'Disconnected',
    docsUrl: '#docs',
  }
];

const INITIAL_COLLECTIONS: Collection[] = [
  { id: 'col_1', name: 'Fintech Solutions', description: 'APIs for handling banking, wallets, and card payments.', apiCount: 5 },
  { id: 'col_2', name: 'AI & Machine Learning', description: 'Core LLMs, embeddings, and machine learning utilities.', apiCount: 3 },
  { id: 'col_3', name: 'Identity & Security', description: 'OAuth systems, biometrics validation, and API authentication.', apiCount: 4 },
];

const INITIAL_ACTIVITIES: ActivityLog[] = [
  { id: 'act_1', type: 'success', action: 'Successful request to Stripe /v1/charges', timeAgo: '2 minutes ago', statusText: '200 OK' },
  { id: 'act_2', type: 'info', action: 'New API Key "Dev-Environment-1" created', timeAgo: '15 minutes ago', statusText: 'CREATED' },
  { id: 'act_3', type: 'warning', action: 'Failed request to OpenAI /v1/chat', timeAgo: '42 minutes ago', statusText: '429 ERROR' },
  { id: 'act_4', type: 'success', action: 'Successfully synced Algolia Indices', timeAgo: '1 hour ago', statusText: 'SYNCED' },
];

// LocalStorage helpers to simulate database persistence
const getStored = <T>(key: string, defaults: T): T => {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : defaults;
};

const setStored = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockDb = {
  // Users Database
  getUsers: () => getStored<User[]>('apihub_users', [
    INITIAL_USER,
    {
      id: 'usr_2',
      name: 'System Admin',
      email: 'admin@apihub.com',
      role: 'admin',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gok_o0DtLEC3m0jbNL_quGIbn6A-HacR4g9oxWeILFiwglfhBUr4vNTbxkIBdI0NpDARa3PU3xJmKKr4Al6rm_3jkKqpmEhgbOkb1N3x00s6DKL2X5DhSTUD6gkWzbL8aVS8eLGgUGJufK6kjV1aXlfuXCkSlTxEYSvEz8TvJ_8kpkv4Zl8E6lq2Vwvo2fKpRcl9-bVs78_JtqjKubxECUmy06wizaq_kdDZY8UCpnp1NECGq3o1-I3phOYxRCPbEmneSiNetsL5',
      plan: 'Enterprise',
      apiKeyCount: 42,
    }
  ]),
  
  saveUser: (user: User) => {
    const users = mockDb.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    setStored('apihub_users', users);
  },

  // APIs Database
  getApis: () => getStored<ApiItem[]>('apihub_apis', INITIAL_APIS),
  saveApi: (api: ApiItem) => {
    const apis = mockDb.getApis();
    const idx = apis.findIndex(a => a.id === api.id);
    if (idx !== -1) {
      apis[idx] = api;
    } else {
      apis.push(api);
    }
    setStored('apihub_apis', apis);
  },
  deleteApi: (id: string) => {
    const apis = mockDb.getApis().filter(a => a.id !== id);
    setStored('apihub_apis', apis);
  },

  // Collections Database
  getCollections: () => getStored<Collection[]>('apihub_collections', INITIAL_COLLECTIONS),
  saveCollection: (col: Collection) => {
    const cols = mockDb.getCollections();
    const idx = cols.findIndex(c => c.id === col.id);
    if (idx !== -1) {
      cols[idx] = col;
    } else {
      cols.push(col);
    }
    setStored('apihub_collections', cols);
  },

  // Favorites
  getFavorites: () => getStored<string[]>('apihub_favorites', ['api_1', 'api_2', 'api_3']),
  toggleFavorite: (apiId: string) => {
    const favs = mockDb.getFavorites();
    const idx = favs.indexOf(apiId);
    if (idx !== -1) {
      favs.splice(idx, 1);
    } else {
      favs.push(apiId);
    }
    setStored('apihub_favorites', favs);
  },

  // Activities
  getActivities: () => getStored<ActivityLog[]>('apihub_activities', INITIAL_ACTIVITIES),
  addActivity: (action: string, type: 'success' | 'warning' | 'info' = 'success', statusText = '200 OK') => {
    const logs = mockDb.getActivities();
    logs.unshift({
      id: `act_${Date.now()}`,
      type,
      action,
      timeAgo: 'Just now',
      statusText
    });
    setStored('apihub_activities', logs.slice(0, 20)); // Limit to 20 logs
  },
  clearActivities: () => {
    setStored('apihub_activities', []);
  }
};
