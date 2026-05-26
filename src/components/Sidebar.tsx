import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" />, badge: 16 },
    { path: '/products', label: 'Products', icon: <Package className="w-5 h-5" /> },
    { path: '/other', label: 'Other', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-60 bg-[#161e2b] flex-shrink-0 border-r border-[#242f41] flex flex-col justify-between p-4 z-10">
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:bg-[#202c3f]/50 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-slate-900 text-white' : 'bg-[#202c3f] text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
