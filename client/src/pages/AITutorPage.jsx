import { useState, useEffect, useRef } from 'react';
import { aiAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Send, Plus, Bookmark, MoreHorizontal, Bot, User, Sparkles, Download, Copy, Trash2, Share2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './AITutorPage.css';

export default function AITutorPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi there! I'm your **NeuroLearn AI Tutor** powered by Llama 3.3.\n\nI can help you:\n- **Explain concepts** in simple terms\n- **Generate practice questions** on any topic\n- **Build a study plan** tailored to your needs\n- **Debug code** and review your solutions\n\nWhat would you like to learn today?",
      createdAt: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [bookmarked, setBookmarked] = useState([]);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiAPI.chat({ message: input, sessionId });
      setSessionId(data.sessionId);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message.content,
        createdAt: data.message.createdAt
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "⚠️ I couldn't connect to the AI server right now. Please check that the backend is running on port 5000 and your Groq API key is configured in the `.env` file.",
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setSessionId(null);
    setMessages([{
      role: 'assistant',
      content: "Starting a fresh session! 🧠 What would you like to explore?",
      createdAt: new Date().toISOString()
    }]);
    setShowMenu(false);
  };

  const copyTranscript = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'AI'}: ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setShowMenu(false);
  };

  const downloadTranscript = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'neurolearn-chat.txt'; a.click();
    setShowMenu(false);
  };

  const clearChat = () => {
    startNewChat();
  };

  const quickPrompts = [
    { label: 'Generate quiz', prompt: 'Generate 3 practice questions about the topic we just discussed.' },
    { label: 'Explain simply', prompt: 'Explain this concept like I am 10 years old.' },
    { label: 'Give example', prompt: 'Give me a real-world example of this concept.' },
    { label: 'Study plan', prompt: 'Help me build a 7-day study plan for this topic.' },
  ];

  const recentTopics = [
    { title: "React Hooks Deep Dive", icon: '⚛️' },
    { title: "Async/Await Patterns", icon: '⏳' },
    { title: "Data Structures", icon: '🌳' },
  ];

  return (
    <div className="ai-tutor-page animate-fadeIn">
      <div className="tutor-main">
        {/* Chat Header */}
        <div className="tutor-header">
          <div className="tutor-header-left">
            <div className="tutor-avatar">
              <Bot size={22} />
            </div>
            <div>
              <h2>AI Tutor</h2>
              <span className="tutor-status">
                <span className="status-dot" /> ACTIVE · Llama 3.3 · 70B
              </span>
            </div>
          </div>
          <div className="tutor-header-actions">
            <button className="btn btn-ghost btn-icon" onClick={startNewChat} title="New Chat">
              <Plus size={18} />
            </button>
            <button 
              className="btn btn-ghost btn-icon" 
              onClick={() => setBookmarked(prev => [...prev, messages[messages.length - 1]])}
              title="Bookmark last message"
            >
              <Bookmark size={18} />
            </button>
            <div style={{position:'relative'}} ref={menuRef}>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowMenu(!showMenu)} title="More options">
                <MoreHorizontal size={18} />
              </button>
              {showMenu && (
                <div className="tutor-menu animate-fadeIn">
                  <button className="tutor-menu-item" onClick={copyTranscript}>
                    <Copy size={15} /> Copy conversation
                  </button>
                  <button className="tutor-menu-item" onClick={downloadTranscript}>
                    <Download size={15} /> Download transcript
                  </button>
                  <button className="tutor-menu-item" onClick={() => { navigator.share?.({ title: 'NeuroLearn Chat', text: messages.map(m => m.content).join('\n') }); setShowMenu(false); }}>
                    <Share2 size={15} /> Share session
                  </button>
                  <div className="tutor-menu-divider" />
                  <button className="tutor-menu-item danger" onClick={clearChat}>
                    <Trash2 size={15} /> Clear chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="tutor-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="message-avatar"><Bot size={16} /></div>
              )}
              <div className="message-bubble">
                {msg.role === 'assistant' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  <p>{msg.content}</p>
                )}
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {msg.role === 'user' && (
                <div className="message-avatar user-avatar"><User size={16} /></div>
              )}
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="message-avatar"><Bot size={16} /></div>
              <div className="message-bubble typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="quick-actions">
            {quickPrompts.map((qp, i) => (
              <button key={i} className="quick-action-btn" onClick={() => setInput(qp.prompt)}>
                <Sparkles size={13} /> {qp.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form className="tutor-input-bar" onSubmit={handleSend}>
          <textarea
            className="tutor-input"
            placeholder="Ask anything… (Shift+Enter for new line)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
            style={{resize:'none', overflow:'hidden'}}
          />
          <button type="submit" className={`send-btn ${input.trim() ? 'active' : ''}`} disabled={!input.trim() || loading}>
            <Send size={18} />
          </button>
        </form>

        <p className="tutor-disclaimer">AI can make mistakes. Verify important information.</p>
      </div>

      {/* Right Panel */}
      <div className="tutor-sidebar">
        <div className="tutor-panel">
          <h4><span className="panel-dot" style={{background:'var(--accent-amber)'}} /> QUICK ACTIONS</h4>
          <div style={{display:'flex', flexDirection:'column', gap:'8px', marginTop:'8px'}}>
            {quickPrompts.map((qp, i) => (
              <button key={i} className="lesson-item" style={{justifyContent:'flex-start', padding:'10px 12px', borderRadius:'var(--radius-sm)', background:'var(--bg-secondary)', border:'1px solid var(--border-light)'}} onClick={() => { setInput(qp.prompt); }}>
                <Sparkles size={14} style={{color:'var(--primary-500)', flexShrink:0}}/>
                <span className="text-sm">{qp.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="tutor-panel">
          <h4><span className="panel-dot" style={{background:'var(--accent-green)'}} /> RECENT TOPICS</h4>
          <div className="recent-topics">
            {recentTopics.map((topic, i) => (
              <div key={i} className="recent-topic-item">
                <span className="topic-icon">{topic.icon}</span>
                <span>{topic.title}</span>
              </div>
            ))}
          </div>
        </div>

        {bookmarked.length > 0 && (
          <div className="tutor-panel">
            <h4><span className="panel-dot" style={{background:'var(--primary-500)'}} /> BOOKMARKS</h4>
            {bookmarked.slice(-2).map((msg, i) => (
              <div key={i} style={{padding:'10px', background:'var(--bg-secondary)', borderRadius:'var(--radius-sm)', marginTop:'8px', fontSize:'0.8rem', color:'var(--text-secondary)'}}>
                {msg.content.substring(0, 80)}…
              </div>
            ))}
          </div>
        )}

        <div className="tutor-panel daily-goal-panel">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm" style={{color:'var(--primary-400)'}}>DAILY GOAL</span>
            <span className="font-bold" style={{color:'var(--primary-400)'}}>85%</span>
          </div>
          <div className="progress-bar" style={{marginTop:'8px'}}>
            <div className="progress-bar-fill" style={{width:'85%'}} />
          </div>
          <p className="text-xs text-muted" style={{marginTop:'8px'}}>You're 15 mins away from your streak badge!</p>
        </div>
      </div>
    </div>
  );
}
