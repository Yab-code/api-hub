import React, { useState } from 'react';

interface ManageUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Developer' | 'Viewer';
  status: 'Active' | 'Suspended' | 'Pending';
  lastActivity: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<ManageUser[]>([
    { id: '1', name: 'Julianne Deleon', email: 'julianne.d@example.com', role: 'Admin', status: 'Active', lastActivity: '2 mins ago' },
    { id: '2', name: 'Marcus Kane', email: 'm.kane@devcorp.net', role: 'Developer', status: 'Active', lastActivity: '4 hours ago' },
    { id: '3', name: "Sarah L'Orange", email: 'sarah.orange@studio.io', role: 'Viewer', status: 'Pending', lastActivity: '1 day ago' },
    { id: '4', name: 'Devon Sanders', email: 'devon@apihub.com', role: 'Developer', status: 'Suspended', lastActivity: '3 days ago' },
  ]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new user
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'Developer' | 'Viewer'>('Developer');

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: ManageUser = {
      id: String(users.length + 1),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
      lastActivity: 'Just now',
    };

    setUsers(prev => [...prev, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('Developer');
    setShowAddModal(false);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All Statuses' ||
                          (statusFilter === 'Active' && u.status === 'Active') ||
                          (statusFilter === 'Suspended' && u.status === 'Suspended') ||
                          (statusFilter === 'Pending' && u.status === 'Pending');
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">User Management</h1>
          <p className="text-on-surface-variant font-body-md mt-sm">Administer access control, roles, and review user acquisition metrics.</p>
        </div>
        <div className="flex gap-sm">
          <button className="flex items-center gap-xs px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span className="font-label-caps text-label-caps font-bold">Export Data</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-xs px-md py-sm bg-primary text-white rounded-lg hover:bg-primary-container transition-colors shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span className="font-label-caps text-label-caps font-bold">Add User</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-primary-container/10 text-primary rounded-lg">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-tertiary font-bold text-xs bg-tertiary-container/10 px-sm py-0.5 rounded-full">+12.5%</span>
          </div>
          <div className="text-on-surface-variant font-label-caps text-label-caps uppercase">Total Users</div>
          <div className="text-headline-sm font-headline-sm mt-xs font-bold">{users.length}</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 p-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-tertiary-container/10 text-tertiary rounded-lg">
              <span className="material-symbols-outlined">how_to_reg</span>
            </div>
            <span className="text-tertiary font-bold text-xs bg-tertiary-container/10 px-sm py-0.5 rounded-full">+4.2%</span>
          </div>
          <div className="text-on-surface-variant font-label-caps text-label-caps uppercase">Active Today</div>
          <div className="text-headline-sm font-headline-sm mt-xs font-bold">2</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 p-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-error-container/10 text-error rounded-lg">
              <span className="material-symbols-outlined">timer</span>
            </div>
            <span className="text-error font-bold text-xs bg-error-container/10 px-sm py-0.5 rounded-full">-2.1%</span>
          </div>
          <div className="text-on-surface-variant font-label-caps text-label-caps uppercase">Avg Session</div>
          <div className="text-headline-sm font-headline-sm mt-xs font-bold">12m 45s</div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 p-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-secondary-container/20 text-secondary rounded-lg">
              <span className="material-symbols-outlined">credit_card</span>
            </div>
            <span className="text-tertiary font-bold text-xs bg-tertiary-container/10 px-sm py-0.5 rounded-full">+18%</span>
          </div>
          <div className="text-on-surface-variant font-label-caps text-label-caps uppercase">Conversion</div>
          <div className="text-headline-sm font-headline-sm mt-xs font-bold">3.4%</div>
        </div>
      </div>

      {/* Detailed User Table Section */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Filters/Search */}
        <div className="p-lg border-b border-outline-variant/20 flex flex-col sm:flex-row gap-md justify-between items-center bg-white/50 backdrop-blur-sm">
          <div className="relative w-full sm:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-md py-sm bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm outline-none"
              placeholder="Search by name, email..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-sm w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-xl px-md py-sm text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>Developer</option>
              <option>Viewer</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-xl px-md py-sm text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container/30 border-b border-outline-variant/20">
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">User</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Role</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-wider uppercase tracking-wider">Status</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Last Activity</th>
                <th className="px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-xl text-on-surface-variant font-body-sm">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-variant/10 transition-colors group">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface text-sm">{u.name}</div>
                          <div className="text-xs text-on-surface-variant">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <span className={`inline-flex items-center px-sm py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${
                        u.role === 'Admin' ? 'bg-primary-container/10 text-primary' :
                        u.role === 'Developer' ? 'bg-secondary-container/30 text-secondary' :
                        'bg-outline-variant/30 text-on-surface-variant'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className={`w-2 h-2 rounded-full ${
                          u.status === 'Active' ? 'bg-tertiary-fixed-dim bg-emerald-500 animate-pulse' :
                          u.status === 'Suspended' ? 'bg-error' :
                          'bg-yellow-500'
                        }`} />
                        <span className="text-sm">{u.status}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md text-sm text-on-surface-variant">{u.lastActivity}</td>
                    <td className="px-lg py-md text-right">
                      <div className="flex justify-end gap-base">
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          className="p-base text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                          title={u.status === 'Active' ? 'Suspend User' : 'Activate User'}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {u.status === 'Active' ? 'block' : 'check_circle'}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-base text-on-surface-variant hover:text-error transition-colors focus:outline-none"
                          title="Delete User"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/50 backdrop-blur-sm p-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-lg">
            <div className="flex justify-between items-center mb-lg border-b border-outline-variant/20 pb-sm">
              <h3 className="font-headline-sm font-bold text-on-surface flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Add New User
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="material-symbols-outlined hover:text-error transition-colors focus:outline-none"
              >
                close
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-md">
              <div className="space-y-xs">
                <label className="block text-xs font-bold text-on-surface-variant uppercase">Full Name</label>
                <input
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-sm border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g. John Doe"
                  type="text"
                />
              </div>

              <div className="space-y-xs">
                <label className="block text-xs font-bold text-on-surface-variant uppercase">Email Address</label>
                <input
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full p-sm border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g. john@domain.com"
                  type="email"
                />
              </div>

              <div className="space-y-xs">
                <label className="block text-xs font-bold text-on-surface-variant uppercase">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full p-sm border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                >
                  <option>Developer</option>
                  <option>Admin</option>
                  <option>Viewer</option>
                </select>
              </div>

              <div className="flex gap-md pt-md justify-end border-t border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-md py-sm bg-primary text-white rounded-lg hover:bg-primary-container transition-colors active:scale-95"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
