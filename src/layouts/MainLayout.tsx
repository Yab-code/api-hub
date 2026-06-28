import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 border-b border-outline-variant/30 shadow-sm glass-nav transition-all duration-200 ease-in-out">
        <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-lg">
            <Link to="/" className="font-headline-sm text-headline-sm font-bold text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              APIHub
            </Link>
            
            {/* Search (Web) */}
            <div className="hidden md:flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all w-64">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-2">search</span>
              <input
                className="bg-transparent border-none outline-none text-body-sm font-body-sm w-full placeholder-on-surface-variant p-0 focus:ring-0"
                placeholder="Search APIs..."
                type="text"
              />
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-lg">
            <Link to="/apis" className="font-body-md text-body-md text-on-surface-variant hover:text-primary h-16 flex items-center px-2 hover:bg-surface-container-low/50 transition-colors">Explore</Link>
            <a href="#pricing" className="font-body-md text-body-md text-on-surface-variant hover:text-primary h-16 flex items-center px-2 hover:bg-surface-container-low/50 transition-colors">Pricing</a>
            <a href="#docs" className="font-body-md text-body-md text-on-surface-variant hover:text-primary h-16 flex items-center px-2 hover:bg-surface-container-low/50 transition-colors">Docs</a>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-md">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hidden md:inline-flex font-body-sm text-body-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 bg-error-container text-on-error-container border border-error/20 rounded-lg font-body-sm text-body-sm font-semibold hover:bg-error hover:text-white transition-colors shadow-sm"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:inline-flex font-body-sm text-body-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 bg-primary-container text-on-primary rounded-lg font-body-sm text-body-sm font-semibold hover:bg-primary transition-colors shadow-sm">
                  Sign up
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-outline-variant/30 bg-surface px-gutter py-md space-y-md shadow-inner flex flex-col">
            {/* Search (Mobile) */}
            <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all w-full">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-2">search</span>
              <input
                className="bg-transparent border-none outline-none text-body-sm font-body-sm w-full placeholder-on-surface-variant p-0 focus:ring-0"
                placeholder="Search APIs..."
                type="text"
              />
            </div>
            
            <Link to="/apis" onClick={() => setIsMobileMenuOpen(false)} className="font-body-md text-on-surface-variant hover:text-primary py-sm border-b border-outline-variant/10">Explore</Link>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="font-body-md text-on-surface-variant hover:text-primary py-sm border-b border-outline-variant/10">Pricing</a>
            <a href="#docs" onClick={() => setIsMobileMenuOpen(false)} className="font-body-md text-on-surface-variant hover:text-primary py-sm border-b border-outline-variant/10">Docs</a>
            
            {isAuthenticated ? (
              <div className="flex flex-col gap-sm pt-sm">
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2 bg-surface-container border border-outline-variant rounded-lg font-body-sm font-semibold hover:bg-surface-container-high transition-colors">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-sm pt-sm">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2 bg-surface-container border border-outline-variant rounded-lg font-body-sm font-semibold hover:bg-surface-container-high transition-colors">
                  Log in
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Stage */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full py-3xl border-t border-outline-variant mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-xl px-gutter max-w-container-max mx-auto">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1 space-y-md">
            <div className="font-headline-sm text-headline-sm font-bold text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              APIHub
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              The world's largest API directory and management hub.
            </p>
            <div className="font-body-sm text-body-sm text-on-surface-variant opacity-80 pt-lg">
              © {new Date().getFullYear()} APIHub Inc. All rights reserved.
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="space-y-md">
            <h4 className="font-body-md text-body-md font-semibold text-on-background">Product</h4>
            <ul className="space-y-sm">
              <li><Link to="/apis" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">Explore</Link></li>
              <li><a href="#pricing" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">Pricing</a></li>
              <li><a href="#changelog" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">Changelog</a></li>
            </ul>
          </div>
          <div className="space-y-md">
            <h4 class="font-body-md text-body-md font-semibold text-on-background">Resources</h4>
            <ul className="space-y-sm">
              <li><a href="#docs" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">Documentation</a></li>
              <li><a href="#reference" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">API Reference</a></li>
              <li><a href="#community" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">Community</a></li>
            </ul>
          </div>
          <div className="space-y-md">
            <h4 className="font-body-md text-body-md font-semibold text-on-background">Company</h4>
            <ul className="space-y-sm">
              <li><a href="#about" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">About Us</a></li>
              <li><a href="#careers" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">Careers</a></li>
              <li><a href="#blog" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">Blog</a></li>
            </ul>
          </div>
          <div className="space-y-md">
            <h4 className="font-body-md text-body-md font-semibold text-on-background">Legal</h4>
            <ul className="space-y-sm">
              <li><a href="#privacy" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">Privacy Policy</a></li>
              <li><a href="#terms" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">Terms of Service</a></li>
              <li><a href="#security" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100">Security</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
