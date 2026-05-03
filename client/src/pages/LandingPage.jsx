import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, Brain, Target, BarChart3, Bot, Trophy, ChevronRight, Star, Check, ArrowRight, Moon, Sun, BookOpen, Users, Sparkles } from 'lucide-react';
import './LandingPage.css';

const features = [
  { icon: Bot, title: 'The AI Tutor', desc: 'Get personalized guidance from your virtual tutor, available any time. Ask questions gently and it finds the answers yourself.', color: '#7c3aed' },
  { icon: Target, title: 'Adaptive Paths', desc: "Your curriculum changes dynamically based on your quiz performance and study habits.", color: '#10b981' },
  { icon: BarChart3, title: 'Deep Analytics', desc: "Visualize your knowledge gaps with heatmaps, topic performance charts, and learning velocity.", color: '#3b82f6' },
  { icon: Brain, title: 'Global Learning Atelier', desc: "Connect with elite learners in a curated study ecosystem empowered by AI specialists.", color: '#f59e0b' },
];

const testimonials = [
  { name: 'Anita Rodriguez', role: 'Computer Science Major', text: "NeuroLearn's AI tutor explained data structures in ways my professors couldn't. My GPA went from 3.0 to 3.8 in one semester.", rating: 5 },
  { name: 'Marcus Chen', role: 'Self-taught Developer', text: "The AI-first training system is a work of beauty — adaptive quizzes paired with a chatbot tutor that actually understands context.", rating: 5 },
  { name: 'Sofia Johanssen', role: 'ML Engineer', text: "Switching careers was daunting. NeuroLearn detected my weak spots in probability and tailored exercises just for me.", rating: 5 },
];

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <div className="logo-icon"><Zap size={18} /></div>
            <span className="logo-text-landing">NeuroLearn AI</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#testimonials">Reviews</a>
            <a href="#pricing">Pricing</a>
            <button className="theme-toggle-landing" onClick={toggleTheme}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content animate-fadeInUp">
          <span className="hero-badge">
            <Sparkles size={14} />
            AI-Powered Learning Platform
          </span>
          <h1 className="hero-title">
            Master Any<br />Subject with<br />Your Personal <span className="gradient-text">AI Tutor.</span>
          </h1>
          <p className="hero-desc">
            The only adaptive learning platform that understands your learning patterns, identifies weak areas, and builds your perfect study plan.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">View Demo</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">50,000+</span>
              <span className="hero-stat-label">Active Learners</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">98%</span>
              <span className="hero-stat-label">Satisfaction Rate</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">500+</span>
              <span className="hero-stat-label">Courses Available</span>
            </div>
          </div>
        </div>
        <div className="hero-visual animate-fadeIn">
          <div className="hero-card-stack">
            <div className="hero-floating-card card-1">
              <Bot size={24} className="text-purple" />
              <div>
                <p className="fw-600">AI Tutor</p>
                <p className="text-xs text-muted">Explaining Quantum Mechanics...</p>
              </div>
            </div>
            <div className="hero-floating-card card-2">
              <div className="mini-progress">
                <div className="mini-progress-fill" style={{width:'94%'}} />
              </div>
              <span className="text-sm fw-600">98% <span className="text-muted">Comprehension</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title">Precision-Engineered Learning</h2>
          <p className="section-subtitle">Our proprietary Neural Mapping engine adapts to your unique cognitive rhythm in real-time.</p>
        </div>
        <div className="features-grid stagger">
          {features.map((f, i) => (
            <div key={i} className="feature-card card card-interactive animate-fadeInUp">
              <div className="feature-icon" style={{background: `${f.color}15`, color: f.color}}>
                <f.icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <h2 className="section-title">Voice of the Atelier</h2>
          <p className="section-subtitle">See how NeuroLearn is transforming the academic and professional trajectories of thousands.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card card animate-fadeInUp">
              <div className="testimonial-stars">
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="avatar avatar-sm">{t.name[0]}</div>
                <div>
                  <p className="fw-600 text-sm">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section" id="pricing">
        <div className="section-header">
          <h2 className="section-title">Choose Your Mastery Path</h2>
          <p className="section-subtitle">Simple, transparent pricing for individuals and teams.</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card card">
            <h3>Free</h3>
            <div className="pricing-price">$0 <span>/month</span></div>
            <ul className="pricing-features">
              <li><Check size={16} /> Access 5 Collaborative Courses</li>
              <li><Check size={16} /> Basic AI Chat Support</li>
              <li><Check size={16} /> Weekly Progress Snapshots</li>
              <li><Check size={16} /> Community Forum Access</li>
            </ul>
            <Link to="/signup" className="btn btn-secondary" style={{width:'100%'}}>Start Free</Link>
          </div>
          <div className="pricing-card pricing-card-featured card">
            <span className="badge badge-purple">Premium</span>
            <h3>Premium</h3>
            <div className="pricing-price">$29 <span>/month</span></div>
            <ul className="pricing-features">
              <li><Check size={16} /> Unlimited Course Access</li>
              <li><Check size={16} /> Full AI Tutor (Unlimited)</li>
              <li><Check size={16} /> Personalized Study Plans</li>
              <li><Check size={16} /> Advanced Analytics</li>
              <li><Check size={16} /> Priority Support</li>
              <li><Check size={16} /> Personalized Career Roadmaps</li>
            </ul>
            <Link to="/signup" className="btn btn-primary" style={{width:'100%'}}>Go Premium</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to evolve your intelligence?</h2>
        <p>Join 50,000+ students and professionals who have unlocked their true potential with NeuroLearn AI.</p>
        <Link to="/signup" className="btn btn-primary btn-lg">Get Started <ArrowRight size={18} /></Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="landing-brand">
              <div className="logo-icon"><Zap size={16} /></div>
              <span className="logo-text-landing">NeuroLearn AI</span>
            </div>
            <p className="text-sm text-muted">Redefining the boundaries of digital education through artificial intelligence and neural research.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Platform</h4>
              <a href="#">AI Tutor</a>
              <a href="#">Courses</a>
              <a href="#">Pricing</a>
            </div>
            <div>
              <h4>Community</h4>
              <a href="#">Help Center</a>
              <a href="#">Discord</a>
              <a href="#">Blog</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 NeuroLearn AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
