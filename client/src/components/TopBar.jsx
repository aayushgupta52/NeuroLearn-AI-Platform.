import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Search, Bell, Menu, Moon, Sun, Flame, Gem, BookOpen, Star, Settings, LogOut, User, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './TopBar.css';

export default function TopBar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = [
    { id: 1, title: 'New Course Added', message: 'Advanced React Patterns is now live!', time: '2m ago', icon: BookOpen, color: 'var(--primary-500)' },
    { id: 2, title: 'Streak Protected!', message: 'You kept your 12-day streak alive 🔥', time: '1h ago', icon: Flame, color: 'var(--accent-amber)' },
    { id: 3, title: 'Level Up!', message: 'You reached Top 5% in Web Development', time: '1d ago', icon: Star, color: 'var(--accent-blue)' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfile(false);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <div className="topbar-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search courses, topics..." className="search-input" />
        </div>
      </div>

      <div className="topbar-right">
        {user && (
          <>
            <button
              className="topbar-stat tooltip"
              data-tooltip="View your streak →Analytics"
              onClick={() => navigate('/analytics')}
              style={{ cursor: 'pointer', border: 'none', background: 'var(--bg-secondary)' }}
            >
              <Flame size={18} className="streak-icon" />
              <span>{user.streak || 12} Day Streak</span>
            </button>
            <button
              className="topbar-stat tooltip"
              data-tooltip="View XP →Leaderboard"
              onClick={() => navigate('/leaderboard')}
              style={{ cursor: 'pointer', border: 'none', background: 'var(--bg-secondary)' }}
            >
              <Gem size={18} className="xp-icon" />
              <span>{user.xp?.toLocaleString() || '2,450'} XP</span>
            </button>
          </>
        )}

        <button className="topbar-icon-btn tooltip" data-tooltip={isDark ? 'Light Mode' : 'Dark Mode'} onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="topbar-icon-btn tooltip" data-tooltip="Notifications" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}>
            <Bell size={20} />
            <span className="notification-dot" />
          </button>

          {showNotifications && (
            <div className="topbar-dropdown animate-fadeIn" style={{ right: 0, width: 320 }}>
              <div className="topbar-dropdown-header">
                <span className="font-semibold">Notifications</span>
                <span className="badge badge-purple">3 new</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="topbar-dropdown-item">
                  <div style={{ background: n.color + '18', color: n.color, padding: 8, borderRadius: '50%', flexShrink: 0 }}>
                    <n.icon size={16} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>{n.title}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0' }}>{n.message}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', margin: 0 }}>{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="topbar-dropdown-footer">Mark all as read</div>
            </div>
          )}
        </div>

        {/* Upgrade button */}
        {!user?.isPremium && (
          <button className="btn btn-primary btn-sm upgrade-btn" onClick={() => navigate('/upgrade')}>
            Upgrade ✦
          </button>
        )}

        {/* Profile / Avatar */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          {user ? (
            <button className="topbar-avatar" onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} title="Profile">
              <div className="avatar avatar-sm">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <LogIn size={16} /> Sign In
            </Link>
          )}

          {showProfile && user && (
            <div className="topbar-dropdown animate-fadeIn" style={{ right: 0, width: 220 }}>
              <div className="topbar-dropdown-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-muted">{user.email}</span>
              </div>
              <button className="topbar-dropdown-item" onClick={() => { navigate('/settings'); setShowProfile(false); }}>
                <Settings size={16} style={{ color: 'var(--text-muted)' }} />
                <span>Settings</span>
              </button>
              <button className="topbar-dropdown-item" onClick={() => { navigate('/leaderboard'); setShowProfile(false); }}>
                <Star size={16} style={{ color: 'var(--text-muted)' }} />
                <span>Leaderboard</span>
              </button>
              <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0' }} />
              <button className="topbar-dropdown-item" onClick={handleLogout} style={{ color: 'var(--accent-red)' }}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
