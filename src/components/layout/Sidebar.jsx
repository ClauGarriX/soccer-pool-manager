import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, DollarSign, BarChart3, Settings, LogOut, X, Menu } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, onLogout }) => {
  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Target, label: 'Quinielas', path: '/quinielas' },
    { icon: DollarSign, label: 'Pagos', path: '/pagos' },
    { icon: BarChart3, label: 'Estadísticas', path: '/estadisticas' },
    { icon: Settings, label: 'Configuración', path: '/configuracion' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-blue-600 to-purple-700 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Quinielas</h1>
              <p className="text-xs text-white/70">Liga MX</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-blue-600 font-semibold shadow-lg'
                    : 'hover:bg-white/10 text-white/90'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-white/10 transition-colors text-white/90 hover:text-white"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
