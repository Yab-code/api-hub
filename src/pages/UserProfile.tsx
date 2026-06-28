import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDb';

const UserProfile: React.FC = () => {
  const { user, refreshUserInfo } = useAuth();
  
  const [fullName, setFullName] = useState(user?.name || 'Alexander Wright');
  const [email, setEmail] = useState(user?.email || 'alex.wright@dev-api.io');
  const [bio, setBio] = useState('Full-stack developer specialized in microservices and real-time data streaming. Building the next generation of fintech APIs.');
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);

    if (user) {
      const updatedUser = {
        ...user,
        name: fullName,
        email: email,
      };
      mockDb.saveUser(updatedUser);
      localStorage.setItem('apihub_user', JSON.stringify(updatedUser));
      refreshUserInfo();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (!newPassword || newPassword.length < 8) {
      setPassError('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Confirm password does not match.');
      return;
    }

    setPassSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/* Left Column: Profile & Personal Info */}
      <div className="lg:col-span-8 space-y-gutter">
        {/* Profile Card */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-xl items-start md:items-center mb-xl">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-container/20">
                <img
                  className="w-full h-full object-cover"
                  alt={user?.name || 'User Avatar'}
                  src={user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gok_o0DtLEC3m0jbNL_quGIbn6A-HacR4g9oxWeILFiwglfhBUr4vNTbxkIBdI0NpDARa3PU3xJmKKr4Al6rm_3jkKqpmEhgbOkb1N3x00s6DKL2X5DhSTUD6gkWzbL8aVS8eLGgUGJufK6kjV1aXlfuXCkSlTxEYSvEz8TvJ_8kpkv4Zl8E6lq2Vwvo2fKpRcl9-bVs78_JtqjKubxECUmy06wizaq_kdDZY8UCpnp1NECGq3o1-I3phOYxRCPbEmneSiNetsL5'}
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-base rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Personal Information</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Update your name, bio and primary email address.</p>
              <button className="px-md py-base border border-outline-variant text-primary font-body-sm text-body-sm rounded-lg hover:bg-primary-container/5 transition-colors">
                Change Photo
              </button>
            </div>
          </div>

          {profileSuccess && (
            <div className="p-md mb-lg bg-tertiary-container/10 border border-tertiary/20 text-tertiary rounded-xl flex items-center gap-sm text-body-sm font-semibold">
              <span className="material-symbols-outlined text-tertiary">check_circle</span>
              <span>Changes saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-base">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                type="text"
              />
            </div>
            <div className="space-y-base">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                type="email"
              />
            </div>
            <div className="md:col-span-2 space-y-base">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                rows={3}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="bg-primary text-on-primary px-xl py-sm rounded-lg font-body-md text-body-md font-bold shadow-md hover:opacity-90 transition-all active:scale-[0.98]" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Change Password Card */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-xl shadow-sm">
          <div className="flex items-center gap-md mb-lg">
            <span className="material-symbols-outlined text-primary">lock</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Security & Password</h2>
          </div>

          {passError && (
            <div className="p-md mb-lg bg-error-container/10 border border-error/20 text-error rounded-xl flex items-center gap-sm text-body-sm font-semibold">
              <span className="material-symbols-outlined text-error">error</span>
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="p-md mb-lg bg-tertiary-container/10 border border-tertiary/20 text-tertiary rounded-xl flex items-center gap-sm text-body-sm font-semibold">
              <span className="material-symbols-outlined text-tertiary">check_circle</span>
              <span>Password updated successfully!</span>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div className="space-y-base">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Current Password</label>
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md outline-none"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
              <div className="space-y-base">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">New Password</label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md outline-none"
                  placeholder="••••••••"
                  type="password"
                />
                <p className="text-[11px] text-primary">Must be at least 8 characters.</p>
              </div>
              <div className="space-y-base">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Confirm New</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md outline-none"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>
            <div className="p-md bg-surface-container-low border-l-4 border-primary rounded-r-lg flex items-start gap-md">
              <span className="material-symbols-outlined text-primary text-[20px]">info</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">We recommend a unique password to protect your API keys and production environments.</p>
            </div>
            <div className="flex justify-end">
              <button className="bg-primary text-on-primary px-xl py-sm rounded-lg font-body-md text-body-md font-bold shadow-md hover:opacity-90 transition-all active:scale-[0.98]" type="submit">
                Update Password
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Right Column: Summary & Secondary Settings */}
      <div className="lg:col-span-4 space-y-gutter">
        {/* API Usage Summary Card */}
        <section className="bg-inverse-surface text-inverse-on-surface rounded-xl p-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 space-y-md">
            <div className="flex justify-between items-start">
              <span className="bg-primary-container text-on-primary-container px-sm py-1 rounded-full font-label-caps text-label-caps uppercase text-[10px] font-bold">
                {user?.plan} Plan
              </span>
              <span className="material-symbols-outlined text-primary-fixed-dim">insights</span>
            </div>
            
            <div className="space-y-sm">
              <p className="text-[12px] text-inverse-on-surface/70 uppercase font-bold tracking-wider">Monthly Request Limit</p>
              <h3 className="text-3xl font-bold font-headline-md text-white">458,912 / 1,000,000</h3>
              
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '45.8%' }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-md pt-sm border-t border-slate-700">
              <div>
                <p className="text-[10px] text-inverse-on-surface/50 uppercase">Latency Avg</p>
                <p className="text-body-md font-bold text-white">42 ms</p>
              </div>
              <div>
                <p className="text-[10px] text-inverse-on-surface/50 uppercase">Success Rate</p>
                <p className="text-body-md font-bold text-[#4edea3]">99.98%</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Plan & Features list */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-xl shadow-sm space-y-md">
          <h3 className="font-bold text-body-lg text-on-surface border-b border-outline-variant/20 pb-sm">Plan Details</h3>
          <ul className="space-y-sm text-body-sm text-on-surface-variant">
            <li className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-tertiary">check_circle</span>
              50,000 free requests / day
            </li>
            <li className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-tertiary">check_circle</span>
              Up to 20 API Key credentials
            </li>
            <li className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-tertiary">check_circle</span>
              Basic latency logs (30 days)
            </li>
            <li className="flex items-center gap-sm text-outline">
              <span className="material-symbols-outlined">block</span>
              Dedicated SLA support
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
