import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Settings, LogOut, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import lupeLogo from '../../assets/lupe_pink.svg';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, labelKey: 'admin.dashboard', end: true },
  { to: '/admin/products', icon: Package, labelKey: 'admin.products' },
  { to: '/admin/categories', icon: Tag, labelKey: 'admin.categories' },
  { to: '/admin/sales', icon: ShoppingBag, labelKey: 'admin.sales' },
  { to: '/admin/settings', icon: Settings, labelKey: 'admin.settings' },
];

export function AdminLayout() {
  const { t } = useTranslation();
  const { logout, username } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function close() { setSidebarOpen(false); }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">

      {/* Mobile backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 lg:w-56
        bg-lupe-blue text-white flex flex-col flex-shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 border-b border-white/10 flex items-start justify-between">
          <div>
            <img src={lupeLogo} alt="LUPE" className="h-8 w-auto mb-1" />
            <p className="text-xs text-lupe-light-blue mt-0.5">{username}</p>
          </div>
          <button
            onClick={close}
            className="lg:hidden p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, labelKey, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={close}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-lupe-light-blue hover:bg-white/10 hover:text-white w-full transition-colors"
          >
            <LogOut size={16} />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu size={20} />
          </button>
          <img src={lupeLogo} alt="LUPE" className="h-7 w-auto" />
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
