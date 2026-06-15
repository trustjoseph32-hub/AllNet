
import React, { useState } from 'react';
import { useStore } from '../services/store';
import { ViewState } from '../types';
import { Menu, Home, BookOpen, Activity, MessageCircle, Award, AlertTriangle, X, LogOut, Stethoscope, Settings, Soup, Sparkles, Shield, TrendingUp } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, view, setView, triggerEmergency, logout, updateUserRoleAndSubRole } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ target, icon: Icon, label }: { target: ViewState, icon: any, label: string }) => {
    const isActive = view === target;
    return (
      <button 
        onClick={() => {
          setView(target);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
          ${isActive 
            ? 'bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]' 
            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
        `}
      >
        <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-purple-400 nav-active-glow scale-110' : 'group-hover:scale-110'}`} />
        <span className="font-medium text-sm tracking-wide">{label}</span>
        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>}
      </button>
    );
  };

  const MobileTab = ({ target, icon: Icon, label }: { target: ViewState, icon: any, label: string }) => {
    const isActive = view === target;
    return (
      <button 
        onClick={() => setView(target)}
        className="flex-1 flex flex-col items-center justify-center relative py-2 outline-none group"
      >
        {isActive && (
          <div className="absolute top-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-full shadow-[0_2px_15px_rgba(168,85,247,0.6)]"></div>
        )}
        <div className={`transition-all duration-300 ${isActive ? 'mobile-nav-active-icon -translate-y-1' : 'text-gray-500 group-active:scale-90'}`}>
          <Icon className={`w-6 h-6 ${isActive ? 'nav-active-glow' : ''}`} />
        </div>
        <span className={`text-[10px] mt-1 font-bold tracking-tight transition-all duration-300 ${isActive ? 'text-purple-400 scale-105' : 'text-gray-500 opacity-60'}`}>
          {label}
        </span>
      </button>
    );
  };

  const getHeaderTitle = () => {
    switch (view) {
      case ViewState.DASHBOARD: return 'Личный кабинет';
      case ViewState.PROGRESS: return 'Прогресс курса';
      case ViewState.LESSONS: return 'Академия смыслов';
      case ViewState.DIARY: return 'Карта состояний';
      case ViewState.AI_CHAT: return 'Мета Проводник';
      case ViewState.PROFILE: return 'Мастерство';
      default: return 'НетАллергии';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex font-sans selection:bg-purple-500/30">
      {/* Background spheres for Aero Glass ambiance */}
      <div className="background-spheres">
        <div className="sphere-left"></div>
        <div className="sphere-right"></div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-[70] h-screen w-72 bg-[#0a0518]/80 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#0ca3be] rounded-[15px] flex items-center justify-center text-white shadow-lg shadow-[#0ca3be]/20 shrink-0">
              <span className="font-sans font-black text-2xl mb-0.5">Н</span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xl tracking-tight leading-none">
                <span className="font-extrabold text-white text-[19px]">Нет</span>
                <span className="font-black italic text-[#0ca3be] text-[19px] ml-0.5">Аллергии</span>
              </div>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-[0.25em] block mt-1.5 leading-none">
                ЭКОСИСТЕМА|
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem target={ViewState.DASHBOARD} icon={Home} label="Кабинет" />
          <NavItem target={ViewState.PROGRESS} icon={TrendingUp} label="Прогресс" />
          <NavItem target={ViewState.LESSONS} icon={BookOpen} label="Уроки" />
          <NavItem target={ViewState.DIAGNOSTICS} icon={Stethoscope} label="Диагностика" />
          <NavItem target={ViewState.NUTRITION} icon={Soup} label="Биохимия" />
          <NavItem target={ViewState.DIARY} icon={Activity} label="Дневник" />
          <NavItem target={ViewState.AI_CHAT} icon={MessageCircle} label="Проводник" />
          <NavItem target={ViewState.SERVICES} icon={Settings} label="Ресурсы" />
          {(user.role === 'admin' || user.role === 'super_admin') && (
            <NavItem target={ViewState.ADMIN} icon={Shield} label="Админ-панель" />
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-white/5 mt-auto space-y-4">
          {/* Ролевой переключатель для тестирования */}
          <div className="bg-purple-950/30 p-3 rounded-xl border border-purple-500/15">
            <div className="text-[9px] font-black tracking-wider text-purple-400 mb-1.5 uppercase text-center">ТЕСТ РОЛЕЙ И ДОСТУПА</div>
            <select
              value={user.role}
              onChange={(e) => {
                const role = e.target.value as any;
                const subRole = role === 'participant' ? 'ВАс' : 'none';
                updateUserRoleAndSubRole(user.id, role, subRole);
              }}
              className="w-full bg-[#120a2c] text-white border border-purple-500/20 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 font-bold cursor-pointer"
            >
              <option value="super_admin">⚡ Супер Админ</option>
              <option value="admin">💼 Администратор</option>
              <option value="support">🎓 Куратор</option>
              <option value="participant">🟢 Участник (ВАс)</option>
              <option value="user">⚪ Пользователь</option>
            </select>
          </div>

          <div 
            onClick={() => setView(ViewState.PROFILE)}
            className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-xl border border-transparent hover:border-white/10 transition-all group"
            title="Перейти в личный профиль"
          >
            <div className="relative">
              <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-xl border border-white/20 shadow-inner group-hover:scale-105 transition-transform" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0a0518] rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">{user.name}</div>
              <div className="text-[10px] text-purple-400 font-bold uppercase tracking-widest leading-normal">
                {user.role === 'super_admin' ? 'Супер Админ' : user.role === 'admin' ? 'Администратор' : user.role === 'support' ? 'Куратор' : user.role === 'participant' ? `Участник (${user.subRole || 'ВА'})` : 'Пользователь'}
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"
          >
            <LogOut className="w-4 h-4" /> ЗАВЕРШИТЬ СЕССИЮ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-[#0a0518]/40 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-10 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-white/70 p-2 hover:bg-white/5 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black text-white uppercase tracking-wider">{getHeaderTitle()}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
               <span className="text-xs font-black text-purple-400">{user.xp} <span className="text-gray-500">XP</span></span>
               <div className="w-px h-3 bg-white/10"></div>
               <span className="text-xs font-black text-orange-400">{user.streak} <span className="text-gray-500">ДНЕЙ</span></span>
            </div>
            <button 
              onClick={triggerEmergency}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              SOS ПОМОЩЬ
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 no-scrollbar">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0518]/90 backdrop-blur-3xl border-t border-white/10 flex items-center justify-around px-2 pb-safe-area-inset-bottom h-[76px] z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <MobileTab target={ViewState.DASHBOARD} icon={Home} label="КАБИНЕТ" />
          <MobileTab target={ViewState.LESSONS} icon={BookOpen} label="УРОКИ" />
          <MobileTab target={ViewState.AI_CHAT} icon={MessageCircle} label="МЕТА" />
          <MobileTab target={ViewState.DIARY} icon={Activity} label="ДНЕВНИК" />
          <MobileTab target={ViewState.PROFILE} icon={Award} label="МАСТЕР" />
        </nav>
      </main>
    </div>
  );
};
