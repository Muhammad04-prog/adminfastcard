import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import logoImg from '@/assets/Group 1116606595 (5).png';

export const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <header className="h-16 bg-[#161e2b] text-white flex items-center justify-between px-6 border-b border-[#242f41] flex-shrink-0 z-20">
      
      {/* Logo Section */}
      <div className="flex items-center">
        <img src={logoImg} alt="fastcart" className="h-9 w-auto object-contain select-none" />
      </div>

      {/* Center Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          className="w-72 pl-9 pr-4 py-2 rounded-lg bg-[#202c3f]/50 border border-[#2b3b52] text-slate-200 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
          placeholder="Search..."
        />
      </div>

      {/* Right User Options */}
      <div className="flex items-center gap-4">
        
        {/* Notification Icon */}
        <button className="relative p-1.5 rounded-full hover:bg-[#202c3f] transition-all duration-150 focus:outline-none">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full text-[10px] font-extrabold flex items-center justify-center text-white border border-[#161e2b]">
            5
          </span>
        </button>

        {/* User Account Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 cursor-pointer pl-2 border-l border-slate-700/50 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center font-bold text-white text-sm select-none">
              M
            </div>
            <span className="text-sm font-medium text-slate-200 hidden sm:inline select-none">
              Muhammad
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:inline" />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 font-medium flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
