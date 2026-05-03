import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, BookOpen, Users, Clock, ChevronRight, Star, Play } from 'lucide-react';
import './CoursesPage.css';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Machine Learning', 'Mobile Development', 'DevOps', 'Design'];

// Beautiful course thumbnails — each with a unique icon, gradient, and label
const COURSE_THUMBS = {
  'demo-1': {
    emoji: '⚛️',
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)',
    tag: 'REACT & NODE.JS',
    lessons: 21
  },
  'demo-2': {
    emoji: '🤖',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    tag: 'ALGORITHMS & MODELS',
    lessons: 19
  },
  'demo-3': {
    emoji: '🐍',
    gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
    tag: 'PANDAS · NUMPY · MATPLOTLIB',
    lessons: 17
  },
  'demo-4': {
    emoji: '📱',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    tag: 'REACT NATIVE & EXPO',
    lessons: 12
  },
  'demo-5': {
    emoji: '🐳',
    gradient: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
    tag: 'DOCKER · KUBERNETES',
    lessons: 13
  },
  'demo-6': {
    emoji: '🎨',
    gradient: 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)',
    tag: 'FIGMA · UX RESEARCH',
    lessons: 12
  },
};

const demoCourses = [
  { id: 'demo-1', title: 'Modern Web Development', description: 'Master React, Node.js, and modern web architecture from the ground up.', category: 'Web Development', difficulty: 'MEDIUM', modules: [{_count:{lessons:8}},{_count:{lessons:6}},{_count:{lessons:7}}], _count: { enrollments: 1240 } },
  { id: 'demo-2', title: 'Machine Learning Foundations', description: 'Learn the mathematical foundations and practical applications of ML algorithms.', category: 'Machine Learning', difficulty: 'HARD', modules: [{_count:{lessons:8}},{_count:{lessons:5}},{_count:{lessons:6}}], _count: { enrollments: 890 } },
  { id: 'demo-3', title: 'Python for Data Science', description: 'From pandas to matplotlib — everything you need for data analysis.', category: 'Data Science', difficulty: 'EASY', modules: [{_count:{lessons:6}},{_count:{lessons:6}},{_count:{lessons:5}}], _count: { enrollments: 2100 } },
  { id: 'demo-4', title: 'React Native Mobile Apps', description: 'Build cross-platform mobile apps with React Native and Expo.', category: 'Mobile Development', difficulty: 'MEDIUM', modules: [{_count:{lessons:7}},{_count:{lessons:5}}], _count: { enrollments: 670 } },
  { id: 'demo-5', title: 'Docker & Kubernetes', description: 'Containerize your apps and orchestrate them at scale.', category: 'DevOps', difficulty: 'HARD', modules: [{_count:{lessons:7}},{_count:{lessons:6}}], _count: { enrollments: 540 } },
  { id: 'demo-6', title: 'UI/UX Design Principles', description: 'Learn design thinking, wireframing, and creating delightful user experiences.', category: 'Design', difficulty: 'EASY', modules: [{_count:{lessons:6}},{_count:{lessons:6}}], _count: { enrollments: 980 } },
];

const diffBadge = { EASY: 'badge-green', MEDIUM: 'badge-amber', HARD: 'badge-red' };
const diffLabel = { EASY: 'Beginner', MEDIUM: 'Intermediate', HARD: 'Advanced' };

export default function CoursesPage() {
  const [courses, setCourses] = useState(demoCourses);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    courseAPI.getAll().then(res => {
      if (res.data?.length) setCourses(res.data);
    }).catch(() => {});
  }, []);

  const filtered = courses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="courses-page animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Course Catalog</h1>
        <p className="page-subtitle">Explore our curated collection of courses designed by industry experts.</p>
      </div>

      <div className="courses-filters">
        <div className="courses-search">
          <Search size={18} className="search-icon" />
          <input type="text" className="input" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`category-pill ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="courses-grid stagger">
        {filtered.map((course, i) => {
          const thumb = COURSE_THUMBS[course.id] || {
            emoji: '📚', gradient: 'linear-gradient(135deg, #6d28d9, #4f46e5)', tag: course.category?.toUpperCase(), lessons: 15
          };
          const totalLessons = course.modules?.reduce((s, m) => s + (m._count?.lessons || 0), 0) || thumb.lessons;

          return (
            <Link to={`/courses/${course.id}`} key={course.id} className="course-card card animate-fadeInUp">
              {/* Thumbnail */}
              <div className="course-thumb" style={{ background: thumb.gradient }}>
                <div className="course-thumb-emoji">{thumb.emoji}</div>
                <div className="course-thumb-tag">{thumb.tag}</div>
                <div className="course-thumb-play">
                  <Play size={20} fill="white" />
                </div>
              </div>

              {/* Body */}
              <div className="course-card-body">
                <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                  <span className={`badge ${diffBadge[course.difficulty]}`}>{diffLabel[course.difficulty]}</span>
                  <span className="text-xs text-muted flex items-center gap-sm">
                    <Users size={12} /> {course._count?.enrollments?.toLocaleString()}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>{course.title}</h3>
                <p className="text-sm text-muted" style={{ marginBottom: 16, lineHeight: 1.5 }}>{course.description}</p>
                <div className="course-card-meta">
                  <span className="text-xs flex items-center gap-1">
                    <BookOpen size={12} /> {course.modules?.length || 2} Modules
                  </span>
                  <span className="text-xs flex items-center gap-1">
                    <Clock size={12} /> {totalLessons} Videos
                  </span>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-amber)' }}>
                    <Star size={12} fill="currentColor" /> 4.{8 + (i % 2)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
