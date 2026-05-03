import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, BookOpen, Bot, BarChart3, Settings, Trophy, LogOut, Zap } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/ai-tutor', label: 'AI Tutor', icon: Bot },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Zap size={20} />
            </div>
            <div className="logo-text">
              <span className="logo-title">NeuroLearn AI</span>
              <span className="logo-subtitle">THE DIGITAL ATELIER</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {location.pathname === item.path && <div className="active-indicator" />}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user">
              <div className="avatar avatar-sm">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name}</span>
                <span className="sidebar-user-role">
                  {user.isPremium ? 'Premium Scholar' : 'Free Plan'}
                </span>
              </div>
            </div>
          )}
          <button className="sidebar-link logout-btn" onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
