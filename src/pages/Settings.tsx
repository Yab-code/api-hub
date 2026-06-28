import React, { useState } from 'react';

const Settings: React.FC = () => {
  
  // Theme state
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [productNotif, setProductNotif] = useState(true);

  // API settings
  const [defaultTimeout, setDefaultTimeout] = useState(30000);
  const [defaultRegion, setDefaultRegion] = useState('us-east-1 (N. Virginia)');

  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'security' | 'api-prefs'>('appearance');

  // Handle Theme Change
  const handleThemeChange = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('apihub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('apihub_theme', 'light');
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'All password fields are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    // Mock successful update
    setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-lg">
      {/* Settings Navigation Sidebar */}
      <nav className="w-full lg:w-64 bg-surface-container-lowest border border-outline-variant p-md rounded-xl h-fit flex flex-col gap-xs shrink-0 shadow-sm">
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-sm px-md py-sm rounded-lg text-left transition-all ${
            activeTab === 'appearance'
              ? 'bg-primary-container/10 text-primary font-bold'
              : 'text-on-surface-variant hover:bg-surface-variant/50'
          }`}
        >
          <span className="material-symbols-outlined">palette</span>
          <span className="font-body-md">Appearance</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-sm px-md py-sm rounded-lg text-left transition-all ${
            activeTab === 'notifications'
              ? 'bg-primary-container/10 text-primary font-bold'
              : 'text-on-surface-variant hover:bg-surface-variant/50'
          }`}
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="font-body-md">Notifications</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-sm px-md py-sm rounded-lg text-left transition-all ${
            activeTab === 'security'
              ? 'bg-primary-container/10 text-primary font-bold'
              : 'text-on-surface-variant hover:bg-surface-variant/50'
          }`}
        >
          <span className="material-symbols-outlined">security</span>
          <span className="font-body-md">Security</span>
        </button>
        <button
          onClick={() => setActiveTab('api-prefs')}
          className={`flex items-center gap-sm px-md py-sm rounded-lg text-left transition-all ${
            activeTab === 'api-prefs'
              ? 'bg-primary-container/10 text-primary font-bold'
              : 'text-on-surface-variant hover:bg-surface-variant/50'
          }`}
        >
          <span className="material-symbols-outlined">api</span>
          <span className="font-body-md">API Preferences</span>
        </button>
      </nav>

      {/* Settings Form Canvas */}
      <div className="flex-1 space-y-lg">
        {/* Appearance Section */}
        {activeTab === 'appearance' && (
          <section className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm space-y-lg">
            <div>
              <h2 className="font-headline-sm text-headline-sm mb-xs">Appearance</h2>
              <p className="text-on-surface-variant text-body-sm">Customize how APIHub looks on your device.</p>
            </div>
            
            <div className="space-y-xl">
              <div>
                <label className="block font-bold text-body-sm mb-md uppercase tracking-wider text-outline">Theme Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md max-w-md">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`flex flex-col gap-sm p-md border-2 rounded-xl text-left transition-all ${
                      themeMode === 'light'
                        ? 'border-primary bg-primary-container/5'
                        : 'border-outline-variant hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-20 bg-white rounded-lg border border-outline-variant shadow-sm flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>light_mode</span>
                    </div>
                    <span className={`font-bold ${themeMode === 'light' ? 'text-primary' : 'text-on-surface-variant'}`}>Light Mode</span>
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex flex-col gap-sm p-md border-2 rounded-xl text-left transition-all ${
                      themeMode === 'dark'
                        ? 'border-primary bg-primary-container/5'
                        : 'border-outline-variant hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-20 bg-slate-900 rounded-lg border border-slate-700 shadow-sm flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>dark_mode</span>
                    </div>
                    <span className={`font-bold ${themeMode === 'dark' ? 'text-primary' : 'text-on-surface-variant'}`}>Dark Mode</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block font-bold text-body-sm mb-md uppercase tracking-wider text-outline">Accent Color</label>
                <div className="flex gap-md">
                  <button className="w-10 h-10 rounded-full bg-[#4f46e5] ring-4 ring-primary-container/20 border-2 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">check</span>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-[#006e4b] hover:scale-115 transition-transform" />
                  <button className="w-10 h-10 rounded-full bg-[#ba1a1a] hover:scale-115 transition-transform" />
                  <button className="w-10 h-10 rounded-full bg-[#213145] hover:scale-115 transition-transform" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Notifications Section */}
        {activeTab === 'notifications' && (
          <section className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm space-y-lg">
            <div>
              <h2 className="font-headline-sm text-headline-sm mb-xs">Notifications</h2>
              <p className="text-on-surface-variant text-body-sm">Manage when and how you receive alerts.</p>
            </div>
            
            <div className="space-y-md">
              <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg">
                <div className="flex gap-md items-center">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <div>
                    <p className="font-bold text-body-sm">Email Notifications</p>
                    <p className="text-xs text-on-surface-variant">Daily summary of API usage and errors</p>
                  </div>
                </div>
                <input
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  type="checkbox"
                />
              </div>
              
              <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg">
                <div className="flex gap-md items-center">
                  <span className="material-symbols-outlined text-primary">vibration</span>
                  <div>
                    <p className="font-bold text-body-sm">Push Notifications</p>
                    <p className="text-xs text-on-surface-variant">Real-time critical uptime alerts</p>
                  </div>
                </div>
                <input
                  checked={pushNotif}
                  onChange={(e) => setPushNotif(e.target.checked)}
                  className="w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  type="checkbox"
                />
              </div>
              
              <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg">
                <div className="flex gap-md items-center">
                  <span className="material-symbols-outlined text-primary">campaign</span>
                  <div>
                    <p className="font-bold text-body-sm">Product Updates</p>
                    <p className="text-xs text-on-surface-variant">News about new features and releases</p>
                  </div>
                </div>
                <input
                  checked={productNotif}
                  onChange={(e) => setProductNotif(e.target.checked)}
                  className="w-5 h-5 text-primary rounded border-outline-variant focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  type="checkbox"
                />
              </div>
            </div>
          </section>
        )}

        {/* Security Section */}
        {activeTab === 'security' && (
          <section className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm space-y-lg">
            <div>
              <h2 className="font-headline-sm text-headline-sm mb-xs">Security Settings</h2>
              <p className="text-on-surface-variant text-body-sm">Secure your account and API endpoints.</p>
            </div>
            
            {passwordStatus && (
              <div className={`p-md rounded-lg border text-body-sm ${
                passwordStatus.type === 'success'
                  ? 'bg-tertiary-container/10 border-tertiary/20 text-tertiary'
                  : 'bg-error-container/10 border-error/20 text-error'
              }`}>
                {passwordStatus.message}
              </div>
            )}
            
            <form onSubmit={handlePasswordUpdate} className="space-y-lg max-w-xl">
              <div className="space-y-md">
                <div>
                  <label className="block font-bold text-[12px] uppercase text-outline mb-xs">Current Password</label>
                  <input
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-sm border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-surface"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[12px] uppercase text-outline mb-xs">New Password</label>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-sm border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-surface"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[12px] uppercase text-outline mb-xs">Confirm New Password</label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-sm border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-surface"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <button type="submit" className="px-lg py-sm bg-primary text-white rounded-lg font-bold hover:brightness-105 active:scale-95 transition-all shadow-sm">
                  Update Password
                </button>
              </div>
            </form>

            <div className="pt-lg border-t border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
              <div>
                <p className="font-bold text-body-sm">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-on-surface-variant">Add an extra layer of security using an authenticator app.</p>
              </div>
              <button className="px-md py-sm border border-primary text-primary rounded-lg font-bold hover:bg-primary-container/5 transition-colors whitespace-nowrap">
                Enable 2FA
              </button>
            </div>
          </section>
        )}

        {/* API Preferences Section */}
        {activeTab === 'api-prefs' && (
          <section className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm space-y-lg">
            <div>
              <h2 className="font-headline-sm text-headline-sm mb-xs">API Preferences</h2>
              <p className="text-on-surface-variant text-body-sm">Global defaults for your API requests.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-lg">
              <div>
                <label className="block font-bold text-body-sm mb-sm text-on-surface">Default Timeout (ms)</label>
                <input
                  value={defaultTimeout}
                  onChange={(e) => setDefaultTimeout(Number(e.target.value))}
                  className="font-code w-full p-sm border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none bg-surface"
                  type="number"
                />
              </div>
              <div>
                <label className="block font-bold text-body-sm mb-sm text-on-surface">Default Deployment Region</label>
                <select
                  value={defaultRegion}
                  onChange={(e) => setDefaultRegion(e.target.value)}
                  className="w-full p-sm border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none bg-surface cursor-pointer"
                >
                  <option>us-east-1 (N. Virginia)</option>
                  <option>eu-west-1 (Ireland)</option>
                  <option>ap-southeast-1 (Singapore)</option>
                  <option>us-west-2 (Oregon)</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Danger Zone */}
        <section className="bg-error-container/10 border border-error/20 p-lg rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-error mb-xs">Danger Zone</h2>
              <p className="text-on-surface-variant text-body-sm">Permanently delete your account and all associated data.</p>
            </div>
            <button className="px-lg py-md border-2 border-error text-error font-bold rounded-lg hover:bg-error hover:text-white transition-all active:scale-95 whitespace-nowrap">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
