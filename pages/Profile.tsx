import React from 'react';
import { useStore } from '../services/store';
import { ViewState, Badge, Lesson, Product } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { 
  Award, User as UserIcon, CheckCircle, TrendingUp, Activity, 
  Sparkles, BookOpen, Heart, Calendar, Flame, ArrowRight, 
  Lock, Shield, Star, Sparkle, ExternalLink, Zap
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { 
    user, 
    lessons, 
    products, 
    userAccess, 
    badges, 
    setView, 
    setActiveLesson,
    viewUserDiagnostics 
  } = useStore();

  if (!user) return null;

  // 1. Calculations for Lessons Progress
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => l.isCompleted).length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // 2. Calculations for Purchased Products
  // User can have purchased products in user.purchasedProductIds or active ones in userAccess
  const purchasedIds = user.purchasedProductIds || [];
  const ownedProducts = products.filter(p => 
    purchasedIds.includes(p.id) || 
    userAccess.some(access => access.userId === user.id && access.productId === p.id)
  );

  // 3. User Role translator to descriptive Russian
  const getRoleLabelRu = (role: string) => {
    switch (role) {
      case 'super_admin': return '⚡ Супер Администратор';
      case 'admin': return '💼 Администратор Платформы';
      case 'support': return '🎓 Куратор / Наставник';
      case 'participant': return `🟢 Действующий Участник (${user.subRole || 'ВА'})`;
      case 'student': return `🟢 Действующий Участник (${user.subRole || 'ВА'})`;
      case 'user': return '⚪ Зарегистрированный Пользователь';
      default: return 'Пользователь';
    }
  };

  const getSubRoleDescription = (sub: string | undefined) => {
    switch (sub) {
      case 'ВА': return 'Взрослый, аллергопатология';
      case 'ВАс': return 'Взрослый, бронхиальная астма';
      case 'ВАд': return 'Взрослый, атопический дерматит';
      case 'Ма': return 'Мама, ребенок с аллергией';
      case 'МАс': return 'Мама, ребенок с бронхиальной астмой';
      case 'Мад': return 'Мама, ребенок с атопическим дерматитом';
      default: return null;
    }
  };

  const joinedDateStr = user.joinedAt 
    ? new Date(user.joinedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'недавно';

  return (
    <div className="space-y-8 animate-fade-in text-white pb-20">
      
      {/* 2-COLUMN TOP SECTION: HERO PROFILE & XP METEOR CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* HERO CARD (Left Column - Column Span 7) */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          {/* Avatar Area */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-500 rounded-2xl blur-[4px] opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-1 bg-[#120a2c] rounded-2xl">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-24 h-24 rounded-xl object-cover border border-white/10" 
              />
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 bg-green-500 border-4 border-[#070311] rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-black" title="В сети">
              ●
            </span>
          </div>

          {/* User Details */}
          <div className="flex-grow text-center md:text-left space-y-3">
            <div>
              <span className="text-[10px] font-black tracking-[0.25em] text-purple-400 uppercase block mb-1">ЛИЧНЫЙ ПРОФИЛЬ</span>
              <h1 className="text-3xl font-black tracking-tight text-white mb-1 leading-none">{user.name}</h1>
              <p className="text-xs text-gray-400 font-mono">{user.email}</p>
            </div>

            {/* Status Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider leading-none shadow-[0_2px_10px_rgba(168,85,247,0.15)] border
                ${user.role === 'super_admin' ? 'bg-purple-950/40 text-purple-400 border-purple-500/30' : ''}
                ${user.role === 'admin' ? 'bg-indigo-950/40 text-indigo-400 border-indigo-500/30' : ''}
                ${user.role === 'support' ? 'bg-blue-900/40 text-blue-400 border-blue-500/30' : ''}
                ${(user.role === 'participant' || user.role === 'student') ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' : ''}
                ${user.role === 'user' ? 'bg-gray-800/40 text-gray-400 border-gray-700' : ''}
              `}>
                {getRoleLabelRu(user.role)}
              </span>

              {user.subRole && user.subRole !== 'none' && (
                <span className="px-3 py-1 bg-[#120a2c] text-purple-400 border border-purple-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Подроль: {user.subRole}
                </span>
              )}
            </div>

            {/* Additional info */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-3 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1.5 justify-center md:justify-start">
                <Calendar className="w-4 h-4 text-purple-400" />
                В клубе с {joinedDateStr}
              </span>
              <span className="flex items-center gap-1.5 justify-center md:justify-start">
                <Flame className="w-4 h-4 text-orange-500" />
                Серия активности: {user.streak} дн.
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESS & LEVEL CARD (Right Column - Column Span 5) */}
        <div className="lg:col-span-5 glass-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#140b2f] via-transparent to-transparent pointer-events-none"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">ОЧКИ ОПЫТА И СОЗНАНИЕ</span>
              <h3 className="text-2xl font-black text-white mt-1">Уровень {user.level}</h3>
            </div>
            
            <div className="w-12 h-12 bg-purple-500/15 rounded-xl flex items-center justify-center border border-purple-500/20">
              <Sparkle className="w-6 h-6 text-purple-400 animate-spin-slow" />
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <div className="flex justify-between text-xs font-bold text-gray-300">
              <span>{user.xp} XP</span>
              <span className="text-purple-400">20,000 XP (Максимум)</span>
            </div>
            <ProgressBar 
              current={user.xp} 
              max={20000} 
              colorClass="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 h-2.5" 
            />
            <p className="text-[10px] text-gray-400 italic font-medium leading-relaxed uppercase tracking-wider text-center pt-1.5">
              Каждое выполненное действие увеличивает энергетическую активность вашего поля
            </p>
          </div>
        </div>
      </div>

      {/* MID SECTION: INTERACTIVE DIAGNOSTICS & RESULTS CARDS */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none"></div>
        
        {user.diagnosticsStatus === 'completed' ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                  <CheckCircle className="w-3 h-3" /> Профиль верифицирован
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Показатели психосоматики</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-lg">
                  Мы определили фоновые очаги вашей психосоматической регуляции. Эти напряжения вызывают повышенный гистаминный ответ.
                </p>
              </div>

              <button 
                onClick={() => viewUserDiagnostics(user.id)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transform active:scale-95 transition-all shadow-lg shadow-purple-900/30"
              >
                Открыть полный профиль <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mini sliders / Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
              
              <div className="bg-[#120a2c]/40 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-300">Психологическая Тревожность</span>
                  <span className="font-extrabold text-red-400">Высокий (4.2)</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>

              <div className="bg-[#120a2c]/40 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-300">Подавленный Гнев / Границы</span>
                  <span className="font-extrabold text-yellow-500">Средний (3.5)</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div className="bg-[#120a2c]/40 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-300">Семейный Конфликт</span>
                  <span className="font-extrabold text-blue-400">Базовый (2.0)</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-4">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-black tracking-widest text-yellow-500 uppercase">ПСИХОСОМАТИЧЕСКАЯ ДИАГНОСТИКА</span>
              <h3 className="text-2xl font-black text-white">Профиль не заполнен</h3>
              <p className="text-gray-400 text-sm max-w-xl font-light leading-relaxed">
                Вы не завершили диагностический опросник. Заполните тест из 120 вопросов, чтобы получить карту психосоматических напряжений и рекомендации ИИ-диагноста.
              </p>
            </div>
            
            <button 
              onClick={() => setView(ViewState.DIAGNOSTICS)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transform active:scale-95 transition-all shadow-xl shadow-purple-900/30 shrink-0 select-none animate-pulse"
            >
              Пройти диагностику <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: 2-COLUMN ACADEMIC & PRODUCTS VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COURSE & LESSON MONITOR (Column 1) */}
        <div className="glass-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">ОБУЧАЮЩИЙ ПРОЦЕСС</span>
                <h3 className="text-xl font-black text-white mt-1">Пройденные уроки</h3>
              </div>
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>

            {/* Circle Progress / Linear progress */}
            <div className="bg-[#120a2c]/30 rounded-2xl p-4 border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-400">Прогресс занятий:</span>
                <span className="text-purple-400">{completedLessons} / {totalLessons} уроков ({progressPercentage}%)</span>
              </div>
              <ProgressBar 
                current={completedLessons} 
                max={totalLessons} 
                colorClass="bg-purple-500 h-2" 
              />
            </div>

            {/* Scannable Lessons list with interactive triggers */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
              {lessons.map((lesson: Lesson) => {
                const isCompleted = lesson.isCompleted;
                
                return (
                  <div 
                    key={lesson.id} 
                    onClick={() => {
                      if (!lesson.isLocked || user.role === 'admin' || user.role === 'super_admin') {
                        setActiveLesson(lesson.id);
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer 
                      ${isCompleted 
                        ? 'bg-purple-950/10 border-purple-500/20 text-white' 
                        : 'bg-[#120a2c]/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <div className="w-5 h-5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center font-black">
                          ✓
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-white/5 border border-white/10 rounded-full flex items-center justify-center font-medium text-[10px]">
                          {lesson.blockId || '•'}
                        </div>
                      )}
                      
                      <span className="truncate max-w-[280px]">{lesson.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 font-mono">{lesson.durationMinutes} мин</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PRODUCTS & MEMBERSHIPS (Column 2) */}
        <div className="glass-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#f59e0b] uppercase">ПРОДУКТЫ ИЛИ РЕСУРСЫ</span>
                <h3 className="text-xl font-black text-white mt-1">Купленные программы</h3>
              </div>
              <Award className="w-6 h-6 text-[#f59e0b]" />
            </div>

            {/* List of purchased items */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
              {ownedProducts.map((p: Product) => (
                <div key={p.id} className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-yellow-500 leading-tight">{p.title}</h4>
                      <span className="text-[9px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase font-mono tracking-wider mt-1.5 inline-block">
                        {p.type}
                      </span>
                    </div>
                    <span className="text-xs font-black text-gray-300 bg-[#120a2c] px-2.5 py-1 rounded-lg border border-yellow-500/20">
                      АКТИВЕН
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}

              {ownedProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-2xl text-center space-y-4">
                  <Lock className="w-8 h-8 text-gray-500" />
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-gray-400">Нет приобретенных продуктов</p>
                    <p className="text-[10px] text-gray-500 max-w-xs leading-normal">
                      Получите или приобретите терапевтическую программу в магазине ресурсов для получения полного доступа.
                    </p>
                  </div>
                  <button 
                    onClick={() => setView(ViewState.SERVICES)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Перейти в Ресурсы
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* BADGES & ACCOMPLISHMENTS VIEW */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Достижения и значки</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge: Badge) => (
            <div 
              key={badge.id} 
              className={`
                p-5 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden group
                ${badge.unlocked 
                  ? 'bg-[#120a2c]/50 border-purple-500/20 shadow-[0_4px_20px_rgba(168,85,247,0.05)] hover:border-purple-500/40' 
                  : 'bg-[#120a2c]/20 border-white/5 opacity-50 grayscale'
                }
              `}
            >
              {badge.unlocked && (
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
              <div className={`text-4xl mb-3 transform transition-transform group-hover:scale-110 duration-300 ${badge.unlocked ? 'animate-pulse-slow' : ''}`}>
                {badge.icon}
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{badge.name}</h3>
              <p className="text-[11px] text-gray-400 leading-normal mb-2">{badge.description}</p>
              {badge.unlocked ? (
                <span className="mt-auto text-[9px] uppercase font-black text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 tracking-wider">
                  Получено
                </span>
              ) : (
                <span className="mt-auto text-[9px] uppercase font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded-full tracking-wider">
                  Заблокирован
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
