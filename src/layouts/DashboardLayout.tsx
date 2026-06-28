import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar (Fixed) */}
      <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm h-16">
        <div className="flex justify-between items-center px-lg h-full w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-xl">
            <Link to="/" className="font-headline-sm text-headline-sm font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              APIHub
            </Link>
            <nav className="hidden md:flex gap-md h-full items-center">
              <Link to="/apis" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors h-full flex items-center px-sm">
                Solutions
              </Link>
              <a href="#docs" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors h-full flex items-center px-sm">
                Docs
              </a>
              <a href="#pricing" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors h-full flex items-center px-sm">
                Pricing
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-md">
            {/* Search */}
            <div className="hidden sm:flex items-center bg-surface-container-low px-sm py-xs rounded-lg border border-outline-variant/20">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-body-sm w-48 py-0 focus:outline-none" placeholder="Search APIs..." type="text" />
            </div>

            {/* Icons */}
            <div className="flex gap-sm">
              <Link to="/notifications" className="material-symbols-outlined p-sm rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
                notifications
              </Link>
              <a href="#help" className="material-symbols-outlined p-sm rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
                help_outline
              </a>
            </div>

            <button
              onClick={() => navigate('/apis/manage/new')}
              className="bg-primary-container text-white px-md py-sm rounded-lg font-body-sm font-bold active:scale-95 transition-transform"
            >
              Create API
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant focus:outline-none active:scale-95 transition-transform"
              >
                <img
                  className="w-full h-full object-cover"
                  alt={user?.name || 'User Avatar'}
                  src={user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gok_o0DtLEC3m0jbNL_quGIbn6A-HacR4g9oxWeILFiwglfhBUr4vNTbxkIBdI0NpDARa3PU3xJmKKr4Al6rm_3jkKqpmEhgbOkb1N3x00s6DKL2X5DhSTUD6gkWzbL8aVS8eLGgUGJufK6kjV1aXlfuXCkSlTxEYSvEz8TvJ_8kpkv4Zl8E6lq2Vwvo2fKpRcl9-bVs78_JtqjKubxECUmy06wizaq_kdDZY8UCpnp1NECGq3o1-I3phOYxRCPbEmneSiNetsL5'}
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg py-sm z-50">
                  <div className="px-md py-sm border-b border-outline-variant/10">
                    <p className="font-body-sm font-bold text-on-surface truncate">{user?.name}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-sm px-md py-sm text-body-sm text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    My Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/users"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-sm px-md py-sm text-body-sm text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">group</span>
                      User Management
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-sm px-md py-sm text-body-sm text-error hover:bg-error-container/10 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar (Fixed) */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-container-low/80 backdrop-blur-lg border-r border-outline-variant/20 flex flex-col py-md gap-xs hidden md:flex">
        <div className="px-md mb-lg">
          <div className="flex items-center gap-sm p-sm bg-primary-container/5 rounded-xl border border-primary/10">
            <div className="w-10 h-10 bg-primary-container text-white flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined">api</span>
            </div>
            <div>
              <p className="font-body-sm font-bold text-on-surface truncate">Workspace</p>
              <p className="text-[11px] text-on-surface-variant opacity-70 truncate">{user?.plan} Account</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-sm space-y-1">
          <NavLink
            to={dashboardPath}
            end
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg font-body-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary-container/10 text-primary border-l-4 border-primary rounded-r-lg font-bold'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:translate-x-1'
              }`
            }
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/apis"
            end
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg font-body-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary-container/10 text-primary border-l-4 border-primary rounded-r-lg font-bold'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:translate-x-1'
              }`
            }
          >
            <span className="material-symbols-outlined">explore</span>
            Explorer
          </NavLink>

          <NavLink
            to="/apis/manage"
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg font-body-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary-container/10 text-primary border-l-4 border-primary rounded-r-lg font-bold'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:translate-x-1'
              }`
            }
          >
            <span className="material-symbols-outlined">api</span>
            My APIs
          </NavLink>

          <NavLink
            to="/collections"
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg font-body-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary-container/10 text-primary border-l-4 border-primary rounded-r-lg font-bold'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:translate-x-1'
              }`
            }
          >
            <span className="material-symbols-outlined">folder</span>
            Collections
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg font-body-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary-container/10 text-primary border-l-4 border-primary rounded-r-lg font-bold'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:translate-x-1'
              }`
            }
          >
            <span className="material-symbols-outlined">favorite</span>
            Favorites
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg font-body-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary-container/10 text-primary border-l-4 border-primary rounded-r-lg font-bold'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:translate-x-1'
              }`
            }
          >
            <span className="material-symbols-outlined">history</span>
            History
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg font-body-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary-container/10 text-primary border-l-4 border-primary rounded-r-lg font-bold'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:translate-x-1'
              }`
            }
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </NavLink>
        </nav>

        <div className="px-md py-md mt-auto border-t border-outline-variant/10">
          <div className="bg-secondary-container text-on-secondary-container p-sm rounded-xl mb-md text-center">
            <p className="text-[11px] opacity-80">Current Plan: {user?.plan}</p>
            <button className="w-full mt-xs bg-white text-primary text-xs font-bold py-1.5 rounded-lg hover:bg-white/90 transition-colors">
              Upgrade Plan
            </button>
          </div>
          <nav className="space-y-1">
            <a className="flex items-center gap-md px-md py-xs text-on-surface-variant hover:text-primary font-body-sm transition-colors" href="#docs">
              <span className="material-symbols-outlined text-[20px]">description</span>
              Documentation
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-md px-md py-xs text-on-surface-variant hover:text-error font-body-sm transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Log out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="md:pl-64 pt-16 min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-container-max mx-auto px-lg py-xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation (Visible on mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 flex justify-around py-md z-50">
        <NavLink
          to={dashboardPath}
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-xs transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
          }
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-label-caps">Home</span>
        </NavLink>
        <NavLink
          to="/apis"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-xs transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
          }
        >
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-label-caps">Explore</span>
        </NavLink>
        <NavLink
          to="/apis/manage"
          className={({ isActive }) =>
            `flex flex-col items-center gap-xs transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
          }
        >
          <span className="material-symbols-outlined">api</span>
          <span className="text-[10px] font-label-caps">My APIs</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-xs transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
          }
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-label-caps">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default DashboardLayout;
