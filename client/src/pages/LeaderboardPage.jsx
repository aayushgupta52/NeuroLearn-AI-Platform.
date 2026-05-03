import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Medal, Flame, Crown, ChevronUp } from 'lucide-react';
import './LeaderboardPage.css';

const demoUsers = [
  { id: '1', name: 'Aria Voss', xp: 28450, level: 32, streak: 45 },
  { id: '2', name: 'Lucas Chen', xp: 24200, level: 28, streak: 33 },
  { id: '3', name: 'Maya Singh', xp: 21800, level: 25, streak: 28 },
  { id: '4', name: 'Ethan Drake', xp: 19500, level: 22, streak: 21 },
  { id: '5', name: 'Sofia Reyes', xp: 17300, level: 20, streak: 19 },
  { id: '6', name: 'Noah Kim', xp: 15100, level: 18, streak: 15 },
  { id: '7', name: 'Olivia Chen', xp: 13800, level: 16, streak: 12 },
  { id: '8', name: 'Liam Park', xp: 12200, level: 14, streak: 10 },
  { id: '9', name: 'Emma Wilson', xp: 10500, level: 12, streak: 8 },
  { id: '10', name: 'Alex Thompson', xp: 9200, level: 11, streak: 6 },
];

const rankColors = ['#f59e0b', '#9ca3af', '#cd7f32'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState(demoUsers);

  useEffect(() => {
    userAPI.getLeaderboard().then(res => {
      if (res.data?.length) setUsers(res.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="leaderboard-page animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">🏆 Leaderboard</h1>
        <p className="page-subtitle">Top learners ranked by experience points.</p>
      </div>

      {/* Top 3 */}
      <div className="podium stagger">
        {users.slice(0, 3).map((u, i) => (
          <div key={u.id} className={`podium-card card animate-fadeInUp rank-${i + 1}`}>
            <div className="podium-rank" style={{color: rankColors[i]}}>
              {i === 0 ? <Crown size={24} /> : <Medal size={24} />}
            </div>
            <div className="avatar avatar-lg" style={{
              background: `linear-gradient(135deg, ${rankColors[i]}, ${rankColors[i]}88)`
            }}>
              {u.name[0]}
            </div>
            <h3>{u.name}</h3>
            <p className="text-sm text-muted">Level {u.level}</p>
            <div className="podium-xp">
              <span className="font-bold">{u.xp.toLocaleString()}</span>
              <span className="text-xs text-muted"> XP</span>
            </div>
            <div className="podium-streak">
              <Flame size={14} style={{color:'var(--accent-amber)'}} />
              <span className="text-xs">{u.streak} day streak</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full List */}
      <div className="card leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Learner</th>
              <th>Level</th>
              <th>XP</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className={`${u.id === user?.id ? 'current-user' : ''} animate-fadeInUp`}>
                <td>
                  <span className={`rank-badge ${i < 3 ? `top-${i+1}` : ''}`}>#{i + 1}</span>
                </td>
                <td>
                  <div className="leaderboard-user">
                    <div className="avatar avatar-sm">{u.name[0]}</div>
                    <span className="font-semibold">{u.name}</span>
                    {u.id === user?.id && <span className="badge badge-purple" style={{fontSize:'0.65rem'}}>YOU</span>}
                  </div>
                </td>
                <td><span className="text-sm">Lvl {u.level}</span></td>
                <td><span className="font-bold">{u.xp.toLocaleString()}</span></td>
                <td>
                  <div className="flex items-center gap-sm">
                    <Flame size={14} style={{color:'var(--accent-amber)'}} />
                    <span className="text-sm">{u.streak}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
