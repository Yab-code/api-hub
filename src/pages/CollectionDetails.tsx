import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const MOCK_COLLECTIONS: Record<string, {
  name: string; description: string; apis: Array<{ id: string; name: string; icon: string; category: string; uptime: string; }>;
}> = {
  '1': { name: 'Payment APIs', description: 'All payment processing and financial service integrations', apis: [
    { id: 'p1', name: 'Stripe Connect', icon: 'credit_card', category: 'Payment', uptime: '99.98%' },
    { id: 'p2', name: 'PayPal Gateway', icon: 'payments', category: 'Payment', uptime: '99.95%' },
    { id: 'p3', name: 'Crypto Exchange', icon: 'currency_bitcoin', category: 'Finance', uptime: '98.5%' },
  ]},
  '2': { name: 'AI & ML Services', description: 'Machine learning inference and natural language processing', apis: [
    { id: 'ai1', name: 'OpenAI GPT-4', icon: 'auto_awesome', category: 'AI', uptime: '99.9%' },
    { id: 'ai2', name: 'Hugging Face', icon: 'sentiment_satisfied', category: 'ML', uptime: '99.7%' },
  ]},
  '3': { name: 'Data & Analytics', description: 'Data pipeline, warehousing, and analytics platforms', apis: [
    { id: 'd1', name: 'BigQuery API', icon: 'analytics', category: 'Data', uptime: '99.99%' },
    { id: 'd2', name: 'Segment Events', icon: 'data_exploration', category: 'Analytics', uptime: '99.9%' },
  ]},
  '4': { name: 'Communication', description: 'Email, SMS, push notifications, and messaging services', apis: [
    { id: 'c1', name: 'SendGrid Email', icon: 'email', category: 'Email', uptime: '99.95%' },
    { id: 'c2', name: 'Twilio SMS', icon: 'sms', category: 'SMS', uptime: '99.9%' },
    { id: 'c3', name: 'Firebase Push', icon: 'notifications_active', category: 'Push', uptime: '99.99%' },
  ]},
};

const CollectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const col = id ? MOCK_COLLECTIONS[id] : null;

  if (!col) {
    return (
      <div className="flex flex-col items-center justify-center py-3xl text-center">
        <span className="material-symbols-outlined text-[48px] text-outline mb-md">folder_off</span>
        <h2 className="font-headline-sm text-on-surface mb-sm">Collection not found</h2>
        <Link to="/collections" className="text-primary font-bold hover:underline">Back to Collections</Link>
      </div>
    );
  }

  return (
    <div className="space-y-xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-sm text-body-sm text-on-surface-variant">
        <Link to="/collections" className="hover:text-primary transition-colors">Collections</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface">{col.name}</span>
      </nav>

      {/* Header */}
      <div className="glass-panel rounded-2xl p-xl flex flex-col md:flex-row md:items-center justify-between gap-lg">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">{col.name}</h1>
          <p className="text-on-surface-variant font-body-md mt-xs">{col.description}</p>
          <div className="flex gap-md mt-md text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">api</span>
              {col.apis.length} APIs
            </span>
          </div>
        </div>
        <div className="flex gap-sm">
          <button className="flex items-center gap-sm px-md py-sm border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container transition-all text-body-sm">
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share
          </button>
          <button className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary rounded-xl font-bold active:scale-95 transition-all text-body-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add API
          </button>
        </div>
      </div>

      {/* APIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {col.apis.map(api => (
          <div
            key={api.id}
            onClick={() => navigate(`/explore`)}
            className="glass-panel rounded-xl p-lg hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-md">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">{api.icon}</span>
              </div>
              <span className="px-sm py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-bold">
                {api.uptime}
              </span>
            </div>
            <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors mb-xs">{api.name}</h3>
            <span className="text-[11px] font-label-caps text-primary bg-primary/5 rounded-full px-sm py-0.5">{api.category}</span>
            <div className="flex items-center justify-end mt-md">
              <span className="text-primary text-body-sm font-bold flex items-center gap-xs group-hover:translate-x-1 transition-transform">
                View Details
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}

        {/* Add placeholder */}
        <button className="border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center gap-sm text-on-surface-variant hover:border-primary hover:text-primary transition-all min-h-[160px] group">
          <span className="material-symbols-outlined text-[36px] opacity-40 group-hover:opacity-100 transition-opacity">add</span>
          <span className="font-body-sm font-bold">Add to Collection</span>
        </button>
      </div>
    </div>
  );
};

export default CollectionDetails;
