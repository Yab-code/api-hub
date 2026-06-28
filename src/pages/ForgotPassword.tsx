import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword: React.FC = () => {
  const { forgotPassword, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setLocalError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTryAnother = () => {
    setSubmitted(false);
    setEmail('');
    setLocalError(null);
  };

  return (
    <main className="relative z-10 w-full max-w-md px-md md:px-0">
      <div className="text-center mb-xl">
        <Link className="inline-flex items-center gap-sm group" to="/">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined font-semibold">hub</span>
          </div>
          <span className="font-headline-sm text-headline-sm font-bold text-on-background tracking-tight">APIHub</span>
        </Link>
      </div>

      <div className="glass-panel rounded-[16px] p-[24px] w-full bg-surface-container-lowest border border-outline-variant shadow-sm">
        {!submitted ? (
          <div id="request-form">
            <div className="mb-lg">
              <h1 className="font-headline-md text-headline-md text-on-surface mb-sm">Reset Password</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {(localError || authError) && (
              <div className="p-md mb-lg bg-error-container/10 border border-error/20 text-error rounded-xl flex items-start gap-md text-body-sm font-semibold">
                <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
                <div className="flex-1 leading-relaxed">
                  {localError || authError}
                </div>
              </div>
            )}

            <form className="space-y-lg" onSubmit={handleSubmit}>
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider" htmlFor="email">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-md py-sm bg-surface border border-outline-variant rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all placeholder-outline placeholder:font-body-md"
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                  disabled={loading}
                />
              </div>
              <button
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-sm bg-primary-container hover:bg-surface-tint text-on-primary font-label-caps text-label-caps rounded-lg transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
                type="submit"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Send Reset Link
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-lg" id="success-message">
            <div className="w-16 h-16 mx-auto bg-surface-container-high rounded-full flex items-center justify-center text-primary-container mb-md">
              <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Check your email</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
              If an account exists for <strong className="text-on-surface">{email}</strong>, a reset link has been sent.
            </p>
            <button
              onClick={handleTryAnother}
              className="font-label-caps text-label-caps text-primary-container hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="mt-lg pt-lg border-t border-outline-variant/30 text-center">
          <Link className="inline-flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container transition-colors group" to="/login">
            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </div>

      <div className="mt-xl text-center">
        <p className="font-body-sm text-body-sm text-outline">
          Need help? <a className="text-primary hover:underline underline-offset-4" href="#support">Contact Support</a>
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;
