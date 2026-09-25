import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, User, Moon, Sun } from 'lucide-react';
import { NAV_ITEMS } from '../../utils/constants';
import * as Icons from 'lucide-react';

const Sidebar = ({ isDarkMode, toggleDarkMode }) => {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-64 bg-gradient-dark border-r border-gray-800 flex flex-col z-40"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2.5 rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TimetableAI
            </h1>
            <p className="text-xs text-gray-500">Smart Scheduling</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = Icons[item.icon];
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: linkActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${linkActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-glow`
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile & Dark Mode Toggle */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <div className="p-2 rounded-lg bg-white/10">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
          <div className="bg-gradient-primary p-2 rounded-full">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-500">admin@college.edu</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
