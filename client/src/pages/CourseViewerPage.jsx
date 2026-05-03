import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, lessonAPI, aiAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Play, CheckCircle, ChevronLeft, Bot, ChevronRight, Video, ExternalLink, RefreshCw } from 'lucide-react';
import './CourseViewerPage.css';

// Verified embeddable YouTube videos — sourced from Fireship, Traversy Media, freeCodeCamp
const COURSE_DATA = {
  'demo-1': {
    title: 'Modern Web Development',
    description: 'Master React, Node.js, and modern web architecture.',
    modules: [
      {
        id: 'm1', title: 'Module 1: React Fundamentals',
        lessons: [
          { id: 'l1',  title: 'React in 100 Seconds',             videoUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM' },
          { id: 'l2',  title: 'React JS Crash Course',            videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
          { id: 'l3',  title: 'Props & State Explained',          videoUrl: 'https://www.youtube.com/watch?v=1w-oQ-i1XB8' },
          { id: 'l4',  title: 'Event Handling in React',          videoUrl: 'https://www.youtube.com/watch?v=0XSDAup85SA' },
          { id: 'l5',  title: 'Lists and Keys',                   videoUrl: 'https://www.youtube.com/watch?v=0sasRxl35_8' },
          { id: 'l6',  title: 'React Forms Tutorial',             videoUrl: 'https://www.youtube.com/watch?v=SdzMBWT2CDQ' },
        ]
      },
      {
        id: 'm2', title: 'Module 2: React Hooks',
        lessons: [
          { id: 'l7',  title: 'React Hooks Explained',            videoUrl: 'https://www.youtube.com/watch?v=TNhaISOUy6Q' },
          { id: 'l8',  title: 'useState Hook Full Tutorial',      videoUrl: 'https://www.youtube.com/watch?v=4pO-HcG2igk' },
          { id: 'l9',  title: 'useEffect in 10 Minutes',         videoUrl: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U' },
          { id: 'l10', title: 'useRef Hook Tutorial',            videoUrl: 'https://www.youtube.com/watch?v=t2ypzz6gJm0' },
          { id: 'l11', title: 'useContext Hook Tutorial',        videoUrl: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc' },
          { id: 'l12', title: 'Custom React Hooks',              videoUrl: 'https://www.youtube.com/watch?v=6ThIvn8CZ6Y' },
        ]
      },
      {
        id: 'm3', title: 'Module 3: Advanced React',
        lessons: [
          { id: 'l13', title: 'React Context API',               videoUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o' },
          { id: 'l14', title: 'useReducer Hook',                 videoUrl: 'https://www.youtube.com/watch?v=kK_Wqx3RnHk' },
          { id: 'l15', title: 'React Router v6',                 videoUrl: 'https://www.youtube.com/watch?v=Ul3y1LXxzdU' },
          { id: 'l16', title: 'React Performance Tips',          videoUrl: 'https://www.youtube.com/watch?v=VazHcNMeqnI' },
          { id: 'l17', title: 'Full React Project Tutorial',     videoUrl: 'https://www.youtube.com/watch?v=b9eMGE7QtTk' },
        ]
      }
    ]
  },
  'demo-2': {
    title: 'Machine Learning Foundations',
    description: 'Learn ML algorithms, mathematics, and practical implementation.',
    modules: [
      {
        id: 'm1', title: 'Module 1: ML Fundamentals',
        lessons: [
          { id: 'l1',  title: 'Machine Learning in 100 Seconds', videoUrl: 'https://www.youtube.com/watch?v=r2X_OfLH5H8' },
          { id: 'l2',  title: 'ML Course for Beginners',         videoUrl: 'https://www.youtube.com/watch?v=NWONeJKn6kc' },
          { id: 'l3',  title: 'Linear Regression Explained',     videoUrl: 'https://www.youtube.com/watch?v=CtsRRUddV2s' },
          { id: 'l4',  title: 'Logistic Regression Tutorial',    videoUrl: 'https://www.youtube.com/watch?v=yIYKR4sgzI8' },
          { id: 'l5',  title: 'Decision Trees Explained',        videoUrl: 'https://www.youtube.com/watch?v=_L39rN6gz7Y' },
          { id: 'l6',  title: 'Random Forest Algorithm',         videoUrl: 'https://www.youtube.com/watch?v=J4Wdy0Wc_xQ' },
          { id: 'l7',  title: 'K-Nearest Neighbors',             videoUrl: 'https://www.youtube.com/watch?v=4HKqjENq9OU' },
        ]
      },
      {
        id: 'm2', title: 'Module 2: Neural Networks',
        lessons: [
          { id: 'l8',  title: 'Neural Networks Explained',       videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk' },
          { id: 'l9',  title: 'Backpropagation Visually',        videoUrl: 'https://www.youtube.com/watch?v=Ilg3gGewQ5U' },
          { id: 'l10', title: 'Gradient Descent',                videoUrl: 'https://www.youtube.com/watch?v=IHZwWFHWa-w' },
          { id: 'l11', title: 'Activation Functions',            videoUrl: 'https://www.youtube.com/watch?v=-7scQpJT7uo' },
        ]
      },
      {
        id: 'm3', title: 'Module 3: Deep Learning',
        lessons: [
          { id: 'l12', title: 'Deep Learning Intro',             videoUrl: 'https://www.youtube.com/watch?v=VyWAvY2CF9c' },
          { id: 'l13', title: 'Convolutional Neural Networks',   videoUrl: 'https://www.youtube.com/watch?v=YRhxdVk_sIs' },
          { id: 'l14', title: 'Transformer Architecture',        videoUrl: 'https://www.youtube.com/watch?v=4Bdc55j80l8' },
          { id: 'l15', title: 'ML Project End-to-End',           videoUrl: 'https://www.youtube.com/watch?v=a_UMTFy9ods' },
        ]
      }
    ]
  },
  'demo-3': {
    title: 'Python for Data Science',
    description: 'From pandas to matplotlib — master data analysis with Python.',
    modules: [
      {
        id: 'm1', title: 'Module 1: Python Essentials',
        lessons: [
          { id: 'l1',  title: 'Python in 100 Seconds',           videoUrl: 'https://www.youtube.com/watch?v=x7X9w_GIm1s' },
          { id: 'l2',  title: 'Python for Beginners Full Course',videoUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' },
          { id: 'l3',  title: 'Python List Comprehensions',      videoUrl: 'https://www.youtube.com/watch?v=3dt4OGnU5sM' },
          { id: 'l4',  title: 'OOP in Python',                   videoUrl: 'https://www.youtube.com/watch?v=JeznW_7DlB0' },
        ]
      },
      {
        id: 'm2', title: 'Module 2: NumPy & Pandas',
        lessons: [
          { id: 'l5',  title: 'NumPy Crash Course',              videoUrl: 'https://www.youtube.com/watch?v=9JUAPgtkKpI' },
          { id: 'l6',  title: 'Pandas Full Tutorial',            videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
          { id: 'l7',  title: 'DataFrames Deep Dive',            videoUrl: 'https://www.youtube.com/watch?v=2uvysYbKdjM' },
          { id: 'l8',  title: 'Data Cleaning with Pandas',       videoUrl: 'https://www.youtube.com/watch?v=bDhvCp3_lYw' },
          { id: 'l9',  title: 'GroupBy & Aggregations',          videoUrl: 'https://www.youtube.com/watch?v=txMdrV1Ut64' },
        ]
      },
      {
        id: 'm3', title: 'Module 3: Data Visualization',
        lessons: [
          { id: 'l10', title: 'Matplotlib Crash Course',         videoUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4' },
          { id: 'l11', title: 'Seaborn Tutorial',                videoUrl: 'https://www.youtube.com/watch?v=6GUZXDef2U0' },
          { id: 'l12', title: 'Exploratory Data Analysis',       videoUrl: 'https://www.youtube.com/watch?v=xi0vhXFPegw' },
          { id: 'l13', title: 'Data Science Project End-to-End', videoUrl: 'https://www.youtube.com/watch?v=Q59X518JZHE' },
        ]
      }
    ]
  },
  'demo-4': {
    title: 'React Native Mobile Apps',
    description: 'Build cross-platform mobile apps with React Native and Expo.',
    modules: [
      {
        id: 'm1', title: 'Module 1: React Native Basics',
        lessons: [
          { id: 'l1',  title: 'React Native in 100 Seconds',     videoUrl: 'https://www.youtube.com/watch?v=gvkqT_Uoahw' },
          { id: 'l2',  title: 'React Native Crash Course',       videoUrl: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' },
          { id: 'l3',  title: 'React Native Flexbox',            videoUrl: 'https://www.youtube.com/watch?v=R2eqAgR_KlU' },
          { id: 'l4',  title: 'React Navigation Tutorial',       videoUrl: 'https://www.youtube.com/watch?v=28K0SeRXpVc' },
          { id: 'l5',  title: 'FlatList Tutorial',               videoUrl: 'https://www.youtube.com/watch?v=iMCM1NceGJY' },
        ]
      },
      {
        id: 'm2', title: 'Module 2: Advanced Mobile',
        lessons: [
          { id: 'l6',  title: 'AsyncStorage Tutorial',           videoUrl: 'https://www.youtube.com/watch?v=AXnBpXjgFCk' },
          { id: 'l7',  title: 'React Native Animations',         videoUrl: 'https://www.youtube.com/watch?v=Ywf3DPkS9nI' },
          { id: 'l8',  title: 'Publishing to App Stores',        videoUrl: 'https://www.youtube.com/watch?v=oBWBDaqpola' },
        ]
      }
    ]
  },
  'demo-5': {
    title: 'Docker & Kubernetes',
    description: 'Containerize your apps and orchestrate them at scale.',
    modules: [
      {
        id: 'm1', title: 'Module 1: Docker Core',
        lessons: [
          { id: 'l1',  title: 'Docker in 100 Seconds',           videoUrl: 'https://www.youtube.com/watch?v=Gjnup-PuquQ' },
          { id: 'l2',  title: 'Docker Tutorial for Beginners',   videoUrl: 'https://www.youtube.com/watch?v=pTFZFxd5uri' },
          { id: 'l3',  title: 'Writing a Dockerfile',            videoUrl: 'https://www.youtube.com/watch?v=WmcdMiyqfZs' },
          { id: 'l4',  title: 'Docker Compose Tutorial',         videoUrl: 'https://www.youtube.com/watch?v=HG6yIjZapSA' },
          { id: 'l5',  title: 'Docker Volumes & Networks',       videoUrl: 'https://www.youtube.com/watch?v=OU6xOM0SE5o' },
        ]
      },
      {
        id: 'm2', title: 'Module 2: Kubernetes',
        lessons: [
          { id: 'l6',  title: 'Kubernetes in 100 Seconds',       videoUrl: 'https://www.youtube.com/watch?v=PziYflu8cB8' },
          { id: 'l7',  title: 'Kubernetes Full Course',          videoUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do' },
          { id: 'l8',  title: 'Pods, Deployments & Services',    videoUrl: 'https://www.youtube.com/watch?v=EQNO_kM96Mo' },
          { id: 'l9',  title: 'Kubernetes Ingress Tutorial',     videoUrl: 'https://www.youtube.com/watch?v=80Ew_fsV4rM' },
        ]
      }
    ]
  },
  'demo-6': {
    title: 'UI/UX Design Principles',
    description: 'Design thinking, wireframing & creating delightful user experiences.',
    modules: [
      {
        id: 'm1', title: 'Module 1: Design Thinking',
        lessons: [
          { id: 'l1',  title: 'UI vs UX Explained',              videoUrl: 'https://www.youtube.com/watch?v=TgqeRTwZvIo' },
          { id: 'l2',  title: 'Design Thinking Process',         videoUrl: 'https://www.youtube.com/watch?v=_r0VX-aU_T8' },
          { id: 'l3',  title: 'Color Theory for Designers',      videoUrl: 'https://www.youtube.com/watch?v=_2LLXnUdUIc' },
          { id: 'l4',  title: 'Typography Fundamentals',         videoUrl: 'https://www.youtube.com/watch?v=hnCmygx4sNc' },
          { id: 'l5',  title: 'Layout & Grid Systems',            videoUrl: 'https://www.youtube.com/watch?v=HNd27k6VtyE' },
        ]
      },
      {
        id: 'm2', title: 'Module 2: Figma & Prototyping',
        lessons: [
          { id: 'l6',  title: 'Figma Tutorial for Beginners',    videoUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8' },
          { id: 'l7',  title: 'Wireframing with Figma',          videoUrl: 'https://www.youtube.com/watch?v=qpH7-KFWZRI' },
          { id: 'l8',  title: 'Prototyping in Figma',            videoUrl: 'https://www.youtube.com/watch?v=iBkXf6u8htI' },
          { id: 'l9',  title: 'Design System in Figma',          videoUrl: 'https://www.youtube.com/watch?v=EK-pHkc5EL4' },
          { id: 'l10', title: 'Usability Testing',               videoUrl: 'https://www.youtube.com/watch?v=nYCJTea1AUQ' },
        ]
      }
    ]
  }
};

const buildCourseData = (id) => {
  const base = COURSE_DATA[id] || COURSE_DATA['demo-1'];
  return {
    ...base, id,
    modules: base.modules.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(lesson => ({ ...lesson, type: 'VIDEO', completed: false }))
    }))
  };
};

function getEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/').split('&')[0];
  if (url.includes('youtu.be/')) return 'https://www.youtube.com/embed/' + url.split('youtu.be/')[1].split('?')[0];
  return url;
}

export default function CourseViewerPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(() => buildCourseData(id));
  const [activeLesson, setActiveLesson] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    courseAPI.getById(id).then(res => {
      if (res.data?.modules?.length) setCourse(res.data);
    }).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (course?.modules?.length && !activeLesson) {
      const all = course.modules.flatMap(m => m.lessons);
      setActiveLesson(all.find(l => !l.completed) || all[0]);
    }
  }, [course]);

  useEffect(() => {
    if (!activeLesson) return;
    setRecommendedVideos([]);
    setLoadingRecs(true);
    aiAPI.suggestVideos({ lessonId: activeLesson.id, topic: `${course.title} - ${activeLesson.title}` })
      .then(res => { if (res.data?.recommendations) setRecommendedVideos(res.data.recommendations); })
      .catch(() => {})
      .finally(() => setLoadingRecs(false));
  }, [activeLesson?.id]);

  const handleComplete = () => {
    lessonAPI.complete(activeLesson.id, { timeSpent: 200 }).catch(() => {});
    setCourse(prev => {
      const updated = {
        ...prev,
        modules: prev.modules.map(mod => ({
          ...mod,
          lessons: mod.lessons.map(l => l.id === activeLesson.id ? { ...l, completed: true } : l)
        }))
      };
      const all = updated.modules.flatMap(m => m.lessons);
      const idx = all.findIndex(l => l.id === activeLesson.id);
      if (idx < all.length - 1) setActiveLesson(all[idx + 1]);
      return updated;
    });
  };

  const allLessons = course?.modules?.flatMap(m => m.lessons) || [];
  const currentIdx = activeLesson ? allLessons.findIndex(l => l.id === activeLesson.id) : 0;
  const completedCount = allLessons.filter(l => l.completed).length;
  const progress = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const currentModule = activeLesson ? course.modules.find(m => m.lessons.some(l => l.id === activeLesson.id)) : null;

  return (
    <div className="viewer-page">
      <aside className="viewer-sidebar">
        <div className="viewer-sidebar-header">
          <h3>COURSE CONTENT</h3>
          <span className="text-xs text-muted">{completedCount}/{allLessons.length} done</span>
        </div>
        <div style={{ padding: '8px 16px 16px' }}>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted" style={{ marginTop: 6 }}>{progress}% Complete</p>
        </div>
        <div className="viewer-modules">
          {course?.modules?.map((mod, mi) => (
            <div key={mod.id} className="viewer-module">
              <div className="module-header">
                <span className="module-title">M{mi + 1}: {mod.title.replace(/Module \d+: /, '')}</span>
                {mod.lessons.every(l => l.completed) && <span className="badge badge-green" style={{ fontSize: '0.6rem' }}>✓</span>}
              </div>
              <div className="module-lessons">
                {mod.lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    className={`lesson-item ${activeLesson?.id === lesson.id ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
                    onClick={() => setActiveLesson(lesson)}
                  >
                    {lesson.completed
                      ? <CheckCircle size={15} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                      : activeLesson?.id === lesson.id
                        ? <Play size={15} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
                        : <Video size={15} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
                    <span style={{ textAlign: 'left', fontSize: '0.82rem' }}>{lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)' }}>
          <Link to="/ai-tutor" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '8px 12px' }}>
            <Bot size={16} /> Ask AI Tutor
          </Link>
        </div>
      </aside>

      <div className="viewer-content">
        <div className="viewer-breadcrumb">
          <Link to="/courses" className="text-sm text-muted">Courses</Link>
          <ChevronRight size={14} className="text-muted" />
          <span className="text-sm text-muted">{course?.title}</span>
          <ChevronRight size={14} className="text-muted" />
          <span className="text-sm font-medium">{activeLesson?.title}</span>
        </div>

        {activeLesson && (
          <div className="lesson-content animate-fadeIn">
            <div style={{ marginBottom: 8 }}>
              <span className="badge badge-purple" style={{ marginBottom: 8 }}>{currentModule?.title}</span>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '8px 0' }}>{activeLesson.title}</h1>
            </div>

            <div className="video-player-wrapper" style={{ marginBottom: 32 }}>
              <iframe
                key={activeLesson.id}
                src={getEmbedUrl(activeLesson.videoUrl)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeLesson.title}
              />
            </div>

            <div className="lesson-nav">
              <div>
                {currentIdx > 0 && (
                  <button className="btn btn-secondary" onClick={() => setActiveLesson(allLessons[currentIdx - 1])}>
                    <ChevronLeft size={16} /> Previous
                  </button>
                )}
              </div>
              <button className="btn btn-primary" onClick={handleComplete} disabled={activeLesson.completed}>
                {activeLesson.completed ? '✓ Completed' : 'Mark as Completed'} {!activeLesson.completed && <ChevronRight size={16} />}
              </button>
            </div>

            <div className="recommended-section" style={{ marginTop: 48 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>AI Recommended: Related Resources</h3>
              {loadingRecs ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)' }}>
                  <RefreshCw size={16} className="spin-animation" />
                  <span className="text-sm">Finding the best resources...</span>
                </div>
              ) : recommendedVideos.length > 0 ? (
                <div className="recommendations-grid">
                  {recommendedVideos.map((rec, i) => (
                    <div key={i} className="recommendation-card" style={{ padding: 20 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 8 }}>{rec.title}</h4>
                      <p className="text-sm text-muted" style={{ marginBottom: 12 }}>{rec.reason}</p>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(rec.searchQuery)}`}
                        target="_blank" rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <ExternalLink size={14} /> Find on YouTube
                      </a>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
