import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation checks
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setLocalError('You must accept the Terms and Conditions');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email);
      navigate('/dashboard');
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRegister = async (provider: string) => {
    setLocalError(null);
    setLoading(true);
    try {
      // Simulate registration via provider
      await register(`${provider.toUpperCase()} User`, `oauth_${provider}@apihub.com`);
      navigate('/dashboard');
    } catch (err: any) {
      setLocalError(err.message || `OAuth sign up with ${provider} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-md">
      {/* Brand Header inside card for focus */}
      <div className="text-center mb-xl">
        <Link to="/" className="inline-flex items-center justify-center mb-sm hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-primary text-[42px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
        </Link>
        <h1 className="font-headline-md text-headline-md text-on-background mb-sm">Join APIHub</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Create your account to start managing APIs.</p>
      </div>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-[16px] shadow-[0px_4px_12px_rgba(0,0,0,0.03)] p-xl relative overflow-hidden backdrop-blur-xl">
        {/* Error Alert */}
        {(localError || authError) && (
          <div className="p-md mb-lg bg-error-container/10 border border-error/20 text-error rounded-xl flex items-start gap-md text-body-sm font-semibold">
            <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
            <div className="flex-1 leading-relaxed">
              {localError || authError}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-lg">
          {/* Full Name & Username Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="space-y-sm">
              <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="fullname">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">person</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface pl-[36px] pr-sm py-sm rounded-lg border border-outline-variant text-on-background font-body-md text-body-md placeholder-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200 outline-none"
                  id="fullname"
                  name="fullname"
                  placeholder="Jane Doe"
                  required
                  type="text"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-sm">
              <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="username">Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">badge</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface pl-[36px] pr-sm py-sm rounded-lg border border-outline-variant text-on-background font-body-md text-body-md placeholder-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200 outline-none"
                  id="username"
                  name="username"
                  placeholder="janedoe"
                  required
                  type="text"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-sm">
            <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">mail</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface pl-[36px] pr-sm py-sm rounded-lg border border-outline-variant text-on-background font-body-md text-body-md placeholder-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200 outline-none"
                id="email"
                name="email"
                placeholder="jane@example.com"
                required
                type="email"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="space-y-sm">
              <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="password">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">lock</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface pl-[36px] pr-sm py-sm rounded-lg border border-outline-variant text-on-background font-body-md text-body-md placeholder-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200 outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-sm">
              <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="confirm_password">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">lock_reset</span>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface pl-[36px] pr-sm py-sm rounded-lg border border-outline-variant text-on-background font-body-md text-body-md placeholder-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200 outline-none"
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="••••••••"
                  required
                  type="password"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-sm pt-sm">
            <div className="flex items-center h-5">
              <input
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 text-primary-container bg-surface border-outline-variant rounded focus:ring-primary-container focus:ring-2 transition-colors cursor-pointer"
                id="terms"
                name="terms"
                type="checkbox"
                disabled={loading}
              />
            </div>
            <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="terms">
              I accept the <a className="text-primary-container hover:text-primary transition-colors font-semibold" href="#terms">Terms and Conditions</a> and <a className="text-primary-container hover:text-primary transition-colors font-semibold" href="#privacy">Privacy Policy</a>.
            </label>
          </div>

          {/* Primary CTA */}
          <button
            disabled={loading}
            className="w-full bg-primary-container hover:bg-surface-tint text-on-primary font-body-md text-body-md font-semibold py-sm rounded-lg transition-all duration-200 ease-in-out active:scale-[0.98] flex items-center justify-center gap-xs shadow-sm disabled:opacity-50"
            type="submit"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-xl">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-sm bg-surface-container-lowest text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Or continue with</span>
          </div>
        </div>

        {/* Social Auth Options */}
        <div className="grid grid-cols-2 gap-md">
          <button
            onClick={() => handleOAuthRegister('github')}
            disabled={loading}
            className="flex items-center justify-center gap-sm py-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors duration-200 active:scale-[0.98] font-body-sm text-body-sm font-medium text-on-background disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">code</span>
            GitHub
          </button>
          <button
            onClick={() => handleOAuthRegister('google')}
            disabled={loading}
            className="flex items-center justify-center gap-sm py-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors duration-200 active:scale-[0.98] font-body-sm text-body-sm font-medium text-on-background disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
            Google
          </button>
        </div>
      </div>

      {/* Footer Link */}
      <p className="text-center mt-xl font-body-sm text-body-sm text-on-surface-variant">
        Already have an account?{' '}
        <Link className="text-primary-container hover:text-primary font-semibold transition-colors" to="/login">Log in</Link>
      </p>
    </main>
  );
};

export default Register;
