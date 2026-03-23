import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Settings, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, labelKey: 'admin.dashboard', end: true },
  { to: '/admin/products', icon: Package, labelKey: 'admin.products' },
  { to: '/admin/categories', icon: Tag, labelKey: 'admin.categories' },
  { to: '/admin/settings', icon: Settings, labelKey: 'admin.settings' },
];

export function AdminLayout() {
  const { t } = useTranslation();
  const { logout, username } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-lupe-900 text-lupe-100 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-lupe-800">
          <p className="font-display text-xl font-bold text-white">LUPE</p>
          <p className="text-xs text-lupe-400 mt-0.5">{username}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, labelKey, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-lupe-700 text-white'
                    : 'text-lupe-300 hover:bg-lupe-800 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-lupe-800">
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-lupe-400 hover:bg-lupe-800 hover:text-white w-full transition-colors"
          >
            <LogOut size={16} />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
