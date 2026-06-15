
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 

const style = document.createElement('style');
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    --meta-bg: #050212;
    --meta-accent: #a855f7;
    --meta-secondary: #06b6d4;
    --meta-glass: rgba(255, 255, 255, 0.03);
    --meta-border: rgba(255, 255, 255, 0.08);
  }

  body {
    background-color: var(--meta-bg);
    color: #e2e8f0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    margin: 0;
    overflow-x: hidden;
  }

  .meta-gradient-text {
    background: linear-gradient(135deg, #fff 0%, #a855f7 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .glass-card {
    background: var(--meta-glass);
    backdrop-filter: blur(40px);
    border: 1px solid var(--meta-border);
    border-radius: 2rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-card:hover {
    border-color: rgba(168, 85, 247, 0.3);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-4px);
  }

  .nebula {
    position: fixed;
    border-radius: 50%;
    filter: blur(140px);
    z-index: -1;
    opacity: 0.2;
    pointer-events: none;
    transition: all 10s ease-in-out;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }

  .animate-meta-float {
    animation: float 20s infinite ease-in-out;
  }

  .nav-active-glow {
    filter: drop-shadow(0 0 12px #a855f7);
  }

  /* Стилизация скролла */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--meta-border); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.5); }
`;
document.head.appendChild(style);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      <div className="nebula w-[600px] h-[600px] bg-purple-900 top-[-20%] left-[-10%] animate-meta-float"></div>
      <div className="nebula w-[500px] h-[500px] bg-indigo-900 bottom-[-10%] right-[-10%] animate-meta-float" style={{animationDelay: '-5s'}}></div>
      <div className="nebula w-[400px] h-[400px] bg-cyan-900 top-[30%] right-[10%] animate-meta-float" style={{animationDelay: '-10s'}}></div>
    </div>
    <App />
  </React.StrictMode>
);
