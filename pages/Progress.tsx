import React, { useState } from 'react';
import { useStore } from '../services/store';
import { ViewState } from '../types';
import { 
  Award, TrendingUp, Zap, Sparkles, CheckCircle2, Lock, 
  ArrowRight, Stethoscope, Flame, Calendar, CheckSquare, ShieldCheck, Clock, BookOpen, Target,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { Button } from '../components/Button';

export const Progress: React.FC = () => {
  const { user, lessons, badges, setView, viewUserDiagnostics } = useStore();
  const [expandedStep, setExpandedStep] = useState<string | null>('diagnostic');

  if (!user) return null;

  // Calculate Course Progress Metrics
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => l.isCompleted).length;

  const joinedDate = user.joinedAt ? new Date(user.joinedAt) : new Date();
  const timeOnPlatformMs = new Date().getTime() - joinedDate.getTime();
  const daysOnPlatform = Math.max(1, Math.floor(timeOnPlatformMs / (1000 * 60 * 60 * 24)));

  // Render Badge Icon/Emoji/Symbol helper
  const getBadgeIcon = (badgeName: string) => {
    switch (badgeName) {
      case 'Инициация': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'Проводник': return <CheckSquare className="w-5 h-5 text-indigo-400" />;
      case 'Алхимик': return <Award className="w-5 h-5 text-emerald-400" />;
      default: return <Award className="w-5 h-5 text-purple-400" />;
    }
  };

  // Diagnostic Status check
  const isDiagnosticsCompleted = user.diagnosticsStatus === 'completed';

  const roadmapSteps = [
    { id: 'intro', title: 'Начало (Вводный урок)', desc: 'Знакомство с Академией смысла и принципами прохождения.', isCompleted: true, xp: 50 },
    { id: 'anamnesis', title: 'Анамнез', desc: 'Первичный сбор анамнеза для составления карты триггеров.', isCompleted: isDiagnosticsCompleted, xp: 50 },
    { id: 'request', title: 'Запрос на курс', desc: 'Формирование персонального запроса на обучение.', isCompleted: isDiagnosticsCompleted, xp: 50 },
    { 
      id: 'diagnostic', 
      title: 'Диагностический тест', 
      desc: isDiagnosticsCompleted ? 'Диагностика пройдена. Психосоматическая карта сформирована, цели курса определены.' : 'Пройдите глубинное тестирование, чтобы сформировать отправную точку.', 
      isCompleted: isDiagnosticsCompleted, 
      xp: 200,
      action: !isDiagnosticsCompleted ? (
        <Button 
          onClick={() => setView(ViewState.DIAGNOSTICS)}
          className="mt-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/40 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
        >
          Пройти диагностику
        </Button>
      ) : null 
    },
    { id: 'week1', title: '1 Неделя', desc: '6 миниуроков', lessonIndex: 0, xp: 300 },
    { id: 'week2', title: '2 Неделя', desc: '6 миниуроков', lessonIndex: 1, xp: 300 },
    { id: 'week3', title: '3 Неделя', desc: '6 миниуроков', lessonIndex: 2, xp: 300 },
    { id: 'week4', title: '4 Неделя', desc: '6 миниуроков', lessonIndex: 3, xp: 300 },
    { id: 'week5', title: '5 Неделя', desc: '6 миниуроков', lessonIndex: 4, xp: 300 },
    { id: 'week6', title: '6 Неделя', desc: '6 миниуроков', lessonIndex: 5, xp: 300 },
    { id: 'week7', title: '7 Неделя', desc: '4 миниурока', lessonIndex: 6, xp: 200 },
    { id: 'week8', title: '8 Неделя', desc: '3 миниурока', lessonIndex: 7, xp: 150 },
    { id: 'final', title: 'Финал', desc: 'Завершение курса, итоговое тестирование и результаты.', isCompleted: false, xp: 500 }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header section with minimal & premium aesthetic */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight meta-gradient-text w-fit pb-1">
          ВАШ ПРОГРЕСС
        </h1>
        <p className="text-gray-400 text-sm mt-2 max-w-2xl">
          Проходите программу, накапливайте антистресс-баллы и меняйте их на разные предложения в магазине.
        </p>
      </div>

      {/* Main Grid: Course Progress & Stats/Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Roadmap (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Дорожная карта курса */}
          <div className="bg-[#120a2c]/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" /> Дорожная карта курса
            </h3>
            
            <div className="relative border-l-2 border-purple-500/30 ml-3 space-y-6 pb-4">
              
              {roadmapSteps.map((step, index) => {
                let isCompleted = step.isCompleted || false;
                let isCurrent = false;
                let progressPct = 0;
                let details = step.desc;
                let hasDynamicChildren = false;
                let completedBlocks = 0;
                let totalBlocks = 0;

                if (step.lessonIndex !== undefined && lessons[step.lessonIndex]) {
                  const l = lessons[step.lessonIndex];
                  totalBlocks = l.blocks?.length || 0;
                  completedBlocks = l.completedBlockIds?.length || 0;
                  progressPct = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;
                  isCompleted = progressPct === 100;
                  isCurrent = progressPct > 0 && progressPct < 100;
                  hasDynamicChildren = true;
                } else if (step.lessonIndex !== undefined) {
                  // Future lessons not yet unlocked
                  isCompleted = false;
                } else {
                  isCurrent = !isCompleted && (index === 0 || roadmapSteps[index - 1]?.isCompleted);
                }

                if (!isCompleted && !isCurrent && index > 0 && !(roadmapSteps[index - 1]?.isCompleted)) {
                  // Locked state visually
                }

                const isExpanded = expandedStep === step.id;

                return (
                  <div key={step.id} className="relative pl-8 transition-all hover:translate-x-1 duration-300">
                    <div 
                      className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 flex items-center justify-center cursor-pointer transition-colors
                      ${isCompleted ? 'bg-emerald-500 border-[#120a2c]' : isCurrent ? 'bg-purple-500 border-[#120a2c]' : 'bg-[#120a2c] border-purple-500/50'}`}
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    ></div>
                    
                    <div 
                      className="cursor-pointer select-none group"
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    >
                      <h4 className="text-white text-lg font-bold leading-none flex items-center flex-wrap gap-2 group-hover:text-purple-300 transition-colors w-full">
                        {step.title}
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                        {isCompleted && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black uppercase">Пройдено</span>}
                        {step.xp && (
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded flex items-center gap-1 font-black uppercase ml-auto">
                            <Zap className="w-3 h-3" /> +{step.xp} XP
                          </span>
                        )}
                      </h4>
                      {!isExpanded && <p className="text-xs text-gray-500 mt-2 truncate">{details}</p>}
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-4 bg-white/5 border border-white/5 rounded-xl p-4 animate-fade-in shadow-lg">
                        <p className="text-sm text-gray-300 mb-3 leading-relaxed">{details}</p>
                        {step.action}
                        {hasDynamicChildren && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-[#070311]/50 border border-white/5 rounded-lg p-3 mt-4">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">Уроки: {completedBlocks} / {totalBlocks}</span>
                            <div className="flex-1 w-full sm:max-w-[200px] bg-[#120a2c] h-1.5 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all duration-700"
                                style={{ width: `${progressPct}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-black text-white">{progressPct}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Stats, Gamification (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Учебный прогресс: Статистика */}
          <div className="bg-[#120a2c]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Учебный прогресс (Статистика)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-2">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> Время на платформе
                </span>
                <span className="text-2xl font-black text-white">{daysOnPlatform}</span>
                <span className="text-[10px] text-gray-400 font-bold ml-1">ДНЕЙ</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" /> Пройдено уроков
                </span>
                <span className="text-2xl font-black text-white">{completedLessons}</span>
                <span className="text-[10px] text-gray-400 font-bold ml-1">/ {totalLessons}</span>
              </div>
              
              {/* Score / XP block */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" /> Баллы (XP)
                </span>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-2xl font-black text-indigo-400">{user.xp}</span>
                  <span className="text-[10px] text-gray-400 font-bold">XP</span>
                </div>
              </div>

              {/* Streak Card */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-2">
                  <Flame className="w-3.5 h-3.5 text-purple-400" /> Серия (Стрик)
                </span>
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-2xl font-black text-purple-400">{user.streak}</span>
                  <span className="text-[10px] text-gray-400 font-bold">ДНЕЙ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Достижения (Бейджи) */}
          <div className="bg-[#120a2c]/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Достижения (Бейджи)</h3>
                <span className="text-xs text-slate-500 font-bold">
                  {badges.filter(b => b.unlocked).length} / {badges.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {badges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      badge.unlocked 
                        ? 'bg-purple-500/5 border-purple-500/15' 
                        : 'bg-white/[0.02] border-white/5 opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      badge.unlocked ? 'bg-purple-500/10' : 'bg-white/5 text-gray-500'
                    }`}>
                      {badge.unlocked ? getBadgeIcon(badge.name) : <Lock className="w-4 h-4 text-gray-600" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white truncate">{badge.name}</span>
                        {badge.unlocked && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 pt-6 mt-4 border-t border-white/5">
              Выполняйте уроки и ведите дневник ежедневно, чтобы разблокировать новые награды на платформе.
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM SECTION: Store / Offers widget */}
      <div className="bg-[#120a2c]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" /> Магазин предложений
            </h3>
            <p className="text-sm text-gray-400 mt-1">Оплачивайте покупки антистресс-баллами (XP) или рублями.</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <span className="text-xs font-bold text-gray-400 uppercase">Ваш баланс:</span>
            <span className="text-lg font-black text-indigo-400">{user.xp} XP</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            { id: 1, title: 'Личная консультация (30 мин)', desc: 'Разбор ваших триггеров с куратором', priceMoney: '1 500 ₽', priceXp: '1500 XP' },
            { id: 2, title: 'Аудио-медитация "Чистый источник"', desc: 'Глубокое расслабление и настройка', priceMoney: '490 ₽', priceXp: '500 XP' },
            { id: 3, title: 'Секретный модуль: "Питание и ресурс"', desc: 'Избранные материалы для здоровья', priceMoney: '990 ₽', priceXp: '1000 XP' }
          ].map(offer => (
            <div key={offer.id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div>
                <h4 className="text-white font-bold mb-1">{offer.title}</h4>
                <p className="text-xs text-gray-400 mb-4">{offer.desc}</p>
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/10 py-2.5 rounded-lg text-xs font-bold uppercase overflow-hidden relative group">
                  <span className="relative z-10 flex items-center justify-center gap-2">Купить за {offer.priceMoney}</span>
                </Button>
                <div className="text-center text-[10px] text-gray-500 font-bold uppercase">или</div>
                <Button className="w-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 py-2.5 rounded-lg text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2">
                  <Zap className="w-3.5 h-3.5" /> Обменять за {offer.priceXp}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
