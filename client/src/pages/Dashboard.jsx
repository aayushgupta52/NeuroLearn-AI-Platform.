import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, courseAPI } from '../services/api';
import { BookOpen, Flame, Target, ChevronRight, Play, Sparkles, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import './Dashboard.css';

// Animated counter hook
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return value;
}

const DEFAULT_WEEKLY = [
  { day: 'Mon', xp: 320 },
  { day: 'Tue', xp: 480 },
  { day: 'Wed', xp: 180 },
  { day: 'Thu', xp: 560 },
  { day: 'Fri', xp: 420 },
  { day: 'Sat', xp: 0 },
  { day: 'Sun', xp: 0 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [barsVisible, setBarsVisible] = useState(false);
  const [planStep, setPlanStep] = useState(1);

  // Cycle AI plan step every 5s
  useEffect(() => {
    const interval = setInterval(() => setPlanStep(p => p < 3 ? p + 1 : 1), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, enrollRes] = await Promise.all([
          analyticsAPI.getOverview().catch(() => ({ data: null })),
          courseAPI.getEnrolled().catch(() => ({ data: [] }))
        ]);
        setOverview(analyticsRes.data);
        setEnrollments(enrollRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
    setTimeout(() => setBarsVisible(true), 400);
  }, []);

  const currentCourse = enrollments[0] || {
    courseId: 'demo-1',
    course: { title: 'Modern Web Development', modules: [{ title: 'Module 1: React Fundamentals' }] },
    progress: { percentage: 42, completedLessons: 10, totalLessons: 25 }
  };

  const userStreak = user?.streak || 5;
  const userXP     = user?.xp || 2450;
  const accuracy   = overview?.overview?.avgAccuracy || 84;
  const lessonsNum = overview?.overview?.totalLessonsCompleted || currentCourse?.progress?.completedLessons || 10;

  const animXP       = useCountUp(userXP);
  const animAccuracy = useCountUp(accuracy);
  const animLessons  = useCountUp(lessonsNum);

  const maxXP    = Math.max(...DEFAULT_WEEKLY.map(d => d.xp), 1);
  const weekDays = ['M','T','W','T','F','S','S'];
  const streakData = weekDays.map((d, i) => ({ day: d, active: i < Math.min(userStreak, 7) }));

  const weakAreas = overview?.weakAreas || [
    { topic: 'Dependency Arrays', accuracy: 45 },
    { topic: 'Closures in Hooks', accuracy: 62 },
    { topic: 'Context Provider',  accuracy: 78 },
  ];

  const studyPlan = [
    { day: 'Monday',   title: 'Advanced State Management', detail: 'Completed with 94% retention rate.' },
    { day: 'Today',    title: 'The Power of React Hooks',  detail: 'Focus: useMemo and useCallback optimization.' },
    { day: 'Tomorrow', title: 'Testing Custom Hooks',      detail: 'Being prepared by your AI Engine...' },
  ];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard animate-fadeIn">
      <div className="dashboard-welcome">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0] || 'Developer'}! 👋</h1>
          <p className="page-subtitle">Ready to master {currentCourse?.course?.title} today?</p>
        </div>
      </div>

      <div className="dashboard-grid">

        {/* ── Current Course ── */}
        <div className="card current-course-card">
          <span className="badge badge-purple">CURRENT PURSUIT</span>
          <h2>{currentCourse.course.title}</h2>
          <p className="text-muted text-sm">{currentCourse.course.modules?.[0]?.title || 'Module 1: Fundamentals'}</p>
          <div className="course-progress-info">
            <span className="font-bold">{currentCourse.progress.percentage}% Complete</span>
            <span className="text-muted text-sm">{currentCourse.progress.completedLessons}/{currentCourse.progress.totalLessons} Videos</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${currentCourse.progress.percentage}%`, transition: 'width 1.2s ease' }} />
          </div>
          <Link to={`/courses/${currentCourse.courseId}`} className="btn btn-primary" style={{ marginTop: 16 }}>
            <Play size={16} /> Resume Lesson
          </Link>
        </div>

        {/* ── Dynamic Weekly Activity ── */}
        <div className="card activity-card">
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <h3 className="font-bold flex-row" style={{ display:'flex', alignItems:'center', gap:8 }}>
              <TrendingUp size={18} style={{ color: 'var(--primary-500)' }} /> Weekly Activity
            </h3>
            <span className="live-badge"><span className="live-dot" />LIVE</span>
          </div>

          {/* Animated bar chart */}
          <div className="weekly-bars">
            {DEFAULT_WEEKLY.map((d, i) => (
              <div key={i} className="weekly-bar-col">
                <div className="weekly-bar-wrap">
                  <div
                    className={`weekly-bar ${d.xp > 0 ? 'active' : ''}`}
                    style={{
                      height: barsVisible && d.xp > 0 ? `${(d.xp / maxXP) * 100}%` : '4px',
                      transitionDelay: `${i * 80}ms`
                    }}
                  >
                    {barsVisible && d.xp > 0 && <span className="bar-tooltip">{d.xp}</span>}
                  </div>
                </div>
                <span className="weekly-bar-label">{d.day}</span>
              </div>
            ))}
          </div>

          {/* Streak dots */}
          <div className="streak-days" style={{ marginTop: 16 }}>
            {streakData.map((d, i) => (
              <div key={i} className={`streak-day ${d.active ? 'active' : ''}`} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="streak-dot" />
                <span>{d.day}</span>
              </div>
            ))}
          </div>
          <p className="streak-message" style={{ marginTop: 10 }}>
            🔥 <span className="font-bold" style={{ color: 'var(--accent-amber)' }}>{userStreak}-day streak</span>
            &nbsp;·&nbsp;
            <span style={{ color: 'var(--primary-500)' }}>{animXP.toLocaleString()} XP</span> earned this week
          </p>
        </div>

        {/* ── Dynamic AI Curated Path ── */}
        <div className="card study-plan-card">
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <h3 style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Sparkles size={18} style={{ color: 'var(--primary-500)' }} /> AI-Curated Path
            </h3>
            <span className="live-badge"><span className="live-dot" />AI ACTIVE</span>
          </div>

          <div className="study-plan-timeline">
            {studyPlan.map((item, i) => {
              const isCompleted = i < planStep - 1;
              const isActive    = i === planStep - 1;
              const status      = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';
              return (
                <div key={i} className={`timeline-item ${status}`}>
                  <div className="timeline-marker">
                    {isCompleted
                      ? <CheckCircle size={18} />
                      : <span className="timeline-num">{String(i + 1).padStart(2, '0')}</span>}
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-day">
                      {item.day}
                      {isActive && <span className="badge badge-green" style={{ marginLeft: 8, animation:'pulse 2s infinite' }}>IN PROGRESS</span>}
                    </span>
                    <h4>{item.title}</h4>
                    <p className="text-sm text-muted">{item.detail}</p>
                    {isActive && (
                      <div className="ai-thinking">
                        <span /><span /><span />
                        <span className="text-xs text-muted" style={{ marginLeft: 8 }}>AI analyzing your progress...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Weak Areas ── */}
        <div className="card weak-areas-card">
          <h3><Target size={18} style={{ color: 'var(--accent-red)' }} /> Precision Focus</h3>
          <p className="text-sm text-muted" style={{ marginBottom: 16 }}>AI detected these areas need attention.</p>
          <div className="weak-areas-list">
            {weakAreas.map((area, i) => {
              const color = area.accuracy < 50 ? 'var(--accent-red)' : area.accuracy < 70 ? 'var(--accent-amber)' : 'var(--accent-blue)';
              return (
                <div key={i} className="weak-area-item card-interactive">
                  <div className="weak-area-dot" style={{ background: color }} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{area.topic}</p>
                    <div className="weak-area-bar">
                      <div className="weak-area-fill" style={{ width: `${area.accuracy}%`, background: color }} />
                    </div>
                  </div>
                  <span className="text-xs font-semibold" style={{ color }}>{area.accuracy}%</span>
                  <ChevronRight size={16} className="text-muted" />
                </div>
              );
            })}
          </div>
          <Link to="/analytics" className="start-drill-link">
            Start Personalized Drill <Zap size={14} />
          </Link>
        </div>

        {/* ── Quick Stats with animated counters ── */}
        <div className="quick-stats">
          {[
            { icon: Target,   color: '#7c3aed', bg: 'rgba(124,58,237,0.1)',  value: `${animAccuracy}%`,           label: 'Overall Accuracy' },
            { icon: Zap,      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  value: animXP.toLocaleString(),      label: 'Total XP' },
            { icon: BookOpen, color: '#10b981', bg: 'rgba(16,185,129,0.1)',  value: animLessons,                  label: 'Lessons Done' },
            { icon: Flame,    color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   value: userStreak,                   label: 'Day Streak' },
          ].map((s, i) => (
            <div key={i} className="stat-card card">
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
