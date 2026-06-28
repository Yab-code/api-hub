import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      await login(email, password);
      // Determine dashboard route based on entered credentials/role
      const isAdmin = email.toLowerCase().includes('admin');
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setLocalError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setLocalError(null);
    setLoading(true);
    try {
      // Simulate OAuth login
      const dummyEmail = provider === 'admin' ? 'admin@apihub.com' : 'developer@company.com';
      await login(dummyEmail);
      navigate(provider === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setLocalError(err.message || `OAuth login with ${provider} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="p-lg sm:p-xl flex flex-col gap-xl">
        {/* Header Section */}
        <header className="text-center flex flex-col gap-sm items-center">
          <Link to="/" className="w-12 h-12 bg-primary-container text-on-primary rounded-xl flex items-center justify-center mb-sm shadow-sm hover:scale-105 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '28px' }}>api</span>
          </Link>
          <h1 className="font-headline-md text-headline-md text-on-background">Welcome back</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Log in to your APIHub dashboard</p>
        </header>

        {/* Error Alert */}
        {(localError || authError) && (
          <div className="p-md bg-error-container/10 border border-error/20 text-error rounded-xl flex items-start gap-md text-body-sm font-semibold">
            <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
            <div className="flex-1 leading-relaxed">
              {localError || authError}
            </div>
          </div>
        )}

        {/* Social Login Options */}
        <div className="flex flex-col gap-sm">
          <button
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm font-semibold text-on-background hover:bg-surface-container-low hover:border-primary-container transition-all duration-200 disabled:opacity-50"
          >
            <img alt="GitHub Logo" className="w-5 h-5 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxDiITk2atpJSVRDJnPctVfg6p7Arz6FQVkt5B046cA-uhGtIBeAgtG9cAnGGtWkQHmO60JRWxsFhf3379LO7Ka0Nh4QFP0IA_e8npFUz-UlpHQY_BWQeusI-yePqwHa9F0DT0x5JGHUAh7TB-c3KUzMiiXSzuQ9HzoccfTDNEkfHCHddgLOQPq2D1Zc9DtP51Bq2UB9SAvqUcBzvK-Tw-0BiF6887JOVBMEsTAFIN_M50il6P9kzN1_nqUM2yatTdNfDNci1nJNe4"/>
            Sign in with GitHub
          </button>
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm font-semibold text-on-background hover:bg-surface-container-low hover:border-primary-container transition-all duration-200 disabled:opacity-50"
          >
            <img alt="Google Logo" className="w-4 h-4 opacity-80" src="https://lh3.googleusercontent.com/AB6AXuDE6X172obGceYuO3T1RJwmS0CbjAim2wLhuvitdyt9XeMD3jseHk47kXRdeK9kRR5iBFrZKR78d6XY6H5mcSjm064BiLd0F-3XNALYSC5obKBvq3j4fR8UVXwfdwOV8DFj_mqXiZ3m6bszLPs7xE-YR5tBZkBCB58VX_1BAQefn54N2tDjD8G9QoeKPnF5YtNNxCGRcHp4g_hiDorST0GBAGjLso0DWS5fCrQVIh3ccNro0C7pz3iiIF7o7J65F1iB12zPA4OuaoXu"/>
            Sign in with Google
          </button>
          {/* Admin Fast-Track button for development/testing */}
          <button
            onClick={() => handleOAuthLogin('admin')}
            disabled={loading}
            className="w-full h-10 flex items-center justify-center gap-sm bg-surface-variant/20 border border-outline-variant/30 rounded-lg text-[12px] font-bold text-primary hover:bg-surface-variant/50 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            Quick Access: Admin Dashboard
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-sm">
          <div className="flex-grow border-t border-outline-variant"></div>
          <span className="flex-shrink-0 mx-4 font-label-caps text-label-caps text-on-surface-variant bg-surface-container-lowest px-2">OR CONTINUE WITH EMAIL</span>
          <div className="flex-grow border-t border-outline-variant"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <div className="flex flex-col gap-md">
            {/* Email Input */}
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm font-semibold text-on-background" htmlFor="email">Email address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-sm py-2 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all outline-none"
                id="email"
                name="email"
                placeholder="developer@company.com"
                required
                type="email"
                disabled={loading}
              />
            </div>
            
            {/* Password Input */}
            <div className="flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <label className="font-body-sm text-body-sm font-semibold text-on-background" htmlFor="password">Password</label>
                <Link className="font-body-sm text-body-sm text-primary hover:text-primary-container font-semibold transition-colors" to="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-sm py-2 pr-12 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-background placeholder:text-outline focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  disabled={loading}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-outline hover:text-on-surface-variant focus:outline-none"
                  type="button"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: showPassword ? "'FILL' 1" : "'FILL' 0" }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-outline-variant text-primary-container focus:ring-primary-container bg-surface"
              id="remember-me"
              name="remember-me"
              type="checkbox"
              disabled={loading}
            />
            <label className="ml-2 block font-body-sm text-body-sm text-on-surface-variant" htmlFor="remember-me">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full h-12 bg-primary-container hover:bg-surface-tint text-on-primary rounded-lg font-body-md text-body-md font-semibold transition-colors duration-200 shadow-sm flex justify-center items-center gap-xs disabled:opacity-50"
            type="submit"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                Sign in
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-surface-container-low px-lg py-md border-t border-outline-variant text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Don't have an account?{' '}
          <Link className="font-semibold text-primary hover:text-primary-container transition-colors" to="/register">Sign up</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
