import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { userAPI } from '../services/api';
import { User, Mail, Lock, Moon, Sun, Bell, Shield, CreditCard, Save, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('profile');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userAPI.updateProfile({ name });
      updateUser({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userAPI.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: isDark ? Moon : Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="settings-page animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and profile.</p>
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`settings-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {tab === 'profile' && (
            <div className="settings-section card animate-fadeInUp">
              <h2>Profile Information</h2>
              <p className="text-sm text-muted" style={{marginBottom:'24px'}}>Update your personal details and public profile.</p>

              <div className="profile-avatar-section">
                <div className="avatar avatar-xl">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-muted">Level {user?.level || 1} • {user?.xp || 0} XP</p>
                  <button className="btn btn-ghost btn-sm" style={{marginTop:'8px'}}>Change Avatar</button>
                </div>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="settings-form-grid">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input type="email" className="input" value={user?.email || ''} disabled />
                  </div>
                  <div className="input-group">
                    <label>Role</label>
                    <input type="text" className="input" value={user?.role || 'STUDENT'} disabled />
                  </div>
                  <div className="input-group">
                    <label>Plan</label>
                    <input type="text" className="input" value={user?.isPremium ? 'Premium' : 'Free'} disabled />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{marginTop:'20px'}} disabled={saving}>
                  {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                </button>
              </form>
            </div>
          )}

          {tab === 'account' && (
            <div className="settings-section card animate-fadeInUp">
              <h2>Security</h2>
              <p className="text-sm text-muted" style={{marginBottom:'24px'}}>Change your password and manage security settings.</p>
              <form onSubmit={handleChangePassword}>
                <div className="settings-form-grid" style={{gridTemplateColumns:'1fr'}}>
                  <div className="input-group">
                    <label>Current Password</label>
                    <input type="password" className="input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>New Password</label>
                    <input type="password" className="input" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={6} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{marginTop:'20px'}} disabled={saving}>
                  <Lock size={16} /> Update Password
                </button>
              </form>
            </div>
          )}

          {tab === 'appearance' && (
            <div className="settings-section card animate-fadeInUp">
              <h2>Appearance</h2>
              <p className="text-sm text-muted" style={{marginBottom:'24px'}}>Customize the look and feel of your interface.</p>
              <div className="appearance-option">
                <div>
                  <p className="font-semibold">Dark Mode</p>
                  <p className="text-sm text-muted">Switch between light and dark themes.</p>
                </div>
                <button className={`toggle-switch ${isDark ? 'active' : ''}`} onClick={toggleTheme}>
                  <div className="toggle-thumb" />
                </button>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="settings-section card animate-fadeInUp">
              <h2>Notifications</h2>
              <p className="text-sm text-muted" style={{marginBottom:'24px'}}>Manage your notification preferences.</p>
              {['Email notifications', 'Push notifications', 'Weekly progress report', 'Achievement alerts', 'Study reminders'].map((item) => (
                <div key={item} className="appearance-option">
                  <p className="font-medium text-sm">{item}</p>
                  <button className="toggle-switch active"><div className="toggle-thumb" /></button>
                </div>
              ))}
            </div>
          )}

          {tab === 'billing' && (
            <div className="settings-section card animate-fadeInUp">
              <h2>Billing & Plan</h2>
              <p className="text-sm text-muted" style={{marginBottom:'24px'}}>Manage your subscription and payment methods.</p>
              <div className="current-plan-card">
                <div>
                  <span className="badge badge-purple">{user?.isPremium ? 'PREMIUM' : 'FREE PLAN'}</span>
                  <h3 style={{marginTop:'8px'}}>{user?.isPremium ? '$29/month' : '$0/month'}</h3>
                  <p className="text-sm text-muted">
                    {user?.isPremium ? 'Full access to all features.' : 'Limited access. Upgrade for full features.'}
                  </p>
                </div>
                {!user?.isPremium && (
                  <button className="btn btn-primary" onClick={() => navigate('/upgrade')}>
                    <ExternalLink size={16} /> Upgrade to Premium
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
