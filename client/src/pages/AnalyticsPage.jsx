import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Target, Zap, Clock, Download, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './AnalyticsPage.css';

const weeklyData = [
  { day: 'Mon', videos: 3, xp: 320, hours: 0.5 },
  { day: 'Tue', videos: 5, xp: 480, hours: 1.2 },
  { day: 'Wed', videos: 2, xp: 280, hours: 0.4 },
  { day: 'Thu', videos: 6, xp: 560, hours: 1.5 },
  { day: 'Fri', videos: 4, xp: 420, hours: 1.0 },
  { day: 'Sat', videos: 3, xp: 350, hours: 0.8 },
  { day: 'Sun', videos: 2, xp: 290, hours: 0.5 },
];

const skillData = [
  { name: 'React Fundas', value: 45 },
  { name: 'Hooks Mastery', value: 25 },
  { name: 'App Routing', value: 15 },
  { name: 'State Mgmt', value: 15 },
];

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [timeRange, setTimeRange] = useState('7');

  useEffect(() => {
    analyticsAPI.getOverview().then(res => setOverview(res.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Platform Accuracy', value: `${overview?.overview?.avgAccuracy || 88}%`, sub: 'Compared to peers: Top 12%', icon: Target, color: '#7c3aed', highlight: 'Excellent' },
    { label: 'Total Experience', value: (user?.xp || 2450).toLocaleString(), sub: 'Points this month', icon: Zap, color: '#f59e0b', highlight: '+450 XP this week' },
    { label: 'Video Engagement', value: `${overview?.overview?.totalStudyTime || 25}`, sub: 'Videos watched entirely', icon: Clock, color: '#10b981', highlight: '2.5 hrs / week Average' },
  ];

  return (
    <div className="analytics-page animate-fadeIn">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Learning Velocity Analytics</h1>
          <p className="page-subtitle">Granular real-time data on your curriculum journey.</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="time-range-select" style={{background: 'var(--bg-secondary)', padding: '6px 16px', borderRadius: 'var(--radius-full)'}}>
            <Calendar size={16} className="text-muted" />
            <select value={timeRange} onChange={e => setTimeRange(e.target.value)} style={{padding:'4px 8px', border:'none', background:'transparent', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer'}}>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>
          <button className="btn btn-primary btn-icon"><Download size={18} /></button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="analytics-stats stagger">
        {stats.map((s, i) => (
          <div key={i} className="analytics-stat-card card animate-fadeInUp">
            <div className="flex items-center justify-between" style={{marginBottom:'16px'}}>
              <div className="stat-icon" style={{background:`${s.color}15`, color:s.color}}>
                <s.icon size={22} />
              </div>
              <span className="text-xs font-semibold" style={{color: s.color, background: s.color+'15', padding: '4px 8px', borderRadius: '4px'}}>{s.highlight}</span>
            </div>
            <p className="analytics-stat-value" style={{fontSize: '2rem', fontWeight: '800'}}>{s.value}</p>
            <p className="analytics-stat-label" style={{color: 'var(--text-primary)', fontWeight: '600', marginTop: '8px'}}>{s.label}</p>
            <p className="text-xs text-muted" style={{marginTop: '4px'}}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="analytics-bottom-grid" style={{gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', marginTop: '24px'}}>
        
        {/* Learning Velocity Chart */}
        <div className="card chart-card flex flex-col">
          <div className="chart-header mb-8">
            <div>
              <h3>Engagement Metrics</h3>
              <p className="text-sm text-muted">Daily XP relative to videos watched.</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot" style={{background:'var(--primary-500)'}} /> XP Earned</span>
              <span className="legend-item"><span className="legend-dot" style={{background:'var(--accent-green)'}} /> Videos Compl.</span>
            </div>
          </div>
          <div style={{flex: 1, minHeight: '300px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{stroke: 'var(--border-color)', strokeWidth: 1, strokeDasharray: '4 4'}}
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-lg)' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#7c3aed" fill="url(#xpGrad)" strokeWidth={3} />
                <Area type="monotone" dataKey="videos" yAxisId="1" stroke="#10b981" fill="transparent" strokeWidth={3} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Skill Distribution */}
          <div className="card" style={{flex: 1}}>
            <h3>Focus Distribution</h3>
            <p className="text-sm text-muted" style={{marginBottom:'24px'}}>Your time spent across core modules.</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={skillData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                  {skillData.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                </Pie>
                <Tooltip contentStyle={{background: 'var(--bg-card)', border: 'none', borderRadius: '4px'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="skill-legend" style={{marginTop: '20px'}}>
              {skillData.map((s, i) => (
                <div key={i} className="skill-legend-item flex items-center justify-between" style={{padding: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', marginBottom: '8px'}}>
                  <div className="flex items-center gap-2">
                    <span className="legend-dot" style={{background: COLORS[i], width: '10px', height: '10px'}} />
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  <span className="text-sm font-bold">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA */}
          {!user?.isPremium && (
            <div className="card" style={{background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid var(--primary-500)'}}>
              <span className="badge badge-purple mb-3">PRO PLAN</span>
              <h3 style={{fontSize: '1.2rem'}}>Unlock deep neural analysis</h3>
              <p className="text-sm text-muted mt-2 mb-4">View complex multi-variate modeling of your retention rate over the long timeframe.</p>
              <button className="btn btn-primary w-full justify-center" onClick={() => navigate('/upgrade')}>Explore NeuroLearn Pro</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
