
import React from 'react';
import { useStore } from '../services/store';
import { ViewState } from '../types';
import { Home, BookOpen, Activity, MessageCircle, Award, AlertTriangle, LogOut, Stethoscope, Soup, Shield, TrendingUp, Briefcase, FileText, Package, User } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, view, setView, triggerEmergency, logout, updateUserRoleAndSubRole } = useStore();

  const NavItem = ({ target, icon: Icon, label }: { target: ViewState, icon: any, label: string }) => {
    const isActive = view === target;
    return (
      <button 
        onClick={() => setView(target)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group outline-none
          ${isActive 
            ? 'bg-[#0ca3be]/10 text-[#0ca3be] border border-[#0ca3be]/20 shadow-[0_0_15px_rgba(12,163,190,0.15)]' 
            : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 border border-transparent'}
        `}
      >
        <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-[#0ca3be] scale-110 drop-shadow-[0_0_8px_rgba(12,163,190,0.5)]' : 'group-hover:scale-110'}`} />
        <span className={`font-semibold text-[15px] tracking-wide ${isActive ? 'drop-shadow-[0_0_8px_rgba(12,163,190,0.4)]' : ''}`}>{label}</span>
        {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-[#0ca3be] shadow-[0_0_10px_rgba(12,163,190,0.8)]"></div>}
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
          <div className="absolute top-0 w-12 h-1 bg-[#0ca3be] rounded-b-full shadow-[0_2px_15px_rgba(12,163,190,0.6)]"></div>
        )}
        <div className={`transition-all duration-300 ${isActive ? 'text-[#0ca3be] -translate-y-1 drop-shadow-[0_0_8px_rgba(12,163,190,0.5)]' : 'text-slate-400 group-hover:text-slate-600 group-active:scale-90'}`}>
          <Icon className={`w-6 h-6`} />
        </div>
        <span className={`text-[10px] mt-1 font-bold tracking-tight transition-all duration-300 ${isActive ? 'text-[#0ca3be] scale-105 drop-shadow-[0_0_8px_rgba(12,163,190,0.4)]' : 'text-slate-400'}`}>
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
    <div className="min-h-screen flex font-sans bg-[#f1f5f9] text-slate-800 selection:bg-[#0ca3be]/30">
      {/* Sidebar */}
      <aside className="hidden md:flex sticky top-0 left-0 z-[70] h-screen w-72 bg-[#f0f4f8] border-r border-slate-200 flex-col">
        <div className="p-6 md:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#0ca3be] rounded-[15px] flex items-center justify-center text-white shadow-lg shadow-[#0ca3be]/20 shrink-0">
              <span className="font-sans font-black text-2xl mb-0.5">Н</span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xl tracking-tight leading-none">
                <span className="font-extrabold text-[19px]">Нет</span>
                <span className="font-[900] italic text-[#0ca3be] text-[19px] ml-0.5">Аллергии</span>
              </div>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-[0.25em] block mt-1.5 leading-none">
                ЭКОСИСТЕМА
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem target={ViewState.DASHBOARD} icon={Home} label="Кабинет" />
          <NavItem target={ViewState.LESSONS} icon={BookOpen} label="Уроки" />
          <NavItem target={ViewState.DIARY} icon={Activity} label="Дневник" />
          <NavItem target={ViewState.PROGRESS} icon={TrendingUp} label="Прогресс" />
          <NavItem target={ViewState.DIAGNOSTICS} icon={Stethoscope} label="Диагностика" />
          <NavItem target={ViewState.NUTRITION} icon={Soup} label="Биохимия" />
          <NavItem target={ViewState.AI_CHAT} icon={MessageCircle} label="Проводник" />
          {(user.role === 'admin' || user.role === 'super_admin') && (
            <>
              <div className="my-3 border-t border-gray-500/30" />
              <NavItem target={ViewState.ADMIN} icon={Shield} label="Админ-панель" />
              <NavItem target={ViewState.ADMIN_CRM} icon={Briefcase} label="CRM" />
              <NavItem target={ViewState.ADMIN_CONTENT} icon={FileText} label="Контент" />
              <NavItem target={ViewState.ADMIN_PRODUCTS} icon={Package} label="Продукты" />
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-200/60 bg-slate-50 mt-auto space-y-4">
          {/* Ролевой переключатель для тестирования */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="text-[9px] font-black tracking-wider text-slate-500 mb-1.5 uppercase text-center">ТЕСТ РОЛЕЙ И ДОСТУПА</div>
            <select
              value={user.role}
              onChange={(e) => {
                const role = e.target.value as any;
                const subRole = role === 'participant' ? 'ВАс' : 'none';
                updateUserRoleAndSubRole(user.id, role, subRole);
              }}
              className="w-full bg-slate-50 text-slate-800 border border-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0ca3be] font-bold cursor-pointer"
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
            className="flex items-center gap-4 cursor-pointer hover:bg-slate-100 p-2 rounded-xl border border-transparent hover:border-slate-200 transition-all group"
            title="Перейти в личный профиль"
          >
            <div className="relative">
              <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-xl border border-slate-300 shadow-sm group-hover:scale-105 transition-transform object-cover" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold meta-gradient-text truncate transition-colors">{user.name}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-normal">
                {user.role === 'super_admin' ? 'Супер Админ' : user.role === 'admin' ? 'Администратор' : user.role === 'support' ? 'Куратор' : user.role === 'participant' ? `Участник (${user.subRole || 'ВА'})` : 'Пользователь'}
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 rounded-xl transition-all border border-transparent hover:border-slate-300"
          >
            <LogOut className="w-4 h-4" /> ЗАВЕРШИТЬ СЕССИЮ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Light theme nebulas */}
        <div className="fixed inset-y-0 right-0 w-full md:w-[calc(100%-18rem)] pointer-events-none overflow-hidden z-[-1] bg-slate-50">
          <div className="nebula w-[600px] h-[600px] bg-teal-200/40 rounded-full blur-[100px] absolute top-[-10%] left-[-10%] animate-meta-float"></div>
          <div className="nebula w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] absolute bottom-[-10%] right-[10%] animate-meta-float" style={{animationDelay: '-5s'}}></div>
          <div className="nebula w-[600px] h-[600px] bg-cyan-200/40 rounded-full blur-[100px] absolute top-[30%] right-[20%] animate-meta-float" style={{animationDelay: '-10s'}}></div>
        </div>

        <header className="bg-white/40 backdrop-blur-md border-b border-white/50 py-3 px-4 md:py-4 md:px-10 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2 md:gap-4">
            <h1 className="text-lg md:text-xl font-bold text-slate-800 uppercase tracking-widest shrink-0">{getHeaderTitle()}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-200 shadow-sm">
               <span className="text-xs font-black text-[#0ca3be]">{user.xp} <span className="text-slate-400">XP</span></span>
               <div className="w-px h-3 bg-slate-300"></div>
               <span className="text-xs font-black text-indigo-500">{user.streak} <span className="text-slate-400">ДНЕЙ</span></span>
            </div>
            <button 
              onClick={triggerEmergency}
              className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] sm:text-xs font-black tracking-[0.1em] md:tracking-[0.2em] transition-all hover:shadow-md shrink-0 flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3 md:hidden" />
              <span className="hidden sm:inline">SOS ПОМОЩЬ</span>
              <span className="sm:hidden">SOS</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 pb-32 no-scrollbar bg-transparent">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>

        {/* Mobile Nav */}
        <nav 
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-3xl border-t border-slate-200 flex items-center justify-around px-2 z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)', height: 'calc(68px + env(safe-area-inset-bottom))' }}
        >
          <MobileTab target={ViewState.DASHBOARD} icon={Home} label="КАБИНЕТ" />
          <MobileTab target={ViewState.LESSONS} icon={BookOpen} label="УРОКИ" />
          <MobileTab target={ViewState.DIARY} icon={Activity} label="ДНЕВНИК" />
          <MobileTab target={ViewState.PROGRESS} icon={TrendingUp} label="ПРОГРЕСС" />
          {user?.role === 'super_admin' ? (
            <MobileTab target={ViewState.ADMIN} icon={Shield} label="АДМИН" />
          ) : (
            <MobileTab target={ViewState.PROFILE} icon={User} label="ПРОФИЛЬ" />
          )}
        </nav>
      </main>
    </div>
  );
};
