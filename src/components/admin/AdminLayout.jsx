import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Settings, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import lupeLogo from '../../assets/lupe_pink.svg';

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
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-lupe-blue text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <img src={lupeLogo} alt="LUPE" className="h-8 w-auto mb-1" />
          <p className="text-xs text-lupe-light-blue mt-0.5">{username}</p>
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
                    ? 'bg-white/20 text-white'
                    : 'text-lupe-light-blue hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-lupe-light-blue hover:bg-white/10 hover:text-white w-full transition-colors"
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
