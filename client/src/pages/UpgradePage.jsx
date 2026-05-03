import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Check, Star, Zap, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './UpgradePage.css';

export default function UpgradePage() {
  const { isDark } = useTheme();
  
  return (
    <div className="upgrade-page animate-fadeIn">
      <div className="upgrade-header">
        <h1>Unlock Your <span className="text-gradient">Potential</span></h1>
        <p className="text-muted">Join thousands of developers mastering skills 3x faster with NeuroLearn Pro.</p>
      </div>
      
      <div className="pricing-grid">
        <div className="pricing-card basic-card">
          <h2>Hobbyist</h2>
          <p className="price">$0<span>/mo</span></p>
          <ul className="features-list">
            <li><Check size={18}/> Access to basic courses</li>
            <li><Check size={18}/> Community support</li>
            <li><Check size={18}/> Standard curriculum</li>
          </ul>
          <Link to="/courses" className="btn btn-secondary w-full" style={{justifyContent: 'center', marginTop: 'auto'}}>Current Plan</Link>
        </div>
        
        <div className="pricing-card pro-card">
          <div className="popular-badge"><Star size={14}/> MOST POPULAR</div>
          <h2>NeuroLearn Pro</h2>
          <p className="price">$19<span>/mo</span></p>
          <ul className="features-list">
            <li><Check size={18}/> Unlimited interactive AI Tutor</li>
            <li><Check size={18}/> Full immersive masterclass access</li>
            <li><Check size={18}/> Advanced cognitive analytics</li>
            <li><Check size={18}/> Priority feature access</li>
          </ul>
          <button className="btn btn-primary w-full" style={{justifyContent: 'center', marginTop: 'auto'}}>
            <Sparkles size={18}/> Upgrade Now
          </button>
        </div>
      </div>
      
      <div className="trust-section mt-12 text-center text-muted">
        <Shield size={32} className="mx-auto mb-4" opacity={0.3} />
        <p>14-day money-back guarantee. Cancel anytime.</p>
      </div>
    </div>
  );
}
